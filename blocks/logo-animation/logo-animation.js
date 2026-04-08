import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    glowImageRow,
    logoImageRow,
    backTextRow,
    potatoImageRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('LogoAnimation-module-scss-module__40ZIiG__section');

  const container = document.createElement('div');
  container.classList.add('Container-module-scss-module__KjkAOW__container');
  section.append(container);

  const logoBannerWrapper = document.createElement('div');
  logoBannerWrapper.classList.add('LogoAnimation-module-scss-module__40ZIiG__logoBannerWrapper');
  container.append(logoBannerWrapper);

  const logoBanner = document.createElement('div');
  logoBanner.classList.add('LogoAnimation-module-scss-module__40ZIiG__logoBanner');
  logoBannerWrapper.append(logoBanner);

  // Glow Image
  const glowContainer = document.createElement('div');
  glowContainer.classList.add('LogoAnimation-module-scss-module__40ZIiG__glowContainer');
  const glowPicture = glowImageRow.querySelector('picture');
  if (glowPicture) {
    const glowImg = glowPicture.querySelector('img');
    const optimizedGlowPic = createOptimizedPicture(glowImg.src, glowImg.alt, false, [{ width: '1757' }]);
    moveInstrumentation(glowImg, optimizedGlowPic.querySelector('img'));
    optimizedGlowPic.querySelector('img').classList.add('LogoAnimation-module-scss-module__40ZIiG__glowImage');
    glowContainer.append(optimizedGlowPic);
  }
  moveInstrumentation(glowImageRow, glowContainer);
  logoBanner.append(glowContainer);

  // Flip Container (Logo Image and Back Text)
  const flipContainer = document.createElement('div');
  flipContainer.classList.add('LogoAnimation-module-scss-module__40ZIiG__flipContainer', 'LogoAnimation-module-scss-module__40ZIiG__flipped');
  logoBanner.append(flipContainer);

  const flipper = document.createElement('div');
  flipper.classList.add('LogoAnimation-module-scss-module__40ZIiG__flipper');
  flipContainer.append(flipper);

  // Front (Logo Image)
  const front = document.createElement('div');
  front.classList.add('LogoAnimation-module-scss-module__40ZIiG__front');
  const logoPicture = logoImageRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '351' }]);
    moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
    optimizedLogoPic.querySelector('img').style.color = 'transparent'; // Apply inline style from original
    front.append(optimizedLogoPic);
  }
  moveInstrumentation(logoImageRow, front);
  flipper.append(front);

  // Back (Back Text)
  const back = document.createElement('div');
  back.classList.add('LogoAnimation-module-scss-module__40ZIiG__back');
  const backTextContent = backTextRow.querySelector('div');
  if (backTextContent) {
    moveInstrumentation(backTextRow, back);
    while (backTextContent.firstChild) {
      const span = document.createElement('span');
      moveInstrumentation(backTextContent.firstChild, span);
      span.append(backTextContent.firstChild);
      back.append(span);
    }
  }
  flipper.append(back);

  // Background Image (empty div for styling)
  const backgroundImage = document.createElement('div');
  backgroundImage.classList.add('LogoAnimation-module-scss-module__40ZIiG__backgroundImage');
  logoBannerWrapper.append(backgroundImage);

  // Potato Image
  const potatoImageDiv = document.createElement('div');
  potatoImageDiv.classList.add('LogoAnimation-module-scss-module__40ZIiG__potatoImage');
  const potatoPicture = potatoImageRow.querySelector('picture');
  if (potatoPicture) {
    const potatoImg = potatoPicture.querySelector('img');
    const optimizedPotatoPic = createOptimizedPicture(potatoImg.src, potatoImg.alt, false, [{ width: '346' }]);
    moveInstrumentation(potatoImg, optimizedPotatoPic.querySelector('img'));
    optimizedPotatoPic.querySelector('img').style.color = 'transparent'; // Apply inline style from original
    potatoImageDiv.append(optimizedPotatoPic);
  }
  moveInstrumentation(potatoImageRow, potatoImageDiv);
  logoBannerWrapper.append(potatoImageDiv);

  block.textContent = '';
  block.append(section);
}
