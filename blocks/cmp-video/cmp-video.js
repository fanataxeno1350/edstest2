import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoTitleCell,
    videoProducerCell,
    videoLocationCell,
    dropdownTitleCell,
    dropdownOptionsCell,
    youtubeVideoUrlCell,
  ] = [...block.children];

  // Video Content Wrapper
  const videoContent = document.createElement('div');
  videoContent.classList.add('video-content');

  // Video Details
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

  // Dropdown
  const cmpDropdown = document.createElement('div');
  cmpDropdown.classList.add('cmp-dropdown');
  cmpDropdown.setAttribute('data-component', 'dropdown');
  cmpDropdown.setAttribute('data-initialized', 'true');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'above-dropdown-title-aligned');

  const dropdownTitleDiv = document.createElement('div');
  dropdownTitleDiv.classList.add('cmp-dropdown__title');
  const dropdownTitleH4 = document.createElement('h4');
  moveInstrumentation(dropdownTitleCell, dropdownTitleH4);
  dropdownTitleH4.textContent = dropdownTitleCell.textContent.trim();
  dropdownTitleDiv.append(dropdownTitleH4);
  contentDiv.append(dropdownTitleDiv);

  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');

  const selectElement = document.createElement('select');
  selectElement.classList.add('selectele');
  moveInstrumentation(dropdownOptionsCell, selectElement);

  const optionsText = dropdownOptionsCell.textContent.trim();
  const optionsArray = optionsText.split(',').map((option) => option.trim());

  const selectSelectedDiv = document.createElement('div');
  selectSelectedDiv.classList.add('cmp-dropdown__select-selected');
  selectSelectedDiv.setAttribute('data-selected', optionsArray[0] || '');
  selectSelectedDiv.textContent = optionsArray[0] || '';

  const selectItemsDiv = document.createElement('div');
  selectItemsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');

  optionsArray.forEach((optionText) => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    selectElement.append(option);

    const itemDiv = document.createElement('div');
    itemDiv.textContent = optionText;
    selectItemsDiv.append(itemDiv);
  });

  customSelectDiv.append(selectElement, selectSelectedDiv, selectItemsDiv);
  contentDiv.append(customSelectDiv);
  cmpDropdown.append(contentDiv);
  videoContent.append(cmpDropdown);

  // YouTube Video Wrapper
  const youtubeWrapper = document.createElement('div');
  youtubeWrapper.classList.add('cmp-video__youtube-wrapper');
  youtubeWrapper.style.minHeight = '200px'; // As per original HTML

  const iframeWrapper = document.createElement('div');
  iframeWrapper.classList.add('cmp-video__iframe-wrapper');

  const youtubePlaceholder = document.createElement('div');
  youtubePlaceholder.setAttribute('data-embed-kind', 'youtube');
  youtubePlaceholder.style.border = '1px dashed rgb(204, 204, 204)';
  youtubePlaceholder.style.padding = '20px';
  youtubePlaceholder.style.backgroundColor = 'rgb(245, 245, 245)';
  youtubePlaceholder.style.borderRadius = '4px';
  youtubePlaceholder.textContent = '[youtube]';

  // Extract YouTube URL from the alt text of the image within the picture element
  const picture = youtubeVideoUrlCell.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;
  let youtubeUrl = '';
  if (img && img.alt) {
    const match = img.alt.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) {
      youtubeUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=0&controls=0&showinfo=0&modestbranding=1&loop=1&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&rel=0&enablejsapi=1&origin=${window.location.origin}&widgetid=1&forigin=${window.location.origin}&aoriginsup=1&vf=6`;
      youtubePlaceholder.setAttribute('data-embed-url', youtubeUrl);
      youtubePlaceholder.setAttribute('data-embed-config', JSON.stringify({ videoId: match[1] }));
    }
  }
  moveInstrumentation(youtubeVideoUrlCell, youtubePlaceholder);
  iframeWrapper.append(youtubePlaceholder);
  youtubeWrapper.append(iframeWrapper);

  // Replace block content
  block.innerHTML = '';
  block.append(videoContent, youtubeWrapper);

  // Dropdown interaction logic
  selectSelectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItemsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.toggle('select-arrow-active');
  });

  selectItemsDiv.querySelectorAll('div').forEach((item) => {
    item.addEventListener('click', () => {
      selectSelectedDiv.textContent = item.textContent;
      selectSelectedDiv.setAttribute('data-selected', item.textContent);
      selectElement.value = item.textContent; // Update the hidden select element
      selectItemsDiv.classList.add('cmp-dropdown__select-hide');
      selectSelectedDiv.classList.remove('select-arrow-active');
    });
  });

  document.addEventListener('click', () => {
    selectItemsDiv.classList.add('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.remove('select-arrow-active');
  });
}
