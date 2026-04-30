import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Structure Alignment - Using destructuring for root fields.
  // The block has 5 root rows, corresponding to the 5 fields in the BlockJson model.
  // Each row contains a single cell with text content.
  const [
    videoTitleRow,
    videoProducerRow,
    videoLocationRow,
    fruitOriginStoryRow,
    youtubeEmbedUrlRow,
  ] = [...block.children];

  // Extract the actual cells from the rows.
  const videoTitleCell = videoTitleRow.children[0];
  const videoProducerCell = videoProducerRow.children[0];
  const videoLocationCell = videoLocationRow.children[0];
  const fruitOriginStoryCell = fruitOriginStoryRow.children[0];
  const youtubeEmbedUrlCell = youtubeEmbedUrlRow.children[0];

  block.innerHTML = '';
  block.classList.add('aem-GridColumn', 'aem-GridColumn--default--12');

  const cmpVideo = document.createElement('div');
  cmpVideo.classList.add('cmp-video');
  cmpVideo.setAttribute('data-component', 'video');
  moveInstrumentation(block, cmpVideo);

  const videoContent = document.createElement('div');
  videoContent.classList.add('video-content');

  const videoDetails = document.createElement('div');
  videoDetails.classList.add('video-details');

  const videoTitle = document.createElement('h3');
  videoTitle.classList.add('video-title');
  moveInstrumentation(videoTitleCell, videoTitle);
  videoTitle.textContent = videoTitleCell.textContent.trim();
  videoDetails.append(videoTitle);

  const videoProducer = document.createElement('h2');
  videoProducer.classList.add('video-producer');
  moveInstrumentation(videoProducerCell, videoProducer);
  videoProducer.textContent = videoProducerCell.textContent.trim();
  videoDetails.append(videoProducer);

  const videoLocation = document.createElement('p');
  videoLocation.classList.add('video-location');
  moveInstrumentation(videoLocationCell, videoLocation);
  videoLocation.textContent = videoLocationCell.textContent.trim();
  videoDetails.append(videoLocation);

  videoContent.append(videoDetails);

  const cmpDropdown = document.createElement('div');
  cmpDropdown.classList.add('cmp-dropdown');
  cmpDropdown.setAttribute('data-component', 'dropdown');
  cmpDropdown.setAttribute('data-initialized', 'true');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'above-dropdown-title-aligned');

  const dropdownTitle = document.createElement('div');
  dropdownTitle.classList.add('cmp-dropdown__title');
  const h4 = document.createElement('h4');
  h4.textContent = 'Select the fruit\'s origin story'; // Hardcoded as per original HTML
  dropdownTitle.append(h4);
  contentDiv.append(dropdownTitle);

  const customSelect = document.createElement('div');
  customSelect.classList.add('cmp-dropdown__custom-select');

  const selectEl = document.createElement('select');
  selectEl.classList.add('selectele');
  moveInstrumentation(fruitOriginStoryCell, selectEl);

  // CHECK 1.5: Richtext fields with HTML content - Not applicable here, all are text/select.
  // The 'Fruit Origin Story' is a select field, its value is read as textContent.
  const options = ['Guava', 'Litchi', 'Apple', 'Orange', 'Mango', 'Mixed Fruit', 'Pineapple', 'Pomegranate'];
  const selectedValue = fruitOriginStoryCell.textContent.trim();
  let initialSelectedText = 'Guava';

  options.forEach((optionText) => {
    const optionEl = document.createElement('option');
    optionEl.value = optionText;
    optionEl.textContent = optionText;
    if (optionText === selectedValue) {
      optionEl.selected = true;
      initialSelectedText = optionText;
    }
    selectEl.append(optionEl);
  });
  customSelect.append(selectEl);

  const selectSelected = document.createElement('div');
  selectSelected.classList.add('cmp-dropdown__select-selected');
  selectSelected.setAttribute('data-selected', initialSelectedText);
  selectSelected.textContent = initialSelectedText;
  customSelect.append(selectSelected);

  const selectItems = document.createElement('div');
  selectItems.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');

  options.forEach((optionText) => {
    const itemDiv = document.createElement('div');
    itemDiv.textContent = optionText;
    // CHECK 2: Interactivity - Added event listener for dropdown items.
    itemDiv.addEventListener('click', () => {
      selectEl.value = optionText;
      selectSelected.textContent = optionText;
      selectSelected.setAttribute('data-selected', optionText);
      selectItems.classList.add('cmp-dropdown__select-hide');
    });
    selectItems.append(itemDiv);
  });
  customSelect.append(selectItems);

  // CHECK 2: Interactivity - Added event listener for dropdown toggle.
  selectSelected.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItems.classList.toggle('cmp-dropdown__select-hide');
    // Corrected class name from 'select-arrow-active' to 'selectele-arrow-active'
    // based on typical EDS dropdown patterns and the select element's class.
    selectSelected.classList.toggle('selectele-arrow-active');
  });

  // CHECK 2: Interactivity - Added global click listener to close dropdown.
  document.addEventListener('click', () => {
    selectItems.classList.add('cmp-dropdown__select-hide');
    selectSelected.classList.remove('selectele-arrow-active');
  });

  contentDiv.append(customSelect);
  cmpDropdown.append(contentDiv);
  videoContent.append(cmpDropdown);
  cmpVideo.append(videoContent);

  const youtubeWrapper = document.createElement('div');
  youtubeWrapper.classList.add('cmp-video__youtube-wrapper');
  youtubeWrapper.style.minHeight = '200px';

  const iframeWrapper = document.createElement('div');
  iframeWrapper.classList.add('cmp-video__iframe-wrapper');

  const youtubeUrl = youtubeEmbedUrlCell.textContent.trim();
  const videoIdMatch = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';

  if (videoId) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&showinfo=0&modestbranding=1&loop=1&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&rel=0&enablejsapi=1&origin=${window.location.origin}`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframeWrapper.append(iframe);
  } else {
    // Fallback if no valid YouTube URL is provided
    const placeholderDiv = document.createElement('div');
    placeholderDiv.setAttribute('data-embed-kind', 'youtube');
    placeholderDiv.setAttribute('data-embed-url', youtubeUrl);
    placeholderDiv.setAttribute('data-embed-config', JSON.stringify({ videoId: videoId }));
    placeholderDiv.style.cssText = 'border: 1px dashed rgb(204, 204, 204); padding: 20px; background-color: rgb(245, 245, 245); border-radius: 4px;';
    placeholderDiv.textContent = '[youtube] No valid YouTube URL provided';
    iframeWrapper.append(placeholderDiv);
  }

  moveInstrumentation(youtubeEmbedUrlCell, iframeWrapper);
  youtubeWrapper.append(iframeWrapper);
  cmpVideo.append(youtubeWrapper);

  block.append(cmpVideo);
}
