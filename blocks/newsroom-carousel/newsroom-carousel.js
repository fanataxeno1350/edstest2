import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, titleLinkRow, ...itemRows] = [...block.children];

  const carouselTitle = titleRow.querySelector('div').textContent.trim();
  const carouselTitleLink = titleLinkRow.querySelector('a')?.href;

  const section = document.createElement('section');
  section.classList.add('actionBtn'); // Corrected from 'actionBtn', 'undefined'
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  const titleAnchor = document.createElement('a');
  titleAnchor.title = carouselTitle;
  titleAnchor.href = carouselTitleLink || '#';

  const h2 = document.createElement('h2');
  h2.textContent = carouselTitle;
  titleAnchor.append(h2);
  container.append(titleAnchor);
  section.append(container);

  const owlCarousel = document.createElement('div');
  owlCarousel.classList.add('owl-carousel', 'owl-loaded', 'owl-drag');

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');

  const carouselItems = itemRows.filter((row) => row.children.length === 8);
  const carouselDots = itemRows.filter((row) => row.children.length === 1);

  carouselItems.forEach((row) => {
    const [
      imageCell,
      imageAltCell,
      dateCell,
      headlineCell,
      descriptionCell,
      readMoreLinkCell,
      readMoreIconCell,
      hierarchyTreeCell,
    ] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem);

    const li = document.createElement('li');
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlightCard');

    const highlightCardImg = document.createElement('div');
    highlightCardImg.classList.add('highlightCardImg');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        highlightCardImg.append(optimizedPic);
      }
    }
    highlightCard.append(highlightCardImg);

    const highlightCardContent = document.createElement('div');
    highlightCardContent.classList.add('highlightCardCntent');

    const publishAt = document.createElement('div');
    publishAt.classList.add('publishAt');
    const dateSpan = document.createElement('span');
    dateSpan.textContent = dateCell.textContent.trim();
    publishAt.append(dateSpan);
    highlightCardContent.append(publishAt);

    const h3 = document.createElement('h3');
    h3.textContent = headlineCell.textContent.trim();
    highlightCardContent.append(h3);

    const descriptionP = document.createElement('p');
    descriptionP.innerHTML = descriptionCell.innerHTML;
    highlightCardContent.append(descriptionP);

    const readMoreLinkAnchor = document.createElement('a');
    readMoreLinkAnchor.classList.add('bottomlink');
    readMoreLinkAnchor.href = readMoreLinkCell.querySelector('a')?.href || '#';
    readMoreLinkAnchor.textContent = 'Read More';

    const readMoreIconPicture = readMoreIconCell.querySelector('picture');
    if (readMoreIconPicture) {
      const readMoreIconImg = readMoreIconPicture.querySelector('img');
      if (readMoreIconImg) {
        const optimizedIcon = createOptimizedPicture(readMoreIconImg.src, readMoreIconImg.alt, false, [{ width: '20' }]);
        moveInstrumentation(readMoreIconImg, optimizedIcon.querySelector('img'));
        readMoreLinkAnchor.append(optimizedIcon);
      }
    }
    highlightCardContent.append(readMoreLinkAnchor);

    // Handle hierarchy-tree richtext field
    const hierarchyDiv = document.createElement('div');
    hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, hierarchyDiv);

    hierarchyDiv.querySelectorAll('ul').forEach((ul) => {
      ul.classList.add('nav-menu'); // Example class from original HTML if available, or a sensible default
    });
    hierarchyDiv.querySelectorAll('li').forEach((li) => {
      li.classList.add('nav-menu-item', 'list-item'); // Example classes
    });
    hierarchyDiv.querySelectorAll('a').forEach((a) => {
      a.classList.add('nav-menu-link'); // Example class
    });
    
    // Append all children from the temporary div to highlightCardContent
    while (hierarchyDiv.firstChild) {
      highlightCardContent.append(hierarchyDiv.firstChild);
    }

    highlightCard.append(highlightCardContent);
    li.append(highlightCard);
    owlItem.append(li);
    owlStage.append(owlItem);
  });

  owlStageOuter.append(owlStage);
  owlCarousel.append(owlStageOuter);

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.role = 'presentation';
  prevButton.classList.add('owl-prev');
  const prevSpan = document.createElement('span');
  prevSpan.classList.add('ScBtn', 'prev');
  const prevImg = document.createElement('img');
  // The original HTML has a hardcoded SVG path here. In EDS, we should rely on authored content.
  // If the icon is not provided via a block field, it should not be hardcoded.
  // For this exercise, assuming it's an authored asset.
  // Since the block model doesn't have explicit fields for nav icons, we'll omit them
  // or use a placeholder if absolutely necessary, but not hardcode paths.
  // For now, leaving it empty as per rule 16.
  prevImg.alt = 'svg file';
  prevSpan.append(prevImg);
  prevButton.append(prevSpan);

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.role = 'presentation';
  nextButton.classList.add('owl-next');
  const nextSpan = document.createElement('span');
  nextSpan.classList.add('ScBtn', 'next');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextSpan.append(document.createTextNode('Next '));
  nextSpan.append(nextImg);
  nextButton.append(nextSpan);

  owlNav.append(prevButton, nextButton);
  owlCarousel.append(owlNav);
  section.append(owlCarousel);

  const owlDots = document.createElement('ul');
  owlDots.id = 'highlightDots123'; // Assuming a unique ID is needed, otherwise remove
  owlDots.classList.add('owl-dots', 'pager', 'pagerbottom', 'newdots');

  carouselDots.forEach((row, index) => {
    const dotIconCell = row.querySelector('div');
    const dotIconPicture = dotIconCell.querySelector('picture');

    const li = document.createElement('li');
    li.tabIndex = 0;
    li.classList.add('owl-dot');
    if (index === 0) {
      li.classList.add('active');
    }
    moveInstrumentation(row, li);

    const circleBig = document.createElement('div');
    circleBig.classList.add('circle-big');

    if (dotIconPicture) {
      const dotIconImg = dotIconPicture.querySelector('img');
      if (dotIconImg) {
        const optimizedDotIcon = createOptimizedPicture(dotIconImg.src, dotIconImg.alt, false, [{ width: '20' }]);
        moveInstrumentation(dotIconImg, optimizedDotIcon.querySelector('img'));
        circleBig.append(optimizedDotIcon);
      }
    }
    li.append(circleBig);
    owlDots.append(li);
  });
  section.append(owlDots);

  block.innerHTML = '';
  block.append(section);

  // Carousel logic (simplified for EDS, no Owl Carousel JS)
  let currentIndex = 0;
  const items = [...owlStage.children];
  const dots = [...owlDots.children];

  const updateCarousel = () => {
    // Ensure items array is not empty before accessing offsetWidth
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    owlStage.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0px, 0px)`;

    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
      item.classList.toggle('center', i === currentIndex);
      // Remove cloned class from all items
      item.classList.remove('cloned');
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Initial update
  updateCarousel();
  // Recalculate on resize
  window.addEventListener('resize', updateCarousel);
}
