import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...socialLinkRows] = [...block.children];

  // Create main container
  const container = document.createElement('div');
  container.classList.add('container');

  // Create footer header row
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  // Logo section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  // Logo Link (aem-content) is in logoLinkRow
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '#'; // Fallback if no link is provided
  }

  // Logo (reference) is in logoRow
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.title = img.title || ''; // Copy title if present
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social links section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    // Social Link (aem-content)
    const socialLinkCell = [...row.children].find(cell => cell.querySelector('a'));
    const foundLink = socialLinkCell ? socialLinkCell.querySelector('a') : null;

    if (foundLink) {
      const li = document.createElement('li');
      const socialLink = document.createElement('a');
      socialLink.href = foundLink.href;
      socialLink.target = '_blank'; // Assuming social links open in new tab

      // Example: Detect social media type from href for specific classes
      if (foundLink.href.includes('facebook.com')) {
        li.classList.add('fb');
        // Add SVG for Facebook (hardcoded as per rule 16 for static UI elements)
        socialLink.innerHTML = `
          <svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAAZRJREFUWEftltFNwzAQhn2NHxMpj5HsSOkG3YCyQTcoTABMUJgANiArdILCBIxApNh5pQNEMXEFUqmcxNa1UZDsV1/uvvvPdzkgEz8wcT7iAbEVOjuCcRzHYRiuAWChlKoMgO9CiEdb8LMBarAoijZKqfu+4ACQl2V5OypgkiRZEAS7NrhJsT8sowO6wGnS0QHTNM2VUmvrko1ZYq0epfTTFm50BRljNwDw2gO4b5tmf3K/lVL2NtKxPaqLOecvhJC7DsAnl3HSlSQKkDGWA4Dx/QkhUL5/gVFOPKAeSy4deGo7OQWzLIvruv7CJHXRQc0YWwDABwawrZpTdzuVmHO+JITsMIBKqQcppR5PVscJ0GIwDwZtmmZVVdV20PDHwAmQc673uI2t8w67ayHEm60PV8C+P4dVTErpvCiKwsrYdczoEs1ms6sj58uOrfmwVpkgXJbVw3Jhm4nJbnJzcPKD2gMa3pF/g5gm9F2MVc8r6BUcUuA//OqeCSErUyJSyvlQgjb3qEFtEwBr4wG9glgFsN9/A/ubqSotIjiQAAAAAElFTkSuQmCC" x="0" y="0" width="30" height="30"></image>
          </svg>
        `;
      } else if (foundLink.href.includes('twitter.com')) {
        li.classList.add('tw');
        // Add SVG for Twitter (hardcoded as per rule 16 for static UI elements)
        socialLink.innerHTML = `
          <svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAAXNSR0IArs4c6QAAA0NJREFUWEftmF9OIkEQxrtAn+CBR5NuyRxBbrDcYPcE6glWT6CeYPUE4gncPQHeQI9AnB7jI4nwJFA7NaEnTdM9XQNsYjbME2H6z4+vur6qBsQXf+CL84k94LYR2iu4cwWVUleIeMZY+C7LslvGuJUhUsoTIcSj/SUA/NFaX/jWWgtxkiSd+Xz+jIgJY/O+1vqJMa4YcnR0lDSbzSEA2Gu/TCaT/ng8HrMAzUIHBwfPQoiONcmA0HekgsiVHs3n8/77+/soBumDA4DR5+dn5fxgkhwfH39HxDIUi8Xix9vb228CUUoRfAEphHjSWverADudTqfVaj3bynHgaM3KLFZKXedCXS03H89msx6pRWocHh4OzTEAgNs0TS9DkM4PomHlWjHlozajlBrmKn0zIZ1Opz06L0op+o7eFU+j0Th7fX19cDeUUt7naq0kHSL2six7icFFFaQBbtLkYRqkaXpO76SUFwDwy1XYbEyOkH+mKJQPAJynaTrgwLEAlyAnAEBqFUmDiJfGYqSUAwA49Si8BpcfqRut9QpwDDQaYrOAlPIMAO6tBQuL8dgSJRJlvOuRteHYCloho01/GrWMxVDSeGyp/C2ISKbuNeKdKWhBlkkjhChN1kPwMQURH7Is41QmLys7xGZ2lcUopUqFl+Mrq0RMvdohts4jJQ2ZtVGpTBrblkhhrXWPAxIaU1tBC9K2GApl4W11TTwGvzEgLWyH1K7L1LGEFI4Bue+3AnRB7Lrsmjgi9rnVw4bcGNDXABSH2qrLIROvo+JGgATXbrfJbkxHs7Knqctk4rPZzB4X7Xx2EmJfAyCEuDMmTt2KCanHxK+11jdcFWsrWNUAhELq9pZCCHYnXgvQB2c3AJ66XIY01FvGlGQDxuDsSuPU5TKkrolX3UXMeizAbrd7ulgs3B4u2J2Ergue3rKyE2eVOo/XsRqAUEiX63l7S1+4KxUMtFHsBiB0XXBMvCyTtQBD18SPj4/iThI73PTeDSkivgCAmVvcc3ipur56Fdz0DuuDjjWz1hyvia8B+qoE9w4bUjXUzK5VDc/11QtIkPZkCik3rCHIJEk4f6WI0Wi08i8Fy2Y45+1fjdkDbqvsXsH/XsG/07ZKSIssn8EAAAAAElFTkSuQmCC" x="0" y="0" width="30" height="30"></image>
          </svg>
        `;
      }
      // Add other social media icons as needed

      moveInstrumentation(row, socialLink);
      li.append(socialLink);
      socialWrap.append(li);
    }
  });

  socialCol.append(socialWrap);
  footerHeader.append(socialCol);

  container.append(footerHeader);
  block.innerHTML = '';
  block.append(container);
}
