import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionTitleRow = children[0];
  const descriptionRow = children[1];
  const aboutPointerImageRow = children[2];
  const aboutMainImageRow = children[3];
  const featuresTitleRow = children[4];
  const featureItemRows = children.slice(5);

  const aboutSection = document.createElement('section');
  aboutSection.classList.add('about-section'); // Outer block already has this class from AEM, but original HTML also has it on the <section> tag. Keeping it.

  // About Us Section
  const aboutUsContainer = document.createElement('div');
  aboutUsContainer.classList.add('container');

  const aboutUsRow = document.createElement('div');
  aboutUsRow.classList.add('row', 'align-items-center');

  const descriptionCol = document.createElement('div');
  descriptionCol.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  moveInstrumentation(descriptionRow, descriptionCol);

  // description is richtext, use a div to contain its innerHTML
  const descriptionDiv = document.createElement('div');
  descriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';

  const aboutPointerPicture = aboutPointerImageRow.querySelector('picture');
  if (aboutPointerPicture) {
    const aboutPointerImg = aboutPointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(
      aboutPointerImg.src,
      aboutPointerImg.alt,
      false,
      [{ width: '750' }],
    );
    optimizedPointerPic.querySelector('img').classList.add('img-fluid', 'about-pointer');
    moveInstrumentation(aboutPointerImageRow, optimizedPointerPic.querySelector('img'));
    descriptionDiv.append(optimizedPointerPic); // Append to the div, not a p
  }
  descriptionCol.append(descriptionDiv); // Append the div to the column

  const mainImageCol = document.createElement('div');
  mainImageCol.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  moveInstrumentation(aboutMainImageRow, mainImageCol);

  const aboutMainPicture = aboutMainImageRow.querySelector('picture');
  if (aboutMainPicture) {
    const aboutMainImg = aboutMainPicture.querySelector('img');
    const optimizedMainPic = createOptimizedPicture(
      aboutMainImg.src,
      aboutMainImg.alt,
      false,
      [{ width: '750' }],
    );
    optimizedMainPic.querySelector('img').classList.add('img-fluid');
    moveInstrumentation(aboutMainImageRow, optimizedMainPic.querySelector('img'));
    mainImageCol.append(optimizedMainPic);
  }

  aboutUsRow.append(descriptionCol, mainImageCol);
  aboutUsContainer.append(aboutUsRow);

  // Features Section
  const featuresContainer = document.createElement('div');
  featuresContainer.classList.add('container');

  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');

  const featuresTitle = document.createElement('h4');
  moveInstrumentation(featuresTitleRow, featuresTitle);
  featuresTitle.textContent = featuresTitleRow.children[0]?.textContent.trim() || '';
  aboutContainer.append(featuresTitle);

  const featuresRow = document.createElement('div');
  featuresRow.classList.add('row');

  featureItemRows.forEach((row) => {
    const featureCol = document.createElement('div');
    featureCol.classList.add('col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(row, featureCol);

    // Feature item rows have a fixed schema: [featureImage, featureTitle, featureDescription]
    const [featureImageCell, featureTitleCell, featureDescriptionCell] = [...row.children];

    if (featureImageCell) {
      const featureImagePicture = featureImageCell.querySelector('picture');
      if (featureImagePicture) {
        const featureImg = featureImagePicture.querySelector('img');
        const optimizedFeaturePic = createOptimizedPicture(
          featureImg.src,
          featureImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedFeaturePic.querySelector('img').classList.add('img-fluid');
        featureCol.append(optimizedFeaturePic);
      }
    }

    const featureTitle = document.createElement('h5');
    if (featureTitleCell) {
      featureTitle.textContent = featureTitleCell.textContent.trim();
    }
    featureCol.append(featureTitle);

    const featureDescription = document.createElement('p'); // Original HTML uses <p> for feature description
    if (featureDescriptionCell) {
      // Feature description is richtext, but original HTML uses a <p>
      // We need to extract the innerHTML of the <p> inside the cell to avoid <p><p> nesting
      featureDescription.innerHTML = featureDescriptionCell.querySelector('p')?.innerHTML ?? featureDescriptionCell.textContent.trim() ?? '';
    }
    featureCol.append(featureDescription);
    featuresRow.append(featureCol);
  });

  aboutContainer.append(featuresRow);
  featuresContainer.append(aboutContainer);

  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  sectionTitle.textContent = sectionTitleRow.children[0]?.textContent.trim() || '';
  aboutSection.append(sectionTitle);
  aboutSection.append(aboutUsContainer);
  aboutSection.append(featuresContainer);

  block.replaceChildren(aboutSection);
}
