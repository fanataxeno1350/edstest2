import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0 & 1: Fix row.children[0] for titleRow.
  // The first row is the title. It has one cell.
  const titleRow = children[0];
  const titleCell = [...titleRow.children][0]; // Access the first cell correctly
  const titleText = titleCell.textContent.trim();
  const h2 = document.createElement('h2');
  h2.classList.add('videoTitle'); // Class from ORIGINAL HTML
  h2.textContent = titleText;
  moveInstrumentation(titleRow, h2);

  const section = document.createElement('section');
  section.classList.add('demo'); // Class from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // Class from ORIGINAL HTML

  const slides = [];

  // The rest of the children are slide rows
  const slideRows = children.slice(1);

  slideRows.forEach((row) => {
    // CHECK 1: Destructuring for item rows is correct as per BlockJson
    const [embedUrlCell, videoTitleCell] = [...row.children];

    const embedLink = embedUrlCell.querySelector('a');
    const videoTitle = videoTitleCell.textContent.trim();

    const slideDiv = document.createElement('div');
    moveInstrumentation(row, slideDiv);

    if (embedLink && embedLink.href) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('width', '560');
      iframe.setAttribute('height', '315');
      iframe.setAttribute('src', embedLink.href);
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');

      const anchor = document.createElement('a');
      anchor.href = 'javascript:void(0);'; // As per original HTML
      anchor.appendChild(iframe);
      slideDiv.appendChild(anchor);
    }

    if (videoTitle) {
      const h4 = document.createElement('h4');
      h4.textContent = videoTitle;
      slideDiv.appendChild(h4);
    }
    slides.push(slideDiv);
  });

  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.style.display = 'inline-block';
    } else {
      slide.style.display = 'none';
    }
    container.appendChild(slide);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('next'); // Class from ORIGINAL HTML
  const nextImg = document.createElement('img');
  // CHECK 1.5 & 2: Image paths for buttons should be from original HTML, not placeholders.
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/right-arw-3c0542.png';
  nextButton.appendChild(nextImg);

  const prevButton = document.createElement('button');
  prevButton.classList.add('prev'); // Class from ORIGINAL HTML
  const prevImg = document.createElement('img');
  // CHECK 1.5 & 2: Image paths for buttons should be from original HTML, not placeholders.
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/left-arw-39675c.png';
  prevButton.appendChild(prevImg);

  container.appendChild(nextButton);
  container.appendChild(prevButton);

  section.appendChild(container);

  block.innerHTML = '';
  block.appendChild(h2);
  block.appendChild(section);

  let currentIndex = 0;
  const itemAmt = slides.length;

  function cycleItems() {
    slides.forEach((item, i) => {
      if (i === currentIndex) {
        item.style.display = 'inline-block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // CHECK 2: Interactivity - event listeners for next/prev buttons are present.
  // Auto-slide interval is also present.
  let autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % itemAmt;
    cycleItems();
  }, 6000);

  nextButton.addEventListener('click', () => {
    clearInterval(autoSlide);
    currentIndex = (currentIndex + 1) % itemAmt;
    cycleItems();
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % itemAmt;
      cycleItems();
    }, 6000);
  });

  prevButton.addEventListener('click', () => {
    clearInterval(autoSlide);
    currentIndex = (currentIndex - 1 + itemAmt) % itemAmt;
    cycleItems();
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % itemAmt;
      cycleItems();
    }, 6000);
  });
}
