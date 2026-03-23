
function purgeCSSNative(combinedCSS, htmlSnippet, includeGlobals = false, prefix) {
    const classesInHtml = new Set();
    const classRegex = /class="([^"]+)"/g;
    let match;
    while ((match = classRegex.exec(htmlSnippet)) !== null) {
        match[1].split(/\s+/).forEach(cls => {
            const trimmed = cls.trim();
            if (trimmed) {
                classesInHtml.add(trimmed);
                if (prefix && trimmed.startsWith(prefix)) {
                    let unprefixed = trimmed.substring(prefix.length);
                    classesInHtml.add(unprefixed);
                    if (unprefixed.startsWith("-")) classesInHtml.add(unprefixed.substring(1));
                }
            }
        });
    }

    const blocks = combinedCSS.split('}').map(s => s.trim() + '}').filter(s => s.length > 5);
    const keptBlocks = [];

    blocks.forEach((block) => {
        const firstBrace = block.indexOf("{");
        if (firstBrace === -1) return;
        const selector = block.substring(0, firstBrace).trim();
        const content = block.substring(firstBrace + 1, block.length - 1);

        const individualSelectors = selector.split(",").map(s => s.trim());
        const matchingSelectors = individualSelectors.filter(s => {
            const classesInSelector = s.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
            if (!classesInSelector) return includeGlobals;

            if (!classesInSelector.some(cls => {
                const className = cls.substring(1);
                if (classesInHtml.has(className)) return true;
                if (className.startsWith("cmp-") && classesInHtml.has(className.substring(4))) return true;
                if (className.startsWith("aem-") && classesInHtml.has(className.substring(4))) return true;
                return false;
            })) return false;

            let baseSelector = s.replace(/:+:?[a-zA-Z-0-9_]+(\([^)]*\))?/g, "").trim() || "*";
            if (prefix) {
                baseSelector = baseSelector.replace(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g, (_, className) => {
                    let normalizedName = className;
                    if (normalizedName.startsWith("cmp-")) normalizedName = normalizedName.substring(4);
                    else if (normalizedName.startsWith("aem-")) normalizedName = normalizedName.substring(4);

                    if (normalizedName.startsWith(prefix)) return `.${normalizedName}`;
                    return `.${prefix}${normalizedName}`;
                });
            }

            // Simplified check: Check if the HTML snippet contains the resulting classes
            const classesInBase = baseSelector.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
            if (!classesInBase) return true;
            return classesInBase.every(cls => {
                const c = cls.substring(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`class="[^"]*\\b${c}\\b[^"]*"`);
                return regex.test(htmlSnippet);
            });
        });

        if (matchingSelectors.length > 0) {
            keptBlocks.push(`${matchingSelectors.join(", ")} { ${content} }`);
        }
    });

    return keptBlocks;
}

const prefix = "text-and-media-";
const html = `
<div class="text-and-media--image-container text-and-media-animate-image-container-up-fade text-and-media-in-viewport text-and-media-slide-up" data-slide-type="slide-up" data-slide-no-wrap="">
    <picture class="text-and-media--image-container__picture">
        <source srcset="https://s7g10.scene7.com/is/image/qic/Frame21472233754_HomePage_Scarp_En?w=500&amp;h=400" type="image/webp">
        <img src="/image.png" class="text-and-media--image-container__image text-and-media-layout-portrait text-and-media-animate-image-zoom-out text-and-media-in-viewport" role="img">
    </picture>
</div>
`;

console.log("--- Targeted Test for layout-portrait ---");
const css = ".layout-portrait { color: red; }";
const result = purgeCSSNative(css, html, false, prefix);
console.log("Input CSS:", css);
console.log("Output Result:", result);

if (result.length > 0 && result[0].includes("layout-portrait")) {
    console.log("SUCCESS!");
} else {
    console.log("FAILURE!");
}
