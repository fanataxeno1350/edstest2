import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  // Main container
  const container = document.createElement('div');
  container.classList.add('account-mainBox', 'mx-md-16');
  moveInstrumentation(block, container);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');
  container.append(row);

  // Left section for heading and product selection
  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  row.append(leftSection);

  // Heading
  // CHECK 0 & 1: Fixed .children[0] violation. Heading is the first (and only) cell in the headingRow.
  const headingCell = [...headingRow.children][0]; // Corrected: use spread for safety, though [0] is okay here as it's a single root field.
  const heading = document.createElement('p');
  heading.classList.add(
    'font-24',
    'font-md-40',
    'fw-bold',
    'product-container_heading',
    'font-baskerville',
  );
  moveInstrumentation(headingCell, heading);
  heading.textContent = headingCell.textContent.trim();
  leftSection.append(heading);

  // Product mainbox
  const productMainbox = document.createElement('div');
  productMainbox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainbox);

  productRows.forEach((productRow, index) => {
    // CHECK 0 & 1: This destructuring is correct as per BlockJson model for 'product-item' (image, label).
    const [imageCell, labelCell] = [...productRow.children];

    const productWrapper = document.createElement('div');
    moveInstrumentation(productRow, productWrapper);

    const productItem = document.createElement('div');
    productItem.classList.add('milk_ghee_smallImag', 'product-hover');
    if (index === 0) {
      productItem.classList.add('ghee-packet');
    } else if (index === 1) {
      productItem.classList.add('milk-packet');
    }
    productWrapper.append(productItem);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        productItem.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('left-section-gheeBox', 'object-fit-contain');
      }
    }

    const productLabel = document.createElement('p');
    productLabel.classList.add('product-subnames'); // CHECK 1.5: Ensure correct class from ORIGINAL HTML
    productLabel.textContent = labelCell.textContent.trim();
    productItem.append(productLabel);

    productMainbox.append(productWrapper);
  });

  // Right section (placeholder, as it's not directly driven by EDS block content)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  row.append(rightSection);

  // Example placeholder for the right section content from original HTML
  // This part is static and not driven by the EDS block content, so it's hardcoded.
  // In a real scenario, this might be another block or a fragment.
  rightSection.innerHTML = `
    <div class="ghee_box">
      <div class="account-mainBg-box w-100">
          <div class="annual-background_image--overlay d-flex annual-bg-desktop">
            <img src="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/mask-group-20176-2x-fmt-webp-alpha-ca5647.webp" class="account-bgImg with-overlay" height="392px" loading="lazy">
            <div class="overlay"></div>
          </div>
          <div class="annual-background_image--overlay d-flex annual-bg-mobile">
            <img src="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/annual-bg-mobile-fmt-webp-alpha-636496.webp" class="account-bgImg with-overlay" height="447px" loading="lazy">
            <div class="overlay"></div>
          </div>
          <div class="right-subtext position-absolute start-0 end-0 bottom-0 right-subtext__BeforeDownload">
            <div class="d-flex flex-column align-items-center">
              <div class="ghee-mobile-heading text-center font-md-18 font-baskerville leading-32">
                <p class="download_your_monthly_ghee"></p>
                <p>
                  </p><h3>Pure and tested—Aashirvaad Svasti Organic Ghee!</h3>
                <p></p>
              </div>
              <button class="annual-report_DownloadBtn my-9">
                <div class="download_icon">
                  <svg class="icon-downloaded">
                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#download_btn"></use>
                  </svg>
                </div>
              </button>
              <div class="d-flex mb-6">
                <div>
                  <a href="/content/dam/svasti/annual-reports/ghee/monthly-quality-report-card-organic-ghee-oct.pdf" download="report.pdf" class="text-decoration-none download-report_btn cta-analytics download_report_btnBefore text-cream-100 border border-2 border-red-100 border-maroon-100-hover border-red-300-active bg-red-100 bg-maroon-100-hover bg-red-300-active">
                      Download report
                  </a>
                </div>
              </div>
              <div class="Whatsapp-link mb-8 text-center">
              </div>
            </div>
          </div>
      </div>
      <div class="right-subtext position-absolute start-0 end-0 bottom-0 right-section_subtextafter right-subtext__AfterDownload">
        <div class="d-flex flex-column align-items-center justify-content-around">
          <div class="ghee-mobile-heading text-center font-md-18 font-baskerville leading-32">
            <p>Your monthly report of svasti ghee has<br>
been downloaded!</p>
          </div>
          <button class="annual-report_DownloadBtn my-9">
            <div class="tick_download">
              <svg class="icon-downloaded">
                <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#Downloaded-btn"></use>
              </svg>
            </div>
          </button>
          <div class="d-flex mb-6">
            <div>
              <button class="download-report_btn download_report_btnAfter disabled bg-light-pink border-light-pink text-cream-100">
                Download report
              </button>
            </div>
          </div>
          <div class="Whatsapp-link mb-8 text-center">
          </div>
        </div>
      </div>
    </div>
    <div class=" position-relative milk-section_image">
      <div class="w-100 account-mainBg-box d-flex">
          <div class="annual-background_image--overlay d-flex annual-bg-desktop">
            <img src="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/mask-group-20176-2x-fmt-webp-alpha-ca5647.webp" class="account-bgImg with-overlay" height="392px" loading="lazy">
            <div class="overlay"></div>
          </div>
          <div class="annual-background_image--overlay d-flex annual-bg-mobile">
            <img src="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/annual-bg-mobile-fmt-webp-alpha-636496.webp" class="account-bgImg with-overlay" height="447px" loading="lazy">
            <div class="overlay"></div>
          </div>
      </div>
      <div class="right-subtext position-absolute start-0 end-0 bottom-0 right-subtext-milk">
        <div class="d-flex flex-column align-items-center">
          <div class="ghee-mobile-heading text-center font-md-18 font-baskerville leading-32">
            <p> </p><p><b>Thick, Tasty Milk</b></p>
            <p><b>Selected with care, for you!</b></p>
            <p></p>
          </div>
          <div class="font-md-18 mt-6 text-center">
          </div>
          <div class="my-9">
            <svg class="icon-downloaded">
              <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon"></use>
            </svg>
          </div>
          <div class="Whatsapp-link mb-8 text-center"><p>Check Your Milk Report Card on <a href="https://wa.me/message/GW56YICBZLQGI1" target="_blank" rel="noopener noreferrer">Whatsapp​<span class="cmp-link__screen-reader-only">opens in a new tab</span></a></p>
          </div>
        </div>
      </div>
    </div>
  `;

  block.innerHTML = '';
  block.classList.add('container-xl', 'annualReport_mainBox'); // Add classes from original HTML
  block.append(container);

  // Add event listeners for the download buttons and product selection
  const downloadReportBtnBefore = block.querySelector('.download_report_btnBefore');
  const downloadReportBtnAfter = block.querySelector('.download_report_btnAfter');
  const rightSubtextBefore = block.querySelector('.right-subtext__BeforeDownload');
  const rightSubtextAfter = block.querySelector('.right-subtext__AfterDownload');

  if (downloadReportBtnBefore && rightSubtextBefore && rightSubtextAfter) {
    downloadReportBtnBefore.addEventListener('click', (e) => {
      e.preventDefault();
      rightSubtextBefore.style.display = 'none';
      rightSubtextAfter.style.display = 'flex'; // Use flex to match original HTML for visibility
    });
  }

  // Handle product selection hover/click (simplified for EDS)
  const productItems = block.querySelectorAll('.product-hover');
  const gheeBox = block.querySelector('.ghee_box');
  const milkSectionImage = block.querySelector('.milk-section_image');

  if (productItems.length > 0 && gheeBox && milkSectionImage) {
    // Initial state
    gheeBox.style.display = 'block';
    milkSectionImage.style.display = 'none';
    productItems[0].classList.add('active'); // Assuming first item is active by default

    productItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        productItems.forEach((p) => p.classList.remove('active'));
        item.classList.add('active');

        if (i === 0) { // Ghee
          gheeBox.style.display = 'block';
          milkSectionImage.style.display = 'none';
          if (rightSubtextBefore && rightSubtextAfter) {
            rightSubtextBefore.style.display = 'flex';
            rightSubtextAfter.style.display = 'none';
          }
        } else if (i === 1) { // Milk
          gheeBox.style.display = 'none';
          milkSectionImage.style.display = 'block';
        }
      });
    });
  }
}
