import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of index access for robustness
  const rows = [...block.children];
  const imageRow = rows.find(row => row.querySelector('picture, img'));
  const mainTextRow = rows.find(row => row.textContent.includes('Pursuant to the Composite Scheme')); // Based on original HTML content
  const scrollingTextRow = rows.find(row => row.textContent.includes('Scroll through to explore')); // Based on original HTML content

  // Create the main section wrapper
  const section = document.createElement('section');
  section.classList.add('demerged-info');
  moveInstrumentation(block, section);

  // Dot-left div
  const dotLeftDiv = document.createElement('div');
  dotLeftDiv.classList.add('dot-left');
  if (imageRow) { // Ensure imageRow exists
    const imgElement = imageRow.querySelector('img');
    if (imgElement) {
      const optimizedPic = createOptimizedPicture(imgElement.src, imgElement.alt, false, [{ width: '267' }]);
      moveInstrumentation(imgElement, optimizedPic.querySelector('img'));
      dotLeftDiv.append(optimizedPic);
    }
  }
  section.append(dotLeftDiv);

  // Container wrapper
  const containerWrapper = document.createElement('div');
  containerWrapper.classList.add('container-1600-wrp');

  // Main Text
  const mainTextDiv = document.createElement('div');
  mainTextDiv.classList.add('demerged-con', 'sp-para');
  if (mainTextRow) { // Ensure mainTextRow exists
    moveInstrumentation(mainTextRow, mainTextDiv);
    while (mainTextRow.firstChild) {
      const lineParent = document.createElement('div');
      lineParent.classList.add('lineParent');
      lineParent.setAttribute('aria-hidden', 'true');
      lineParent.style.position = 'relative';
      lineParent.style.display = 'block';
      lineParent.style.textAlign = 'center';

      const lineChild = document.createElement('div');
      lineChild.classList.add('lineChild');
      lineChild.setAttribute('aria-hidden', 'true');
      lineChild.style.position = 'relative';
      lineChild.style.display = 'block';
      lineChild.style.textAlign = 'center';
      lineChild.style.transform = 'translate(0px, 0px)';
      lineChild.style.opacity = '1';

      lineChild.append(mainTextRow.firstChild);
      lineParent.append(lineChild);
      mainTextDiv.append(lineParent);
    }
  }
  containerWrapper.append(mainTextDiv);

  // Scrolling Text
  const wowDiv = document.createElement('div');
  wowDiv.classList.add('wow', 'animate__', 'animate__fadeInUp', 'animated');
  wowDiv.style.visibility = 'visible';
  wowDiv.style.animationName = 'fadeInUp';

  const scrollingTextDiv = document.createElement('div');
  scrollingTextDiv.classList.add('demerged-con', 'scrolling-para', 'wow', 'animate__animated', 'animate__fade', 'animated');
  scrollingTextDiv.style.visibility = 'visible';
  scrollingTextDiv.style.animationName = 'float';
  if (scrollingTextRow) { // Ensure scrollingTextRow exists
    moveInstrumentation(scrollingTextRow, scrollingTextDiv);
    while (scrollingTextRow.firstChild) scrollingTextDiv.append(scrollingTextRow.firstChild);
  }
  wowDiv.append(scrollingTextDiv);
  containerWrapper.append(wowDiv);

  section.append(containerWrapper);

  block.textContent = '';
  block.append(section);
}
