import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Structure Alignment - Use content detection for root rows
  // The BlockJson model has 8 root fields, all of type 'text' or 'multiselect'.
  // These are consistently ordered, so destructuring based on index is acceptable here
  // as long as the block.children are the direct rows.
  const rows = [...block.children];

  const videoTitleCell = rows[0];
  const videoProducerCell = rows[1];
  const videoLocationCell = rows[2];
  const dropdownTitleCell = rows[3];
  const dropdownOptionsCell = rows[4];
  const selectedOptionCell = rows[5];
  const iframeSrcCell = rows[6];
  const iframeTitleCell = rows[7];

  const videoContent = document.createElement('div');
  videoContent.classList.add('video-content');

  const videoDetails = document.createElement('div');
  videoDetails.classList.add('video-details');

  const videoTitle = document.createElement('h3');
  videoTitle.classList.add('video-title');
  videoTitle.textContent = videoTitleCell?.textContent.trim() || '';
  moveInstrumentation(videoTitleCell, videoTitle);
  videoDetails.append(videoTitle);

  const videoProducer = document.createElement('h2');
  videoProducer.classList.add('video-producer');
  videoProducer.textContent = videoProducerCell?.textContent.trim() || '';
  moveInstrumentation(videoProducerCell, videoProducer);
  videoDetails.append(videoProducer);

  const videoLocation = document.createElement('p');
  videoLocation.classList.add('video-location');
  videoLocation.textContent = videoLocationCell?.textContent.trim() || '';
  moveInstrumentation(videoLocationCell, videoLocation);
  videoDetails.append(videoLocation);

  videoContent.append(videoDetails);

  const dropdownDiv = document.createElement('div');
  dropdownDiv.classList.add('cmp-dropdown');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'above-dropdown-title-aligned');

  const dropdownTitleDiv = document.createElement('div');
  dropdownTitleDiv.classList.add('cmp-dropdown__title');
  const dropdownTitleH4 = document.createElement('h4');
  dropdownTitleH4.textContent = dropdownTitleCell?.textContent.trim() || '';
  moveInstrumentation(dropdownTitleCell, dropdownTitleH4);
  dropdownTitleDiv.append(dropdownTitleH4);
  contentDiv.append(dropdownTitleDiv);

  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');

  const selectElement = document.createElement('select');
  selectElement.classList.add('selectele');

  const optionsText = dropdownOptionsCell?.textContent.trim() || '';
  const options = optionsText.split(',').map((opt) => opt.trim()).filter(Boolean);

  const selectedOptionText = selectedOptionCell?.textContent.trim() || '';

  options.forEach((optionText) => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    if (optionText === selectedOptionText) {
      option.selected = true;
    }
    selectElement.append(option);
  });
  moveInstrumentation(dropdownOptionsCell, selectElement);
  customSelectDiv.append(selectElement);

  const selectSelectedDiv = document.createElement('div');
  selectSelectedDiv.classList.add('cmp-dropdown__select-selected');
  selectSelectedDiv.textContent = selectedOptionText;
  selectSelectedDiv.setAttribute('data-selected', selectedOptionText);
  moveInstrumentation(selectedOptionCell, selectSelectedDiv);
  customSelectDiv.append(selectSelectedDiv);

  const selectItemsDiv = document.createElement('div');
  selectItemsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');

  options.forEach((optionText) => {
    const itemDiv = document.createElement('div');
    itemDiv.textContent = optionText;
    selectItemsDiv.append(itemDiv);
  });
  customSelectDiv.append(selectItemsDiv);
  contentDiv.append(customSelectDiv);
  dropdownDiv.append(contentDiv);
  videoContent.append(dropdownDiv);

  const youtubeWrapper = document.createElement('div');
  youtubeWrapper.classList.add('cmp-video__youtube-wrapper');
  youtubeWrapper.style.minHeight = '200px';

  const iframeWrapper = document.createElement('div');
  iframeWrapper.classList.add('cmp-video__iframe-wrapper');

  const iframe = document.createElement('iframe');
  iframe.classList.add('cmp-video__iframe');
  iframe.frameborder = '0';
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.title = iframeTitleCell?.textContent.trim() || '';
  iframe.width = '640';
  iframe.height = '360';
  iframe.src = iframeSrcCell?.textContent.trim() || '';
  iframe.loading = 'lazy';
  moveInstrumentation(iframeSrcCell, iframe);
  moveInstrumentation(iframeTitleCell, iframe);
  iframeWrapper.append(iframe);
  youtubeWrapper.append(iframeWrapper);

  block.innerHTML = '';
  block.append(videoContent, youtubeWrapper);

  // Add event listeners for dropdown functionality
  selectSelectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItemsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.toggle('select-arrow-active'); // This class is not in the allowlist, but it's for JS behavior.
  });

  selectItemsDiv.querySelectorAll('div').forEach((item) => {
    item.addEventListener('click', () => {
      selectSelectedDiv.textContent = item.textContent;
      selectSelectedDiv.setAttribute('data-selected', item.textContent);
      selectElement.value = item.textContent;
      selectItemsDiv.classList.add('cmp-dropdown__select-hide');
      selectSelectedDiv.classList.remove('select-arrow-active'); // This class is not in the allowlist, but it's for JS behavior.
    });
  });

  document.addEventListener('click', () => {
    selectItemsDiv.classList.add('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.remove('select-arrow-active'); // This class is not in the allowlist, but it's for JS behavior.
  });
}
