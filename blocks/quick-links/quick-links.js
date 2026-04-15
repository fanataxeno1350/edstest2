import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const labelCell = [...row.children].find((cell) => !cell.querySelector('a'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));

    if (labelCell && linkCell) {
      const originalLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      a.classList.add('with-full-underline');
      a.href = originalLink?.href || '#';
      if (originalLink?.target) {
        a.target = originalLink.target;
      }
      a.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, a);
      moveInstrumentation(linkCell, a);
      li.append(a);
    }
    ul.append(li);
  });

  container.append(ul);
  wrapper.append(container);
  block.textContent = '';
  block.append(wrapper);
}
