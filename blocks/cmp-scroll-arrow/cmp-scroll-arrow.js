import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.innerHTML = ''; // Clear existing content

  const indicatorUp = document.createElement('div');
  indicatorUp.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-up');
  indicatorUp.style.display = 'none';
  indicatorUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
        <defs>
            <filter id="a" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse">
                <feOffset dy="4" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="5" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.161"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
            </filter>
            <clipPath id="c">
                <rect width="24" height="24" fill="none"></rect>
            </clipPath>
        </defs>
        <g transform="translate(15 11)">
            <g transform="matrix(1, 0, 0, 1, -15, -11)" filter="url(#a)">
                <circle cx="20" cy="20" r="20" transform="translate(15 11)" fill="#fff"></circle>
            </g>
            <g transform="translate(8 8)">
                <g clip-path="url(#c)">
                    <path d="M10.586,21.415l-8.293-8.3A1,1,0,0,1,3.707,11.7L11,19V3a1,1,0,1,1,2,0V19l7.293-7.3a1,1,0,0,1,1.414,1.415l-8.293,8.3a2,2,0,0,1-2.828,0" fill="#146614"></path>
                </g>
            </g>
        </g>
    </svg>`;
  moveInstrumentation(block, indicatorUp); // Assuming block is the original row/cell for instrumentation
  block.append(indicatorUp);

  const indicatorDown = document.createElement('div');
  indicatorDown.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-down');
  indicatorDown.style.display = 'block';
  indicatorDown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
        <defs>
            <filter id="a" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse">
                <feOffset dy="4" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="5" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.161"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
            </filter>
            <clipPath id="c">
                <rect width="24" height="24" fill="none"></rect>
            </clipPath>
        </defs>
        <g transform="translate(15 11)">
            <g transform="matrix(1, 0, 0, 1, -15, -11)" filter="url(#a)">
                <circle cx="20" cy="20" r="20" transform="translate(15 11)" fill="#fff"></circle>
            </g>
            <g transform="translate(8 8)">
                <g clip-path="url(#c)">
                    <path d="M10.586,21.415l-8.293-8.3A1,1,0,0,1,3.707,11.7L11,19V3a1,1,0,1,1,2,0V19l7.293-7.3a1,1,0,0,1,1.414,1.415l-8.293,8.3a2,2,0,0,1-2.828,0" fill="#146614"></path>
                </g>
            </g>
        </g>
    </svg>`;
  moveInstrumentation(block, indicatorDown); // Assuming block is the original row/cell for instrumentation
  block.append(indicatorDown);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (scrollTop > 0) {
      indicatorUp.style.display = 'block';
    } else {
      indicatorUp.style.display = 'none';
    }

    if (scrollTop + clientHeight >= scrollHeight) {
      indicatorDown.style.display = 'none';
    } else {
      indicatorDown.style.display = 'block';
    }
  };

  indicatorUp.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  indicatorDown.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load
}
