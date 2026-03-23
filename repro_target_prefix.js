
function getTopLevelBlocks(cleanCSS) {
    const blocks = [];
    let depth = 0;
    let start = 0;
    let inString = false, quoteChar = "", inComment = false;

    for (let i = 0; i < cleanCSS.length; i++) {
        const char = cleanCSS[i], next = cleanCSS[i + 1];

        if (!inString && !inComment && char === "/" && next === "*") { inComment = true; i++; continue; }
        if (inComment && char === "*" && next === "/") { inComment = false; i++; continue; }
        if (inComment) continue;

        if ((char === '"' || char === "'") && cleanCSS[i - 1] !== "\\") {
            if (!inString) { inString = true; quoteChar = char; }
            else if (char === quoteChar) inString = false;
        }

        if (!inString) {
            if (char === "{") depth++;
            else if (char === "}") {
                depth--;
                if (depth === 0) {
                    blocks.push(cleanCSS.substring(start, i + 1).trim());
                    start = i + 1;
                }
            } else if (char === ";" && depth === 0) {
                blocks.push(cleanCSS.substring(start, i + 1).trim());
                start = i + 1;
            }
        }
    }
    return blocks.filter(Boolean);
}

function prefixCSSClasses(cssString, prefix) {
    const blocks = getTopLevelBlocks(cssString);

    return blocks.map(block => {
        const firstBrace = block.indexOf("{");
        if (firstBrace === -1) return "";

        let selector = block.substring(0, firstBrace).trim();
        const content = block.substring(firstBrace + 1, block.length - 1);

        const cleanSelector = selector.replace(/\/\*[\s\S]*?\*\//g, "").trim();

        if (cleanSelector.startsWith("@")) {
            if (cleanSelector.startsWith("@media")) {
                return `${selector} { ${prefixCSSClasses(content, prefix)} }`;
            }
            return block;
        }

        const knownTags = ["div", "span", "a", "p", "header", "footer", "section", "aside", "ul", "li", "img", "svg", "button", "nav", "h1", "h2", "h3", "h4", "h5", "h6", "input", "label", "article", "video", "source", "main", "figure", "figcaption", "ol", "iframe"];

        selector = selector.split(/\s+/).map((part) => {
            if (/^[a-zA-Z_-]/.test(part) && !part.startsWith(".") && !part.startsWith("#") && !part.startsWith(":") && !part.includes(".") && !knownTags.includes(part.toLowerCase())) {
                return "." + part;
            }
            return part;
        }).join(" ");

        const prefixedSelector = selector.replace(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g, (_, className) => {
            let normalizedName = className;
            if (normalizedName.startsWith("cmp-")) normalizedName = normalizedName.substring(4);
            else if (normalizedName.startsWith("aem-")) normalizedName = normalizedName.substring(4);

            if (normalizedName.startsWith(prefix)) return `.${normalizedName}`;
            return `.${prefix}${normalizedName}`;
        });

        return `${prefixedSelector} { ${content} }`;
    }).filter(Boolean).join("\n\n");
}

const prefix = "text-and-media-";
const testCase = ".layout-portrait { color: red; } img.layout-portrait { color: blue; } .cmp-text-and-media--image-container.layout-portrait { width: 100%; }";

console.log("Prefix:", prefix);
const result = prefixCSSClasses(testCase, prefix);
console.log("Output:", result);
