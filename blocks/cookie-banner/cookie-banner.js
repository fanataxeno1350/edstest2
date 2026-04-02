import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Find rows based on content
  const headingRow = children.find(row => row.querySelector('h2, h1, h3, h4, h5, h6') || (row.children.length === 1 && row.firstElementChild.textContent.trim() !== '' && !row.querySelector('a') && !row.querySelector('p')));
  const descriptionRow = children.find(row => row.querySelector('p') && row !== headingRow);
  const readMoreLinkRow = children.find(row => row.querySelector('a') && row !== headingRow && row !== descriptionRow);
  const acceptAllLabelRow = children.find(row => row.textContent.trim().toLowerCase().includes('accept all') && row !== headingRow && row !== descriptionRow && row !== readMoreLinkRow);
  const onlyNecessaryLabelRow = children.find(row => row.textContent.trim().toLowerCase().includes('only necessary') && row !== headingRow && row !== descriptionRow && row !== readMoreLinkRow && row !== acceptAllLabelRow);

  // Filter out the identified rows to get only cookie setting rows
  const cookieSettingRows = children.filter(row =>
    row !== headingRow &&
    row !== descriptionRow &&
    row !== readMoreLinkRow &&
    row !== acceptAllLabelRow &&
    row !== onlyNecessaryLabelRow
  );

  // Create the main wrapper
  const epBannerWrapper = document.createElement('div');
  epBannerWrapper.classList.add(
    'ep-banner-wrapper',
    'fixed',
    'flex',
    'justify-start',
    'z-[1000]',
    'max-h-[100dvh]',
    'overscroll-none',
    'px-2',
    'py-2',
    'sm:px-5',
    'sm:py-5',
    'md:px-10',
    'md:py-10',
    'left-0',
    'max-md:right-0',
  );

  const bannerContent = document.createElement('div');
  bannerContent.classList.add(
    'relative',
    'font-theme',
    'text-main-text',
    'dark:text-main-text-dark',
    'rounded-lg',
    'transition-all',
    'duration-300',
    'ease-out',
    'w-full',
    'sm:w-full',
    'max-w-lg',
    'md:w-[32rem]',
    'bg-main-bg',
    'dark:bg-main-bg-dark',
    'shadow-light',
    'dark:shadow-dark',
    'p-4',
    'md:p-7',
  );

  // Close button (disabled in original, but we'll make it functional if needed)
  const closeButton = document.createElement('button');
  closeButton.classList.add(
    'rounded-tr-full',
    'rounded-br-full',
    'p-2',
    'group',
    'flex',
    'items-center',
    'justify-end',
    'absolute',
    'top-3',
    'right-3',
  );
  closeButton.setAttribute('aria-label', 'Close cookie banner');
  // Original HTML has an img inside, but it's not from a block field. We'll skip it for now.
  // If an SVG is provided in the model, it would be added here.
  // For now, it's an empty button as per original HTML structure.
  // Adding the image from the original HTML
  const closeButtonImg = document.createElement('img');
  closeButtonImg.alt = 'svg file';
  closeButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775118462091.svg+xml';
  closeButton.append(closeButtonImg);
  closeButton.disabled = true; // Keep it disabled as per original HTML

  const flexColContainer = document.createElement('div');
  flexColContainer.classList.add('flex', 'flex-col', 'max-h-full');

  const textContentContainer = document.createElement('div');
  textContentContainer.classList.add('space-y-2', 'mb-6');

  const heading = document.createElement('h2');
  heading.classList.add('text-2xl');
  if (headingRow) {
    moveInstrumentation(headingRow.firstElementChild, heading);
    heading.textContent = headingRow.firstElementChild.textContent;
  }

  const description = document.createElement('p');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow.firstElementChild, description);
    description.innerHTML = descriptionRow.firstElementChild.innerHTML;
  }

  textContentContainer.append(heading, description);

  const cookieSettingsGrid = document.createElement('div');
  cookieSettingsGrid.classList.add(
    'grid',
    'grid-cols-2',
    'sm:grid-cols-2',
    'gap-4',
    'max-w-lg',
    'mb-6',
  );

  cookieSettingRows.forEach((row) => {
    const settingContainer = document.createElement('div');
    settingContainer.classList.add('flex', 'items-center');
    moveInstrumentation(row, settingContainer);

    const cells = [...row.children];
    const labelCell = cells.find((cell) => !cell.querySelector('input[type="checkbox"]') && cell.textContent.trim() !== 'true' && cell.textContent.trim() !== 'false');
    const enabledCell = cells.find((cell) => cell.textContent.trim() === 'true' || cell.textContent.trim() === 'false');

    const switchButton = document.createElement('button');
    switchButton.classList.add(
      'group',
      'relative',
      'inline-flex',
      'h-5',
      'w-10',
      'shrink-0',
      'cursor-pointer',
      'disabled:cursor-not-allowed',
      'items-center',
      'justify-center',
      'rounded-full',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-action-bg',
      'focus:dark:ring-action-bg-dark',
      'focus:ring-offset-main-bg',
      'focus:dark:ring-offset-main-bg-dark',
      'focus:ring-offset-2',
    );
    switchButton.setAttribute('role', 'switch');
    switchButton.setAttribute('type', 'button');
    switchButton.setAttribute('tabindex', '0');

    const isEnabled = enabledCell && enabledCell.textContent.trim() === 'true';
    switchButton.setAttribute('aria-checked', isEnabled ? 'true' : 'false');
    if (isEnabled) {
      switchButton.dataset.headlessuiState = 'checked';
      switchButton.dataset.checked = '';
    }

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    srOnlySpan.textContent = 'Use setting';

    const bgSpan1 = document.createElement('span');
    bgSpan1.classList.add(
      'pointer-events-none',
      'absolute',
      'size-full',
      'rounded-md',
      'bg-main-bg',
      'dark:bg-main-bg-dark',
    );
    bgSpan1.setAttribute('aria-hidden', 'true');

    const bgSpan2 = document.createElement('span');
    bgSpan2.classList.add(
      'pointer-events-none',
      'absolute',
      'mx-auto',
      'h-4',
      'w-9',
      'rounded-full',
      'bg-control-bg',
      'dark:bg-control-bg-dark',
      'transition-colors',
      'duration-200',
      'ease-in-out',
      'group-data-[checked]:bg-action-bg',
      'group-data-[checked]:dark:bg-action-bg-dark',
      'group-data-[disabled]:grayscale-[0.5]',
    );
    bgSpan2.setAttribute('aria-hidden', 'true');

    const toggleSpan = document.createElement('span');
    toggleSpan.classList.add(
      'pointer-events-none',
      'absolute',
      'left-0',
      'inline-block',
      'size-5',
      'transform',
      'rounded-full',
      'border',
      'border-control-bg',
      'dark:border-control-bg-dark',
      'bg-main-bg',
      'dark:bg-main-bg-dark',
      'shadow',
      'ring-0',
      'transition-transform',
      'duration-200',
      'ease-in-out',
      'group-data-[checked]:translate-x-5',
    );
    toggleSpan.setAttribute('aria-hidden', 'true');

    switchButton.append(srOnlySpan, bgSpan1, bgSpan2, toggleSpan);

    const label = document.createElement('label');
    label.classList.add('pl-3', 'text-sm', 'select-none', 'cursor-pointer');
    if (labelCell) {
      moveInstrumentation(labelCell, label);
      label.textContent = labelCell.textContent;
    }
    // Ensure unique IDs for aria-labelledby and for attributes
    const labelId = `label-${label.textContent.replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`;
    const controlId = `control-${label.textContent.replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 9)}`;

    switchButton.setAttribute('aria-labelledby', labelId);
    label.setAttribute('id', labelId);
    label.setAttribute('for', controlId);
    switchButton.setAttribute('id', controlId);

    switchButton.addEventListener('click', () => {
      const currentState = switchButton.getAttribute('aria-checked') === 'true';
      const newState = !currentState;
      switchButton.setAttribute('aria-checked', newState ? 'true' : 'false');
      if (newState) {
        switchButton.dataset.headlessuiState = 'checked';
        switchButton.dataset.checked = '';
      } else {
        delete switchButton.dataset.headlessuiState;
        delete switchButton.dataset.checked;
      }
    });

    settingContainer.append(switchButton, label);
    cookieSettingsGrid.append(settingContainer);
  });

  const readMoreLinkWrapper = document.createElement('a');
  readMoreLinkWrapper.classList.add(
    'w-fit',
    'py-1',
    'text-sm',
    'rounded-md',
    'mb-5',
    'flex',
    'items-center',
    'gap-1',
    'hover:underline',
    'text-main-text',
    'dark:text-main-text-dark',
  );

  if (readMoreLinkRow) {
    const readMoreLink = readMoreLinkRow.querySelector('a');
    if (readMoreLink) {
      readMoreLinkWrapper.href = readMoreLink.href;
      moveInstrumentation(readMoreLinkRow.firstElementChild, readMoreLinkWrapper);
      const span = document.createElement('span');
      span.classList.add('font-medium');
      span.textContent = readMoreLink.textContent;
      readMoreLinkWrapper.append(span);
    }
  }

  // Placeholder for SVG icon, as it's not from block field
  const svgIcon = document.createElement('img');
  svgIcon.alt = 'svg file';
  svgIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1775118462107.svg+xml';
  readMoreLinkWrapper.append(svgIcon);

  const overflowDiv = document.createElement('div');
  overflowDiv.classList.add('overflow-y-auto', 'space-y-5');

  const actionButtonsGrid = document.createElement('div');
  actionButtonsGrid.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-4');

  const acceptAllButton = document.createElement('button');
  acceptAllButton.classList.add(
    'p-2.5',
    'rounded-md',
    'border',
    'border-action-bg',
    'dark:border-action-bg-dark',
    'bg-action-bg',
    'dark:bg-action-bg-dark',
    'text-action-text',
    'dark:text-action-text-dark',
    'hover:bg-action-bg/90',
    'hover:dark:bg-action-bg-dark/90',
  );
  if (acceptAllLabelRow) {
    moveInstrumentation(acceptAllLabelRow.firstElementChild, acceptAllButton);
    acceptAllButton.textContent = acceptAllLabelRow.firstElementChild.textContent;
  }
  acceptAllButton.addEventListener('click', () => {
    // Implement logic for accepting all cookies
    console.log('Accept All clicked');
    // Example: set all switches to checked
    cookieSettingsGrid.querySelectorAll('button[role="switch"]').forEach((button) => {
      button.setAttribute('aria-checked', 'true');
      button.dataset.headlessuiState = 'checked';
      button.dataset.checked = '';
    });
    // Optionally, hide the banner
    // epBannerWrapper.style.display = 'none';
  });

  const onlyNecessaryButton = document.createElement('button');
  onlyNecessaryButton.classList.add(
    'p-2.5',
    'rounded-md',
    'border',
    'border-action-bg',
    'dark:border-action-bg-dark',
    'bg-main-bg',
    'dark:bg-main-bg-dark',
    'text-main-text',
    'dark:text-main-text-dark',
    'hover:bg-action-bg/10',
    'hover:dark:bg-action-bg-dark/10',
  );
  if (onlyNecessaryLabelRow) {
    moveInstrumentation(onlyNecessaryLabelRow.firstElementChild, onlyNecessaryButton);
    onlyNecessaryButton.textContent = onlyNecessaryLabelRow.firstElementChild.textContent;
  }
  onlyNecessaryButton.addEventListener('click', () => {
    // Implement logic for accepting only necessary cookies
    console.log('Only Necessary clicked');
    // Example: set all switches to unchecked except for 'Necessary' (if it exists)
    cookieSettingsGrid.querySelectorAll('button[role="switch"]').forEach((button) => {
      const labelText = button.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelText);
      if (labelElement && labelElement.textContent.trim().toLowerCase() === 'necessary') {
        button.setAttribute('aria-checked', 'true');
        button.dataset.headlessuiState = 'checked';
        button.dataset.checked = '';
      } else {
        button.setAttribute('aria-checked', 'false');
        delete button.dataset.headlessuiState;
        delete button.dataset.checked;
      }
    });
    // Optionally, hide the banner
    // epBannerWrapper.style.display = 'none';
  });

  actionButtonsGrid.append(acceptAllButton, onlyNecessaryButton);

  flexColContainer.append(
    textContentContainer,
    cookieSettingsGrid,
    readMoreLinkWrapper,
    overflowDiv,
    actionButtonsGrid,
  );
  bannerContent.append(closeButton, flexColContainer);
  epBannerWrapper.append(bannerContent);

  block.textContent = '';
  block.append(epBannerWrapper);
}
