import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('account-mainBox', 'mx-md-16');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'gx-5');

  // Heading row
  const headingRow = rows.shift();
  const headingCell = headingRow.firstElementChild;
  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('mt-8', 'mt-md-10', 'col-lg-4');
  const heading = document.createElement('p');
  heading.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  heading.textContent = headingCell.textContent.trim();
  moveInstrumentation(headingRow, heading);
  headingWrapper.append(heading);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');

  // Separate product items, ghee sections, and milk sections
  const productItems = [];
  const rightGheeSections = [];
  const rightMilkSections = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) { // product-item
      productItems.push(row);
    } else if (cells.length === 8) { // right-ghee-section
      rightGheeSections.push(row);
    } else if (cells.length === 5) { // right-milk-section
      rightMilkSections.push(row);
    }
  });

  productItems.forEach((row) => {
    const [imageCell, altTextCell, labelCell] = [...row.children];

    const productDiv = document.createElement('div');
    const smallImageDiv = document.createElement('div');
    smallImageDiv.classList.add('milk_ghee_smallImag', 'ghee-packet', 'product-hover');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('left-section-gheeBox', 'object-fit-contain');
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      smallImageDiv.append(optimizedPic);
    }

    const label = document.createElement('p');
    label.classList.add('product-subnames');
    label.textContent = labelCell.textContent.trim();
    smallImageDiv.append(label);

    moveInstrumentation(row, productDiv);
    productDiv.append(smallImageDiv);
    productMainBox.append(productDiv);
  });

  headingWrapper.append(productMainBox);
  rowDiv.append(headingWrapper);

  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');

  // Ghee sections
  rightGheeSections.forEach((row) => {
    const [
      bgImageDesktopCell,
      bgImageMobileCell,
      headlineCell,
      downloadIconCell,
      downloadLinkCell,
      downloadLinkLabelCell,
      tickIconCell,
      afterDownloadTextCell,
    ] = [...row.children];

    const gheeBox = document.createElement('div');
    gheeBox.classList.add('ghee_box');

    const accountMainBgBox = document.createElement('div');
    accountMainBgBox.classList.add('account-mainBg-box', 'w-100');

    const createBgImageDiv = (cell, className) => {
      const bgImageDiv = document.createElement('div');
      bgImageDiv.classList.add('annual-background_image--overlay', 'd-flex', className);
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('account-bgImg', 'with-overlay');
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        bgImageDiv.append(optimizedPic);
      }
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      bgImageDiv.append(overlay);
      return bgImageDiv;
    };

    accountMainBgBox.append(createBgImageDiv(bgImageDesktopCell, 'annual-bg-desktop'));
    accountMainBgBox.append(createBgImageDiv(bgImageMobileCell, 'annual-bg-mobile'));

    const rightSubtextBeforeDownload = document.createElement('div');
    rightSubtextBeforeDownload.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-subtext__BeforeDownload',
    );
    const beforeDownloadContent = document.createElement('div');
    beforeDownloadContent.classList.add('d-flex', 'flex-column', 'align-items-center');

    const gheeMobileHeading = document.createElement('div');
    gheeMobileHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
    gheeMobileHeading.innerHTML = headlineCell.innerHTML; // Correctly using innerHTML for richtext
    beforeDownloadContent.append(gheeMobileHeading);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const downloadIconDiv = document.createElement('div');
    downloadIconDiv.classList.add('download_icon');
    const downloadIconPicture = downloadIconCell.querySelector('picture');
    if (downloadIconPicture) {
      const downloadIconImg = downloadIconPicture.querySelector('img');
      const optimizedDownloadIcon = createOptimizedPicture(downloadIconImg.src, downloadIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(downloadIconPicture, optimizedDownloadIcon.querySelector('img'));
      downloadIconDiv.append(optimizedDownloadIcon);
    }
    downloadButton.append(downloadIconDiv);
    beforeDownloadContent.append(downloadButton);

    const downloadLinkWrapper = document.createElement('div');
    downloadLinkWrapper.classList.add('d-flex', 'mb-6');
    const downloadLinkDiv = document.createElement('div');
    const downloadLink = document.createElement('a');
    downloadLink.classList.add(
      'text-decoration-none',
      'download-report_btn',
      'cta-analytics',
      'download_report_btnBefore',
      'text-cream-100',
      'border',
      'border-2',
      'border-red-100',
      'border-maroon-100-hover',
      'border-red-300-active',
      'bg-red-100',
      'bg-maroon-100-hover',
      'bg-red-300-active',
    );
    const foundDownloadLink = downloadLinkCell.querySelector('a');
    if (foundDownloadLink) {
      downloadLink.href = foundDownloadLink.href; // Correctly reading href from aem-content
      downloadLink.setAttribute('download', 'report.pdf'); // Assuming a PDF download
    }
    downloadLink.textContent = downloadLinkLabelCell.textContent.trim();
    moveInstrumentation(downloadLinkCell, downloadLink);
    downloadLinkDiv.append(downloadLink);
    downloadLinkWrapper.append(downloadLinkDiv);
    beforeDownloadContent.append(downloadLinkWrapper);

    const whatsappLinkDiv = document.createElement('div');
    whatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    beforeDownloadContent.append(whatsappLinkDiv);

    rightSubtextBeforeDownload.append(beforeDownloadContent);
    accountMainBgBox.append(rightSubtextBeforeDownload);

    const rightSubtextAfterDownload = document.createElement('div');
    rightSubtextAfterDownload.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-section_subtextafter',
      'right-subtext__AfterDownload',
    );
    const afterDownloadContent = document.createElement('div');
    afterDownloadContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-around');

    const afterDownloadHeading = document.createElement('div');
    afterDownloadHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
    afterDownloadHeading.innerHTML = `<p>${afterDownloadTextCell.textContent.trim()}</p>`;
    afterDownloadContent.append(afterDownloadHeading);

    const tickButton = document.createElement('button');
    tickButton.classList.add('annual-report_DownloadBtn', 'my-9');
    const tickIconDiv = document.createElement('div');
    tickIconDiv.classList.add('tick_download');
    const tickIconPicture = tickIconCell.querySelector('picture');
    if (tickIconPicture) {
      const tickIconImg = tickIconPicture.querySelector('img');
      const optimizedTickIcon = createOptimizedPicture(tickIconImg.src, tickIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(tickIconPicture, optimizedTickIcon.querySelector('img'));
      tickIconDiv.append(optimizedTickIcon);
    }
    tickButton.append(tickIconDiv);
    afterDownloadContent.append(tickButton);

    const afterDownloadLinkWrapper = document.createElement('div');
    afterDownloadLinkWrapper.classList.add('d-flex', 'mb-6');
    const afterDownloadLinkDiv = document.createElement('div');
    const afterDownloadLink = document.createElement('button');
    afterDownloadLink.classList.add(
      'download-report_btn',
      'download_report_btnAfter',
      'disabled',
      'bg-light-pink',
      'border-light-pink',
      'text-cream-100',
    );
    afterDownloadLink.textContent = downloadLinkLabelCell.textContent.trim(); // Use the same label
    afterDownloadLinkDiv.append(afterDownloadLink);
    afterDownloadLinkWrapper.append(afterDownloadLinkDiv);
    afterDownloadContent.append(afterDownloadLinkWrapper);

    const afterDownloadWhatsappLinkDiv = document.createElement('div');
    afterDownloadWhatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    afterDownloadContent.append(afterDownloadWhatsappLinkDiv);

    rightSubtextAfterDownload.append(afterDownloadContent);
    accountMainBgBox.append(rightSubtextAfterDownload);

    gheeBox.append(accountMainBgBox);
    moveInstrumentation(row, gheeBox);
    rightSection.append(gheeBox);

    // Add event listener for download button
    downloadButton.addEventListener('click', () => {
      rightSubtextBeforeDownload.style.display = 'none';
      rightSubtextAfterDownload.style.display = 'flex'; // Use flex to match original HTML
    });
  });

  // Milk sections
  rightMilkSections.forEach((row) => {
    const [
      bgImageDesktopCell,
      bgImageMobileCell,
      headlineCell,
      svgIconCell,
      whatsappLinkHtmlCell,
    ] = [...row.children];

    const milkSectionImage = document.createElement('div');
    milkSectionImage.classList.add('position-relative', 'milk-section_image');

    const accountMainBgBox = document.createElement('div');
    accountMainBgBox.classList.add('w-100', 'account-mainBg-box', 'd-flex');

    const createBgImageDiv = (cell, className) => {
      const bgImageDiv = document.createElement('div');
      bgImageDiv.classList.add('annual-background_image--overlay', 'd-flex', className);
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('account-bgImg', 'with-overlay');
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        bgImageDiv.append(optimizedPic);
      }
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      bgImageDiv.append(overlay);
      return bgImageDiv;
    };

    accountMainBgBox.append(createBgImageDiv(bgImageDesktopCell, 'annual-bg-desktop'));
    accountMainBgBox.append(createBgImageDiv(bgImageMobileCell, 'annual-bg-mobile'));

    const rightSubtextMilk = document.createElement('div');
    rightSubtextMilk.classList.add(
      'right-subtext',
      'position-absolute',
      'start-0',
      'end-0',
      'bottom-0',
      'right-subtext-milk',
    );
    const milkContent = document.createElement('div');
    milkContent.classList.add('d-flex', 'flex-column', 'align-items-center');

    const milkHeading = document.createElement('div');
    milkHeading.classList.add('ghee-mobile-heading', 'text-center', 'font-md-18', 'font-baskerville', 'leading-32');
    milkHeading.innerHTML = headlineCell.innerHTML; // Correctly using innerHTML for richtext
    milkContent.append(milkHeading);

    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('font-md-18', 'mt-6', 'text-center');
    milkContent.append(emptyDiv);

    const svgIconWrapper = document.createElement('div');
    svgIconWrapper.classList.add('my-9');
    const svgIconPicture = svgIconCell.querySelector('picture');
    if (svgIconPicture) {
      const svgIconImg = svgIconPicture.querySelector('img');
      const optimizedSvgIcon = createOptimizedPicture(svgIconImg.src, svgIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(svgIconPicture, optimizedSvgIcon.querySelector('img'));
      svgIconWrapper.append(optimizedSvgIcon);
    }
    milkContent.append(svgIconWrapper);

    const whatsappLinkDiv = document.createElement('div');
    whatsappLinkDiv.classList.add('Whatsapp-link', 'mb-8', 'text-center');
    whatsappLinkDiv.innerHTML = whatsappLinkHtmlCell.innerHTML; // Correctly using innerHTML for richtext
    milkContent.append(whatsappLinkDiv);

    rightSubtextMilk.append(milkContent);
    accountMainBgBox.append(rightSubtextMilk);
    milkSectionImage.append(accountMainBgBox);
    moveInstrumentation(row, milkSectionImage);
    rightSection.append(milkSectionImage);
  });

  rowDiv.append(rightSection);
  mainContainer.append(rowDiv);

  block.textContent = '';
  block.classList.add('container-xl', 'annualReport_mainBox');
  block.append(mainContainer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
