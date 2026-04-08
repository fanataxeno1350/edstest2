import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('FeaturedRecipes-module-scss-module__6qef7W__section');

  const container = document.createElement('div');
  container.classList.add('Container-module-scss-module__KjkAOW__container');
  section.append(container);

  const srtHeading = document.createElement('h2');
  srtHeading.classList.add('srt');
  srtHeading.textContent = 'Recipes';
  container.append(srtHeading);

  const inViewDiv = document.createElement('div');
  inViewDiv.classList.add('FeaturedRecipes-module-scss-module__6qef7W__inView');
  container.append(inViewDiv);

  const recipesGrid = document.createElement('div');
  recipesGrid.classList.add('FeaturedRecipes-module-scss-module__6qef7W__recipesGrid');
  inViewDiv.append(recipesGrid);

  const [headingRow, viewAllLinkRow, ...recipeRows] = [...block.children];

  // Heading and View All Link
  const recipeTitleDiv = document.createElement('div');
  recipeTitleDiv.classList.add(
    'FeaturedRecipes-module-scss-module__6qef7W__recipeTitle',
    'FeaturedRecipes-module-scss-module__6qef7W__animatedItem',
  );
  recipeTitleDiv.style.setProperty('--anim-offset', '80px');
  recipesGrid.append(recipeTitleDiv);

  const titleCellDiv = document.createElement('div');
  titleCellDiv.classList.add('FeaturedRecipes-module-scss-module__6qef7W__titleCell');
  recipeTitleDiv.append(titleCellDiv);

  const h2Title = document.createElement('h2');
  h2Title.classList.add('FeaturedRecipes-module-scss-module__6qef7W__title');
  h2Title.setAttribute('aria-hidden', 'true');
  moveInstrumentation(headingRow.firstElementChild, h2Title);
  h2Title.append(headingRow.firstElementChild.textContent);
  titleCellDiv.append(h2Title);

  const buttonDesktopDiv = document.createElement('div');
  buttonDesktopDiv.classList.add('FeaturedRecipes-module-scss-module__6qef7W__buttonDesktop');
  titleCellDiv.append(buttonDesktopDiv);

  const viewAllLink = viewAllLinkRow.querySelector('a');
  if (viewAllLink) {
    const viewAllButton = document.createElement('a');
    viewAllButton.classList.add(
      'Button-module-scss-module__VLzsWq__button',
      'Button-module-scss-module__VLzsWq__red',
    );
    viewAllButton.href = viewAllLink.href;
    moveInstrumentation(viewAllLink, viewAllButton);
    viewAllButton.textContent = viewAllLink.textContent;
    buttonDesktopDiv.append(viewAllButton);
  }

  // Recipes
  recipeRows.forEach((row, index) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add(
      `FeaturedRecipes-module-scss-module__6qef7W__recipe${index + 1}`,
      'FeaturedRecipes-module-scss-module__6qef7W__animatedItem',
    );
    recipeDiv.style.setProperty('--anim-offset', `${60 + index * 20}px`); // Adjusted offset for animation
    recipesGrid.append(recipeDiv);

    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));
    const linkEl = linkCell ? linkCell.querySelector('a') : document.createElement('a');

    const recipeCardItem = document.createElement('a');
    recipeCardItem.classList.add('RecipeCard-module-scss-module__wi15tW__recipesItem');
    recipeCardItem.href = linkEl.href;
    moveInstrumentation(row, recipeCardItem);
    recipeDiv.append(recipeCardItem);

    const recipesWrapper = document.createElement('div');
    recipesWrapper.classList.add('RecipeCard-module-scss-module__wi15tW__recipesWrapper');
    recipeCardItem.append(recipesWrapper);

    const imageCell = [...row.children].find((cell) => cell.querySelector('picture'));
    if (imageCell) {
      const recipesImage = document.createElement('div');
      recipesImage.classList.add('RecipeCard-module-scss-module__wi15tW__recipesImage');
      recipesWrapper.append(recipesImage);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          recipesImage.append(optimizedPic);
        }
      }
    }

    const recipesInfo = document.createElement('div');
    recipesInfo.classList.add('RecipeCard-module-scss-module__wi15tW__recipesInfo');
    recipesWrapper.append(recipesInfo);

    const titleCell = [...row.children].find(
      (cell) => !cell.querySelector('picture') && !cell.querySelector('a'),
    );
    if (titleCell) {
      const recipesName = document.createElement('div');
      recipesName.classList.add('RecipeCard-module-scss-module__wi15tW__recipesName');
      recipesInfo.append(recipesName);

      const h3Title = document.createElement('h3');
      moveInstrumentation(titleCell, h3Title);
      h3Title.textContent = titleCell.textContent;
      recipesName.append(h3Title);
    }

    const recipesButton = document.createElement('div');
    recipesButton.classList.add('RecipeCard-module-scss-module__wi15tW__recipesButton');
    recipesInfo.append(recipesButton);

    const svgImg = document.createElement('img');
    svgImg.alt = 'svg file';
    // The original HTML has a hardcoded SVG path, which is not ideal.
    // For this exercise, we will assume it's a static asset or needs to be fetched differently.
    // If the SVG was part of the EDS model, it would be read from a cell.
    // Since it's not in the model, we use the path from original HTML, but this is an exception
    // for static assets not part of the content model.
    svgImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357702.svg+xml';
    recipesButton.append(svgImg);
  });

  // Mobile View All Button
  const buttonMobileDiv = document.createElement('div');
  buttonMobileDiv.classList.add('FeaturedRecipes-module-scss-module__6qef7W__buttonMobile');
  recipesGrid.append(buttonMobileDiv);

  if (viewAllLink) {
    const viewAllMobileButton = document.createElement('a');
    viewAllMobileButton.classList.add(
      'Button-module-scss-module__VLzsWq__button',
      'Button-module-scss-module__VLzsWq__red',
    );
    viewAllMobileButton.href = viewAllLink.href;
    viewAllMobileButton.textContent = viewAllLink.textContent;
    buttonMobileDiv.append(viewAllMobileButton);
  }

  block.textContent = '';
  block.append(section);
}
