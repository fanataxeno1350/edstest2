import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level) {
  rootUl.querySelectorAll(':scope > li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        triggerEl = span;
      }
    } else {
      triggerEl = anchor;
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      if (level === 1) {
        subWrap.classList.add('has-footer-sub-child');
      } else if (level === 2) {
        subWrap.classList.add('has-footer-inner-sub-child');
      }
      subWrap.append(nested);
      li.append(subWrap);

      if (triggerEl) {
        // Add the SVG icon if it's not a direct link at the top level
        if (anchor && level > 0) { // Only add SVG for nested items with links
          const svgSpan = document.createElement('span');
          svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          triggerEl.after(svgSpan);
          svgSpan.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });
        }
        triggerEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logoLink, copyrightText
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  // Item rows start from index 3
  const itemRows = children.slice(3);

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('hiddenlogo1');
    optimizedImg.width = 200;
    optimizedImg.height = 30;
    optimizedImg.style.width = 'auto';
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  // Filter social link items: 2 cells, second cell contains a richtext hierarchy (ul)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('ul');
  });

  socialLinkItems.forEach((row) => {
    const [linkCell, hierarchyCell] = [...row.children]; // Destructuring is fine here as it's a fixed 2-cell structure
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Social links typically open in new tab
    }
    moveInstrumentation(linkCell, anchor);

    // SVG icons from original HTML
    const href = anchor.href;
    if (href.includes('facebook')) {
      li.classList.add('fb');
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAZRJREFUWEftltFNwzAQhn2NHxMpj5HsSOkG3YCyQTcoTABMUJgANiArdILCBIxApNh5pQNEMXEFUqmcxNa1UZDsV1/uvvvPdzkgEz8wcT7iAbEVOjuCcRzHYRiuAWChlMoMgO9CiEdb8LMBarAoijZKqfu+4ACQl2V5OypgkiRZEAS7NrhJsT8sowO6wGnS0QHTNM2VUmvrko1ZYq1epfTTFm50BRljNwDw2gO4b5tmf3K/lVL2NtKxPaqLOecvhJC7DsAnl3HSlSQKkDGWA4Dx/QkhUL5/gVFOPKAeSy4deGo7OQWzLIvruv7CJHXRQc0YWwDABwawrZpTdzuVmHO+JITsMIBKqQcppR5PVscJ0..." x="0" y="0" width="30" height="30"></image></svg>';
    } else if (href.includes('twitter')) {
      li.classList.add('tw');
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA0NJREFUWEftmF9OIkEQxrtAn+CBR5NuyRxBbrDcYPcE6glWT6CeYPUE4gncPQHeQI9AnB7jI4nwJFA7NaEnTdM9XQNsYjbME2H6z4+vur6qBsQXf+CL84k94LYR2iu4cwWVUleIeMZY+C7LslvGuJUhUsoTIcSj/SUA/NFaX/jWWgtxkiSd+Xz+jIgJY/O+1vqJMa4YcnR0lDSbzSEA2Gu/TCaT/ng8HrMAzUIHBwfPQoiONcmA0HekgsiVHs3n8/77+/soBumDA4DR5+dn5fxgkhwfH39HxDIUi8Xix9vb228CUUoRfAEphHjSWverADudTqfVaj3bynHgaM1KLFZKXedCXS13H89msx6pRWocHh4OzTEAgNs0TS9DkM4PomHlWjFlozajlBrmKn0zIZ1Opz06L0op+o7eFU+j0Th7fX19cDeUUt7naq0kHSL2six7icFFFaQBbtLkYRqkaXpO76SUFwDwy1XYbEyOkH+mKJQPAJynaTrgwLEAlyAnAEBqFUmDiJfGYqSUAwA49Si8BpcfqRut9QpwDDQaYrOAlPIMAO6tBQuL8dgSJRJlvOuRteHYCloho01/GrWMxVDSeGyp/C2ISKbuNeKdKWhBlkkjhChN1qNwMQURH7Is41QmLys7xGZ2lcUopUqFl+Mrq0RMvdohts4jJQ2ZtVGpTBrblkhhrXWPAxIaU1tBC9K2GApl4W11TTwGvzEgLWyH1K7L1LGEFI4Bue+3AnRB7Lrsmjgi9rnVw4bcGNDXABSH2qrLIROvo+JGgATXbrfJbkxHs7Knqctk4rPZzB4X7Xx2EmJfAyCEuDMmTt2KAnHxK+11jdcFWsrWNUAhELq9pZCCHYnXgvQB2c3AJ66XIY01FvGlGQDxuDsSuPU5TKkrolX3UXMeizAbrd7ulgs3B4u2J2Ergue3rKyE2eVOo/XsRqAUEiX63l7S1+4KxUMtFHsBiB0XXBMvCyTtQBD18SPj4/iThI73PTeDSkivgCAmVvcc3ipur56Fdz0DuuDjjWz1hyvia8B+qoE9w4bUjXUzK5VDc/11QtIkPZkCik3rCHIJEk4f6WI0Wi08i8Fy2Y45+2/jdkDbqvsXsH/XsG/07ZKSIssn8EAAAAASUVORK5CYII=" x="0" y="0" width="30" height="30"></image></svg>';
    } else if (href.includes('instagram')) {
      li.classList.add('inst');
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA5FJREFUWEftWG1O4zAQ9ZTyC9Bm/yE50YYb0BtsbwAnWDgBcALoCYATUE4AewK4AbkBRbER/8iq5Q+kmc2gJHK+nbogtNpIlarEY788v3kzDrAvfsEXx8f+HYCu67qvr6/bvV7vB2Psu8K8BQDfqnYCEf8wxgLl2XMURQ9RFHlPT08Tnd1rZNCyLGt9ff2AMbbDGNvWmVB3DCISwBMp5WVTTC3Azc1Nd2Vl5QYAXN1FFxlHQOfz+bCO0UqABK7f798xxqxFFl0gJkDEoZTSK8aWANK2rq2t3X00c0UgxOTLy8sgCAJVs+Ustm37mLSxAAvLCBkJIXJrlxjknN9/IHvXAHAZRRFl/mmFhAIhhOoQeQZt2/7JGLtZBhUlLQFMfN/fSu9zzvcA4KJiqweqFnMMcs4PkzfrnJE0BACkH/qRJRUT7LcQguzq/eKcbwMAJWLuQsR9KeU4vZkDaNs27T9pUPciMOf9fn88mUxyxpvY1AkA/EomC8IwHKR20qD1nA6LDI6VCdtAemEY7rZVBAK6urp6g4huwjJZCbFLcipdsf7Hvu/vVzLIOdcF6M1ms2HREureyHVdKwxD0nZrNTIGCACTt7e3nPMnyXWAiO8AAMBDxJEqdl3zNwYYr5/TSItvngghRimzOho3BhiG4ZYidB1bGgohbglkstXPTeI2BegJIQYKI6SrSrErIG4FEEMlhqylVoumAHNeZts2sdHWUOSqg+M4V4iY+WGRTSOAxeBYf9jmRfQ81mFmZx8KMG5cF9niTjFGDFIZm81mW6n/1dVTldXYnPfSrvkzkoTF54wjKeVZCqLJ3BHxXEp5qIytbBDUFzJlkACWGktistfrHVM5o8WS8waBy15EtxE2BphUily9TBkgEPS/qgQ6jnOKiBmbdcm1FIAJyLPpdDpqq8cJc6dxidzTyfhGgDqlqJAAjUdHqtGIeNGxQ29stxZtWKkv9KiRSDSYtlNtJl4itZiExYZVp7bq7JTJmKx2v0tJnSnxqXuN8mUCoCm2+dBEkV11uEyksU2NpZRZN11iUGmJPp3Fqka4EiDddBxnBxGvlslO21xRFO0+Pj5el7qbusAEJJ1bO2diG5jC8wAAjnzfz46audLXNFnF0bHj2o3D6YPR9Xw+HzWdDLW+sFI12NjYINOlwzZ9wLQQsROzinc+0KFqOp3etlWhWg0ukybTubQYNF3EJP4/QBP2KPYv1E4ISFh4AkYAAAAASUVORK5CYII=" x="0" y="0" width="30" height="30"></image></svg>';
    } else if (href.includes('youtube')) {
      li.classList.add('yt');
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAm9JREFUWEftmNFt2zAQhnm0Hm1AfTNMGuAIyQbJBPEGTSZoOkGcCZpOYHeCthMkmaDuBgJMGn6rH/xmQVefIQmSLNmSqNh+EJ8ESMf7dHf8jySwCx9w4XysBbTNUBvBs0RQKaUix5vNxgUAtwjEcRwveud5XvxcFrwwxf1+XzmOc8cYu2GMKUQkkBisrIO87xDRA4AVY4yA//q+P10ul7nwuYBSyi+MsRcbiBq2Y631c9ZuD3AwGIw45z9rOGjC5FZr/ZacaA9QSvkaprUJh1XneNNa3xYCKqVc3/f/VZ21ye/X6/Wn1WpF9bkbqQhKKWlBUATPNhDx2hgzywUcDocjRDxX/e2YEPHBGDPNBRRCPALAt4rhe6d5m6pbRPxqjIkVJJvi8dbZUxXArTZO5/P5gxDinnP+hIi2WvmstSaO3BokctLA0iMCjAyklJV/MukMEb8bYx5LUjwFgM+l6WiVhRFM2lAX6nQ646pz7VZtZr5UioUQjQAmonkDAJMqaT8pYARapT7PAhjqK6nD1bHyOSmg67pur9d7QcTSdX0SQALrdrukBrQaC/eKedH8cEBKJyJO6u4dD8pMHQ2L/jjc4E4a6CjFQl2z1f1ijFFzj9X/2EI49P5gqyM5IN2ycWBrGwTBaLFY/C7qJFcA8MfWiaV9aled6iQXv2GlP5dSUgSPCqpllIrMZ1rr6+TLvTNJzYXSCO/2OHpvjPlxEDCMotWWqSZtSl5yF0ly4rDB34U7kQ9JOR3gOeczEufscfMoYDYKdN2RvOag644gCEq3MQDY3RxEVyFlr0Ha262a9RibtRFsI2gbAVv7i6/B/67JGjl3UeQYAAAAAElFTkSuQmCC" x="0" y="0" width="30" height="30"></image></svg>';
    } else if (href.includes('linkedin')) {
      li.classList.add('in');
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAg5JREFUWEftWFFOwkAQ3SH94qufJLsf9Qb2BnIS6wnAEygnEE8g3sAbiDeoJ6AJuwl/1qR8UTJ2DJBmuwvU2Gqm+wmzMy9vZm7MFtiJHzhxfKwFWDVD58ugEGLAGAsQ0e10OtPVajVaLBZRVUbK3jcyKIS4yxzd550hYrRcLv04juOyQarYGwFyzmcA4OmOEfFWKTWuErDs3QLAXq/nOY4zMzlCxEel1LBskCp2thR/MMZcA4OBUuq5SsCyd20pHgLAg+YslFL6ZQNUtbfKjBDiCgCokxkividJMm66QSj2+epg1dTo913XdbvdLmXlu7YBIEqSJDyUFVuTvFoAvkkpd/pIZZBVAGlm4WwkKczZkG3hZHI22TcEbADR5mw+n99s/+OcBwDwZLJ1HOdivV4PEPEYWYoRsa+UCnVftQFExEmWxqBEqcRpmvr6OK0NYAlgedOplLKf/+HUADIqjSiKdktJEwCnjLGXrGk+GWPUxdf72NXnfd0AR/muJ2Cc80sAIJUojNKN/EzyjVgnQOtoFEKQVBnliWSnEYDZ/mhdLDzPc9M0pYXEqItNAfRNurZFlG3sxo2pMQb1btSpsi3FLcAtUy2Dx3TYoWUhPxHaGjSpfMug7U2SfVn4lYW1rcHC+q0N8j+rQc/zCt9lCCy9wPKvMHqp0TFJ0r70kv2xMdp38Q/fJrtrLYP/nsEv9hasOXFhAv8AAAAASUVORK5CYII=" x="0" y="0" width="30" height="30"></image></svg>';
    }
    li.append(anchor);
    socialWrap.append(li);
  });

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Filter footer link blocks: 3 cells, third cell contains "Footer Links" text
  const footerLinkBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[2].textContent.includes('Footer Links');
  });

  // Filter footer link items: 3 cells, third cell contains a richtext hierarchy (ul)
  const footerLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[2].querySelector('ul');
  });

  footerLinkBlocks.forEach((row, blockIndex) => {
    const [blockTitleCell, blockTitleLinkCell, linksContainerCell] = [...row.children]; // Destructuring is fine here

    const linkBlocksDiv = document.createElement('div');
    linkBlocksDiv.classList.add('link-blocks');
    footerMenu.append(linkBlocksDiv);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    // Add specific class if present in original HTML
    if (blockTitleCell.textContent.trim().toLowerCase() === 'what we do') {
      headDiv.classList.add('what-we-do-footer-links');
    } else if (blockTitleCell.textContent.trim().toLowerCase() === 'careers') {
      headDiv.classList.add('careers-footer-links');
    }
    linkBlocksDiv.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, blockTitleLink);
    span.append(blockTitleLink);

    const small = document.createElement('small');
    span.append(small);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');
    headDiv.append(ul);

    // Filter footerLinkItems that belong to this block
    // This logic needs to be more robust if items are not strictly sequential or equally distributed.
    // A common pattern is to have a "parent" reference in the item model, or rely on order.
    // For now, assuming sequential distribution as in the original code, but this is a potential weak point.
    const itemsPerBlock = footerLinkItems.length / footerLinkBlocks.length;
    const startIndex = blockIndex * itemsPerBlock;
    const endIndex = startIndex + itemsPerBlock;
    const itemsForThisBlock = footerLinkItems.slice(startIndex, endIndex);

    itemsForThisBlock.forEach((itemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...itemRow.children]; // Destructuring is fine here
      const li = document.createElement('li');

      let rootEl;
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span'); // Use span if no link
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(itemRow, rootEl);
      li.appendChild(rootEl);

      const hierarchyRootContent = hierarchyCell?.innerHTML;
      if (hierarchyRootContent && hierarchyRootContent.trim() !== '') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyRootContent;
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          const svgSpan = document.createElement('span');
          svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          rootEl.after(svgSpan);

          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child');
          moveInstrumentation(hierarchyCell, wrapper); // Move instrumentation for the original cell to the new wrapper
          while (hierarchyRoot.firstChild) {
            wrapper.append(hierarchyRoot.firstChild);
          }
          li.appendChild(wrapper);

          // Apply classes from original HTML to nested elements
          wrapper.querySelectorAll('a').forEach(a => {
            if (a.parentElement.tagName === 'LI' && a.parentElement.parentElement.tagName === 'UL' && a.parentElement.parentElement.parentElement.classList.contains('has-footer-inner-sub-child')) {
              // No specific class for inner <a> tags in original HTML, but ensure they are not flattened
            }
          });
          wrapper.querySelectorAll('ul').forEach(ulEl => {
            // No specific class for inner <ul> tags in original HTML, but ensure they are not flattened
          });
          wrapper.querySelectorAll('li').forEach(liEl => {
            // No specific class for inner <li> tags in original HTML, but ensure they are not flattened
          });


          const toggleHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active');
            li.classList.toggle('active');
          };

          rootEl.addEventListener('click', toggleHandler);
          svgSpan.addEventListener('click', toggleHandler);

          transformNestedLists(wrapper, 1); // Pass the wrapper to transformNestedLists
        }
      }
      ul.append(li);
    });
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  // Filter secondary nav links: 2 cells, second cell does NOT contain a richtext hierarchy (ul)
  const secondaryNavLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[1].querySelector('ul');
  });

  secondaryNavLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring is fine here
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    secondaryNav.append(li);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.children[0].textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
}
