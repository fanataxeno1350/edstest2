import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const layoutContainerDesktop = document.createElement('div');
  layoutContainerDesktop.classList.add('layout-container', '-dark', 'desktop-view');

  const uContainerDesktop = document.createElement('div');
  uContainerDesktop.classList.add('u-container', 'u-width-10');
  layoutContainerDesktop.append(uContainerDesktop);

  const heroModuleDesktop = document.createElement('div');
  heroModuleDesktop.classList.add('hero-text');
  uContainerDesktop.append(heroModuleDesktop);

  const heading = document.createElement('h2');
  heading.classList.add('causes-text');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.append(headingRow.firstElementChild.textContent);
  heroModuleDesktop.append(heading);

  const description = document.createElement('span');
  description.classList.add('causes-description');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  while (descriptionRow.firstElementChild.firstChild) {
    description.append(descriptionRow.firstElementChild.firstChild);
  }
  heroModuleDesktop.append(description);

  const homeCausesLists = document.createElement('div');
  homeCausesLists.classList.add('home-causes-lists');
  uContainerDesktop.append(homeCausesLists);

  const aofList1 = document.createElement('div');
  aofList1.classList.add('aof', 'aof-list');
  homeCausesLists.append(aofList1);

  const aofMiddle = document.createElement('div');
  aofMiddle.classList.add('aof', 'aof-middle');
  homeCausesLists.append(aofMiddle);

  const aofList2 = document.createElement('div');
  aofList2.classList.add('aof', 'aof-list');
  homeCausesLists.append(aofList2);

  itemRows.forEach((row, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('home-causes-item-lists');
    moveInstrumentation(row, itemDiv);

    // Access cells by first and last element, as per EDS block structure
    const linkCell = row.firstElementChild; // This is the cell containing the link
    const titleCell = row.lastElementChild; // This is the cell containing the title

    const foundLink = linkCell.querySelector('a');
    const link = document.createElement('a');
    link.classList.add('causes-link');
    if (foundLink) link.href = foundLink.href;
    moveInstrumentation(linkCell, link);

    // Extract image from the link cell if present, or create an empty span
    const picture = linkCell.querySelector('picture');
    const spanImage = document.createElement('span');
    spanImage.classList.add('home-causes-image');
    spanImage.setAttribute('data-animate', 'fade-up');
    spanImage.setAttribute('data-module', 'in-view');
    spanImage.setAttribute('data-offset', '50%');
    if (picture) {
      spanImage.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]));
    }
    link.prepend(spanImage);

    // Move content from the link cell (excluding the picture if it was there)
    // The original HTML shows the link text is directly inside the <a>, not in a separate div.
    // The title is in a div after the span image.
    const titleWrapper = document.createElement('div');
    titleWrapper.setAttribute('data-animate', 'fade-up');
    titleWrapper.setAttribute('data-module', 'in-view');
    titleWrapper.setAttribute('data-offset', '80%');
    moveInstrumentation(titleCell, titleWrapper);
    while (titleCell.firstChild) titleWrapper.append(titleCell.firstChild);
    link.append(titleWrapper);

    itemDiv.append(link);

    if (index === 0 || index === 1) {
      aofList1.append(itemDiv);
    } else if (index === 2 || index === 3 || index === 4) {
      aofMiddle.append(itemDiv);
    } else {
      aofList2.append(itemDiv);
    }
  });

  // Mobile View
  const layoutContainerMobile = document.createElement('div');
  layoutContainerMobile.classList.add('layout-container', '-dark', 'mobile-view');

  const uContainerMobile = document.createElement('div');
  uContainerMobile.classList.add('u-container', 'u-width-10');
  layoutContainerMobile.append(uContainerMobile);

  const aofMobileHeading = document.createElement('div');
  aofMobileHeading.classList.add('AOF-mobile-heading');
  uContainerMobile.append(aofMobileHeading);

  const mobileHeading = document.createElement('h2');
  mobileHeading.classList.add('causes-text');
  mobileHeading.textContent = heading.textContent;
  aofMobileHeading.append(mobileHeading);

  const mobileDescription = document.createElement('span');
  mobileDescription.classList.add('causes-description');
  mobileDescription.innerHTML = description.innerHTML;
  aofMobileHeading.append(mobileDescription);

  const homeCausesListMobile = document.createElement('ul');
  homeCausesListMobile.classList.add('home-causes-list');
  uContainerMobile.append(homeCausesListMobile);

  itemRows.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('home-causes-item-list');
    moveInstrumentation(row, li);

    // Access cells by first and last element, as per EDS block structure
    const linkCell = row.firstElementChild; // This is the cell containing the link
    const titleCell = row.lastElementChild; // This is the cell containing the title

    const foundLink = linkCell.querySelector('a');
    const link = document.createElement('a');
    link.classList.add('causes-link');
    if (foundLink) link.href = foundLink.href;
    moveInstrumentation(linkCell, link);

    // Extract image from the link cell if present, or create an empty span
    const picture = linkCell.querySelector('picture');
    const spanImage = document.createElement('span');
    spanImage.classList.add('home-causes-image');
    if (picture) {
      spanImage.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]));
    }
    link.prepend(spanImage);

    // Move content from the title cell
    const titleWrapper = document.createElement('div');
    moveInstrumentation(titleCell, titleWrapper);
    while (titleCell.firstChild) titleWrapper.append(titleCell.firstChild);
    link.append(titleWrapper);

    li.append(link);
    homeCausesListMobile.append(li);
  });

  block.textContent = '';
  block.append(layoutContainerDesktop, layoutContainerMobile);
}
