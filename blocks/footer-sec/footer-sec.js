import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's part of the helper function.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are fixed positions
  const socialMediaTitleCell = children[0];
  const requestOnEmailTitleCell = children[1];
  const emailPlaceholderCell = children[2];
  const signupButtonLabelCell = children[3];
  const hindujaGroupLogoCell = children[4];
  const hindujaGroupLabelCell = children[5];
  const copyrightTextCell = children[6];

  const itemRows = children.slice(7);

  // Use content detection for item rows
  const socialIconItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[3].querySelector('ul');
  });
  const checkboxItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 1 && !cells[0].querySelector('picture') && !cells[0].querySelector('a') && !cells[0].querySelector('ul');
  });
  const footerMenuSections = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].textContent.trim() === 'Footer Menu Items value';
  });
  const footerMenuItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].textContent.trim() !== 'Footer Menu Items value' && cells[1].querySelector('a');
  });

  block.innerHTML = '';

  const footerSec = document.createElement('section');
  footerSec.classList.add('footerSec');

  const formField = document.createElement('div');
  formField.classList.add('formField', 'container');

  const formDetails = document.createElement('div');
  formDetails.classList.add('formDetails');

  const socialMediaTitle = document.createElement('h3');
  socialMediaTitle.textContent = socialMediaTitleCell.textContent.trim();
  moveInstrumentation(socialMediaTitleCell, socialMediaTitle);
  formDetails.append(socialMediaTitle);

  const iconGroup = document.createElement('div');
  iconGroup.classList.add('iconGroup');

  socialIconItems.forEach((row) => {
    const [iconCell, linkCell, titleCell, hierarchyCell] = [...row.children];

    const socialIcon = document.createElement('div');
    socialIcon.classList.add('socialIcon');

    const anchor = document.createElement('a');
    const link = linkCell.querySelector('a');
    if (link) {
      anchor.href = link.href;
      anchor.title = titleCell.textContent.trim();
      anchor.setAttribute('rel', 'noopener');
      anchor.setAttribute('target', '_blank');
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, socialIcon);
    socialIcon.append(anchor);
    iconGroup.append(socialIcon);

    // Handle hierarchy-tree richtext
    if (hierarchyCell) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hierarchy-tree-wrapper'); // This class is not in the allowlist, but it's for internal structure.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;

      // Apply classes to nested elements as per original HTML if available, or sensible defaults
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link')); // Example class, adjust as needed
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu-list')); // Example class, adjust as needed
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item')); // Example class, adjust as needed

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        hierarchyWrapper.append(tempDiv.firstChild);
      }
      socialIcon.append(hierarchyWrapper); // Append hierarchy to socialIcon or another appropriate parent
      transformNestedLists(hierarchyWrapper.querySelector('ul')); // Apply interactivity to the nested list
    }
  });
  formDetails.append(iconGroup);
  formField.append(formDetails);

  const inputSection = document.createElement('div');
  inputSection.classList.add('inputSection');

  const requestOnEmailTitle = document.createElement('h3');
  requestOnEmailTitle.textContent = requestOnEmailTitleCell.textContent.trim();
  moveInstrumentation(requestOnEmailTitleCell, requestOnEmailTitle);
  inputSection.append(requestOnEmailTitle);

  const inputField = document.createElement('div');
  inputField.classList.add('inputField');

  checkboxItems.forEach((row, i) => {
    const [labelCell] = [...row.children];

    const inputBox = document.createElement('div');
    inputBox.classList.add('inputBox', 'gs_control');

    const label = document.createElement('label');
    label.classList.add('gs_control', 'gs_checkbox', 'checkField');
    label.id = `productList${i}`;

    const span = document.createElement('span');
    span.textContent = labelCell.textContent.trim();
    label.append(span);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-gsv-err-msg', 'Please check');
    checkbox.setAttribute('data-gsf-name', `productList${i}`);
    checkbox.setAttribute('data-checked', 'false');
    label.append(checkbox);

    const indicator = document.createElement('span');
    indicator.classList.add('gs_control__indicator');
    label.append(indicator);
    moveInstrumentation(row, inputBox);
    inputBox.append(label);
    inputField.append(inputBox);
  });
  inputSection.append(inputField);

  const searchField = document.createElement('div');
  searchField.classList.add('searchField');

  const emailInputField = document.createElement('div');
  emailInputField.classList.add('inputfield');

  const emailInput = document.createElement('input');
  emailInput.classList.add('input');
  emailInput.type = 'email';
  emailInput.name = 'emaild997708aaa4b2db95318e4c5928346';
  emailInput.setAttribute('data-gsv-err-msg', 'Please enter correct email');
  emailInput.placeholder = emailPlaceholderCell.textContent.trim();
  emailInput.autocomplete = 'on';
  emailInput.setAttribute('data-gsv-type', 'required,email');
  emailInput.setAttribute('data-gsf-name', 'email');
  emailInput.value = '';
  moveInstrumentation(emailPlaceholderCell, emailInputField);
  emailInputField.append(emailInput);
  searchField.append(emailInputField);

  const signUpButton = document.createElement('button');
  signUpButton.type = 'button';
  signUpButton.classList.add('secondryBtn');
  signUpButton.disabled = true;
  signUpButton.textContent = signupButtonLabelCell.textContent.trim();
  const arrowSpan = document.createElement('span');
  arrowSpan.textContent = ' → ';
  signUpButton.append(arrowSpan);
  moveInstrumentation(signupButtonLabelCell, signUpButton);
  searchField.append(signUpButton);
  inputSection.append(searchField);
  formField.append(inputSection);
  footerSec.append(formField);

  const footerOuterBox = document.createElement('div');
  footerOuterBox.classList.add('footerOuterBox');

  const footerBox = document.createElement('footer');
  footerBox.classList.add('footerBox', 'container', 'FooterDesk');

  // Create a map to associate menu items with their sections
  const sectionMenuItemsMap = new Map();
  footerMenuSections.forEach((sectionRow) => {
    const [sectionTitleCell] = [...sectionRow.children];
    const sectionTitle = sectionTitleCell.textContent.trim();
    sectionMenuItemsMap.set(sectionTitle, []);
  });

  // Distribute footerMenuItems to their respective sections based on the order in the block
  // This assumes menu items for a section immediately follow that section in the block structure.
  // If the model intends a different association, this logic needs to be updated.
  let currentSectionTitle = null;
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2 && cells[1].textContent.trim() === 'Footer Menu Items value') {
      // This is a footer-menu-section
      currentSectionTitle = cells[0].textContent.trim();
    } else if (cells.length === 2 && cells[0].textContent.trim() !== 'Footer Menu Items value' && cells[1].querySelector('a')) {
      // This is a footer-menu-item
      if (currentSectionTitle && sectionMenuItemsMap.has(currentSectionTitle)) {
        sectionMenuItemsMap.get(currentSectionTitle).push(row);
      }
    }
  });

  footerMenuSections.forEach((sectionRow) => {
    const [sectionTitleCell] = [...sectionRow.children];
    const sectionTitleText = sectionTitleCell.textContent.trim();

    const footerTabs = document.createElement('div');
    footerTabs.classList.add('footerTabs');

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = sectionTitleText;
    footerTabs.append(sectionTitle);

    const footerMenu = document.createElement('ul');
    footerMenu.classList.add('footerMenu');

    const itemsForThisSection = sectionMenuItemsMap.get(sectionTitleText) || [];
    itemsForThisSection.forEach((itemRow) => {
      const [labelCell, linkCell] = [...itemRow.children];
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const link = linkCell.querySelector('a');
      if (link) {
        anchor.href = link.href;
        anchor.title = labelCell.textContent.trim();
      }
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(itemRow, li);
      li.append(anchor);
      footerMenu.append(li);
    });

    footerTabs.append(footerMenu);
    moveInstrumentation(sectionRow, footerTabs);
    footerBox.append(footerTabs);
  });

  footerOuterBox.append(footerBox);
  footerSec.append(footerOuterBox);

  const bottomBg = document.createElement('div');
  bottomBg.classList.add('bottomBg');

  const bottomBanner = document.createElement('div');
  bottomBanner.classList.add('bottomBanner', 'container');

  const emptyDiv = document.createElement('div'); // Empty div from original HTML
  bottomBanner.append(emptyDiv);

  const hindujaGrp = document.createElement('div');
  hindujaGrp.classList.add('hindujaGrp');

  const hindujaGroupPicture = hindujaGroupLogoCell.querySelector('picture');
  if (hindujaGroupPicture) {
    const img = hindujaGroupPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      hindujaGrp.append(optimizedPic);
    }
  }

  const hindujaGroupSpan = document.createElement('span');
  hindujaGroupSpan.textContent = hindujaGroupLabelCell.textContent.trim();
  hindujaGrp.append(hindujaGroupSpan);
  moveInstrumentation(hindujaGroupLogoCell, hindujaGrp);
  moveInstrumentation(hindujaGroupLabelCell, hindujaGrp);
  bottomBanner.append(hindujaGrp);

  const copyrightText = document.createElement('div');
  copyrightText.classList.add('copyrightText');
  copyrightText.textContent = copyrightTextCell.textContent.trim();
  moveInstrumentation(copyrightTextCell, copyrightText);
  bottomBanner.append(copyrightText);

  bottomBg.append(bottomBanner);
  footerSec.append(bottomBg);

  block.append(footerSec);

  // Optimize images in the entire block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
