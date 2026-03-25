import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');

  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  const userAccountLinks = block.querySelectorAll('[data-aue-model="userAccountLink"]');
  userAccountLinks.forEach((linkNode) => {
    const link = document.createElement('a');
    link.classList.add('user__account--link');

    const linkHref = linkNode.querySelector('[data-aue-prop="link"]');
    if (linkHref) {
      link.href = linkHref.href;
      link.target = linkHref.target;
      moveInstrumentation(linkHref, link);
    }

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconImg = linkNode.querySelector('[data-aue-prop="icon"]');
    if (iconImg) {
      iconSpan.append(createOptimizedPicture(iconImg.src, iconImg.alt));
      moveInstrumentation(iconImg, iconSpan);
    }
    link.append(iconSpan);

    const label = linkNode.querySelector('[data-aue-prop="label"]');
    if (label) {
      link.append(label.textContent);
      moveInstrumentation(label, link);
    }

    userAccount.append(link);
    moveInstrumentation(linkNode, link);
  });

  const signInButtonNode = block.querySelector('[data-aue-model="signInButton"]');
  if (signInButtonNode) {
    const signInBtnDiv = document.createElement('div');
    signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconImg = signInButtonNode.querySelector('[data-aue-prop="icon"]');
    if (iconImg) {
      iconSpan.append(createOptimizedPicture(iconImg.src, iconImg.alt));
      moveInstrumentation(iconImg, iconSpan);
    }
    signInBtnDiv.append(iconSpan);

    const button = document.createElement('button');
    button.type = 'button';

    const signOutText = signInButtonNode.querySelector('[data-aue-prop="signOutText"]');
    if (signOutText) {
      button.dataset.signOutText = signOutText.textContent;
      moveInstrumentation(signOutText, button);
    }

    const buttonText = signInButtonNode.querySelector('[data-aue-prop="buttonText"]');
    if (buttonText) {
      button.textContent = buttonText.textContent;
      moveInstrumentation(buttonText, button);
    }

    signInBtnDiv.append(button);
    userAccount.append(signInBtnDiv);
    moveInstrumentation(signInButtonNode, signInBtnDiv);
  }

  userDropdown.append(userAccount);

  block.textContent = '';
  block.append(userDropdown);
  block.classList.add('sign-in', 'block');
  block.dataset.blockStatus = 'loaded';
}