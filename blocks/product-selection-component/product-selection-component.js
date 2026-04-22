import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container-xl', 'annualReport_mainBox', 'product-selection-component');

  const accountMainBox = document.createElement('div');
  accountMainBox.classList.add('account-mainBox', 'mx-md-16');
  container.append(accountMainBox);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');
  accountMainBox.append(row);

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  row.append(leftSection);

  // Heading
  const headingCell = [...headingRow.children].find(c => c.textContent.trim()); // Content detection for heading
  const headingP = document.createElement('p');
  headingP.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  if (headingCell) {
    headingP.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, headingP);
  }
  leftSection.append(headingP);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');
  leftSection.append(productMainBox);

  // Right section (empty in EDS block structure, but present in original HTML for styling)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  row.append(rightSection);

  // Create the two main content boxes for right section (ghee and milk)
  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');
  gheeBox.style.display = 'none'; // Hidden by default
  rightSection.append(gheeBox);

  const milkBox = document.createElement('div');
  milkBox.classList.add('position-relative', 'milk-section_image');
  milkBox.style.display = 'none'; // Hidden by default
  rightSection.append(milkBox);

  // Populate Ghee Box (Before Download and After Download states)
  gheeBox.innerHTML = `
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
            <p><h3>Pure and tested—Aashirvaad Svasti Organic Ghee!</h3></p>
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
          <div class="Whatsapp-link mb-8 text-center"></div>
        </div>
      </div>
      <div class="right-subtext position-absolute start-0 end-0 bottom-0 right-section_subtextafter right-subtext__AfterDownload" style="display: none;">
        <div class="d-flex flex-column align-items-center justify-content-around">
          <div class="ghee-mobile-heading text-center font-md-18 font-baskerville leading-32">
            <p>Your monthly report of svasti ghee has<br>been downloaded!</p>
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
          <div class="Whatsapp-link mb-8 text-center"></div>
        </div>
      </div>
    </div>
  `;

  // Populate Milk Box
  milkBox.innerHTML = `
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
        <div class="font-md-18 mt-6 text-center"></div>
        <div class="my-9">
          <svg class="icon-downloaded">
            <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#whatsapp_icon"></use>
          </svg>
        </div>
        <div class="Whatsapp-link mb-8 text-center"><p>Check Your Milk Report Card on <a href="https://wa.me/message/GW56YICBZLQGI1" target="_blank" rel="noopener noreferrer">Whatsapp​<span class="cmp-link__screen-reader-only">opens in a new tab</span></a></p></div>
      </div>
    </div>
  `;

  productRows.forEach((productRow) => {
    const [imageCell, altTextCell, labelCell] = [...productRow.children];

    const productDiv = document.createElement('div');
    productMainBox.append(productDiv);

    const productItemDiv = document.createElement('div');
    productItemDiv.classList.add('milk_ghee_smallImag', 'product-hover');
    productDiv.append(productItemDiv);

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('left-section-gheeBox', 'object-fit-contain');
      moveInstrumentation(img, optimizedImg);
      productItemDiv.append(optimizedPic);
    }

    // Label
    const labelP = document.createElement('p');
    labelP.classList.add('product-subnames');
    labelP.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, labelP);
    productItemDiv.append(labelP);

    // Add specific classes based on product label for styling (e.g., 'ghee-packet', 'milk-packet')
    const labelText = labelCell.textContent.trim().toLowerCase();
    if (labelText.includes('ghee')) {
      productItemDiv.classList.add('ghee-packet');
      productItemDiv.dataset.productType = 'ghee'; // Custom data attribute for click handling
    } else if (labelText.includes('milk')) {
      productItemDiv.classList.add('milk-packet');
      productItemDiv.dataset.productType = 'milk'; // Custom data attribute for click handling
    }

    // Add click listener to product item
    productItemDiv.addEventListener('click', () => {
      // Remove 'active' class from all product items
      document.querySelectorAll('.milk_ghee_smallImag').forEach(item => item.classList.remove('active'));
      // Add 'active' class to the clicked item
      productItemDiv.classList.add('active');

      // Hide both right section content boxes
      gheeBox.style.display = 'none';
      milkBox.style.display = 'none';

      // Show the relevant box based on product type
      if (productItemDiv.dataset.productType === 'ghee') {
        gheeBox.style.display = 'block';
      } else if (productItemDiv.dataset.productType === 'milk') {
        milkBox.style.display = 'block';
      }
    });

    moveInstrumentation(productRow, productDiv);
  });

  // Add event listener for the download button in the ghee section
  const downloadReportLink = gheeBox.querySelector('.download_report_btnBefore');
  if (downloadReportLink) {
    downloadReportLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior for now

      // Simulate download (in a real scenario, this would trigger a file download)
      const downloadUrl = downloadReportLink.getAttribute('href');
      if (downloadUrl) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'report.pdf'; // Or derive filename from URL
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Toggle visibility of before/after download states
      gheeBox.querySelector('.right-subtext__BeforeDownload').style.display = 'none';
      gheeBox.querySelector('.right-subtext__AfterDownload').style.display = 'flex';
    });
  }

  block.innerHTML = '';
  block.append(container);
}
