import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('has-sub-child');
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
  const header = document.createElement('header');
  header.classList.add('main-header', 'solid');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  // Find logo and logoLink rows based on their content as per EDS Block Structure
  const logoRow = children.find((row) => row.children[0]?.querySelector('picture') && !row.children[0]?.querySelector('img')?.alt.includes('80th Year Logo'));
  const logoLinkRow = children.find((row) => row.children[0]?.querySelector('a')?.href.includes('logoLink'));

  if (logoRow && logoLinkRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLinkRow.children[0]?.querySelector('a')?.href || '#';
    const logoPicture = logoRow.children[0]?.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
      logoAnchor.querySelector('img').classList.add('hiddenlogo1');
      logoAnchor.querySelector('img').width = 200;
      logoAnchor.querySelector('img').height = 30;
      logoAnchor.querySelector('img').style.width = 'auto';
    }
    moveInstrumentation(logoLinkRow, logoAnchor);
    logoDiv.append(logoAnchor);
    wrap.append(logoDiv);
  }

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  // Filter item rows based on cell count and content as per BlockJson model
  const navigationItemRows = children.filter((row) => row.children.length === 3 && row.children[1]?.querySelector('a'));
  const iconNavItemRows = children.filter((row) => row.children.length === 2 && row.children[1]?.querySelector('a'));
  const megaMenuAboutItemRows = children.filter((row) => row.children.length === 4 && row.children[0]?.querySelector('p') === null); // Check for no <p> in first cell
  const megaMenuWhatWeDoItemRows = children.filter((row) => row.children.length === 6 && row.children[0]?.querySelector('p') === null);
  const megaMenuInvestorRelationsItemRows = children.filter((row) => row.children.length === 8 && row.children[0]?.querySelector('p') === null);
  const megaMenuNewsroomItemRows = children.filter((row) => row.children.length === 4 && row.children[0]?.querySelector('p') === null);
  const megaMenuCareersItemRows = children.filter((row) => row.children.length === 4 && row.children[0]?.querySelector('p') === null);
  const pressReleaseItemRows = children.filter((row) => row.children.length === 4 && row.children[1]?.querySelector('a'));

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.setAttribute('itemprop', 'url');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    rootEl.setAttribute('itemprop', 'name');
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.appendChild(arrowSpan);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');

      // Determine mega menu type based on the label
      const menuLabel = labelCell.textContent.trim().toLowerCase();
      if (menuLabel.includes('who we are')) {
        leftDiv.classList.add('about-us-left-div');
        subNavWrap.classList.add('about-us-sub-nav');
        megaMenuAboutItemRows.forEach((megaRow) => {
          const [headingCell, descriptionCell, subDescriptionCell, aboutLinksCell] = [...megaRow.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = headingCell.textContent.trim();
          heading.append(headingLink);
          leftDiv.append(heading);

          const description = document.createElement('p');
          description.classList.add('left-div-desc');
          description.textContent = descriptionCell.textContent.trim();
          leftDiv.append(description);

          const subDescription = document.createElement('p');
          subDescription.classList.add('left-div-subdesc');
          subDescription.textContent = subDescriptionCell.textContent.trim();
          leftDiv.append(subDescription);

          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = aboutLinksCell?.innerHTML || '';
          const aboutLinksUl = tempDiv.querySelector('ul');
          if (aboutLinksUl) {
            moveInstrumentation(aboutLinksCell, aboutLinksUl);
            subNavWrap.append(aboutLinksUl);
          }
          moveInstrumentation(megaRow, leftDiv);
        });
      } else if (menuLabel.includes('what we do')) {
        leftDiv.classList.add('what-we-do-left-div');
        subNavWrap.classList.add('what-we-do');
        megaMenuWhatWeDoItemRows.forEach((megaRow) => {
          const [headingCell, factsListCell, industriesHierarchyCell, brandsLinksCell, globalPresenceLinksCell, culturalOutreachLinksCell] = [...megaRow.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = headingCell.textContent.trim();
          heading.append(headingLink);
          leftDiv.append(heading);

          const tempFactsDiv = document.createElement('div');
          tempFactsDiv.innerHTML = factsListCell?.innerHTML || '';
          const factsListUl = tempFactsDiv.querySelector('ul');
          if (factsListUl) {
            moveInstrumentation(factsListCell, factsListUl);
            leftDiv.append(factsListUl);
            factsListUl.querySelectorAll('li').forEach((factLi) => {
              factLi.classList.add('list-text-red');
            });
          }

          const tempIndustriesDiv = document.createElement('div');
          tempIndustriesDiv.innerHTML = industriesHierarchyCell?.innerHTML || '';
          const industriesHierarchyUl = tempIndustriesDiv.querySelector('ul');
          if (industriesHierarchyUl) {
            const industriesLi = document.createElement('li');
            industriesLi.classList.add('top-level-li');
            const industriesLink = document.createElement('a');
            industriesLink.href = '#'; // Placeholder, actual link from model if available
            industriesLink.textContent = 'Industries';
            industriesLi.append(industriesLink);
            const industriesArrowSpan = document.createElement('span');
            industriesArrowSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
            industriesLi.append(industriesArrowSpan);

            const industriesSubWrap = document.createElement('div');
            industriesSubWrap.classList.add('has-sub-child');
            industriesSubWrap.append(industriesHierarchyUl);
            industriesLi.append(industriesSubWrap);
            subNavWrap.append(industriesLi);
            transformNestedLists(industriesHierarchyUl);
            moveInstrumentation(industriesHierarchyCell, industriesHierarchyUl);
          }

          const tempBrandsDiv = document.createElement('div');
          tempBrandsDiv.innerHTML = brandsLinksCell?.innerHTML || '';
          const brandsLinksUl = tempBrandsDiv.querySelector('ul');
          if (brandsLinksUl) {
            const brandsLi = document.createElement('li');
            brandsLi.classList.add('top-level-li');
            const brandsLink = document.createElement('a');
            brandsLink.href = '#';
            brandsLink.textContent = 'Our Brands';
            brandsLi.append(brandsLink);
            brandsLi.append(brandsLinksUl); // Append the actual UL content
            subNavWrap.append(brandsLi);
            moveInstrumentation(brandsLinksCell, brandsLinksUl);
          }

          const tempGlobalDiv = document.createElement('div');
          tempGlobalDiv.innerHTML = globalPresenceLinksCell?.innerHTML || '';
          const globalPresenceLinksUl = tempGlobalDiv.querySelector('ul');
          if (globalPresenceLinksUl) {
            const globalPresenceLi = document.createElement('li');
            globalPresenceLi.classList.add('top-level-li');
            const globalPresenceLink = document.createElement('a');
            globalPresenceLink.href = '#';
            globalPresenceLink.textContent = 'Global Presence';
            globalPresenceLi.append(globalPresenceLink);
            globalPresenceLi.append(globalPresenceLinksUl); // Append the actual UL content
            subNavWrap.append(globalPresenceLi);
            moveInstrumentation(globalPresenceLinksCell, globalPresenceLinksUl);
          }

          const tempCulturalDiv = document.createElement('div');
          tempCulturalDiv.innerHTML = culturalOutreachLinksCell?.innerHTML || '';
          const culturalOutreachLinksUl = tempCulturalDiv.querySelector('ul');
          if (culturalOutreachLinksUl) {
            const culturalOutreachLi = document.createElement('li');
            culturalOutreachLi.classList.add('top-level-li');
            const culturalOutreachLink = document.createElement('a');
            culturalOutreachLink.href = '#';
            culturalOutreachLink.textContent = 'Cultural Outreach';
            culturalOutreachLi.append(culturalOutreachLink);
            culturalOutreachLi.append(culturalOutreachLinksUl); // Append the actual UL content
            subNavWrap.append(culturalOutreachLi);
            moveInstrumentation(culturalOutreachLinksCell, culturalOutreachLinksUl);
          }
          moveInstrumentation(megaRow, leftDiv);
        });
      } else if (menuLabel.includes('investor relations')) {
        leftDiv.classList.add('ir-left-div');
        subNavWrap.classList.add('element-block');
        megaMenuInvestorRelationsItemRows.forEach((megaRow) => {
          const [headingCell, descriptionCell, highlightsListCell, disclosuresLinksCell, reportsLinksCell, policiesLinksCell, regulatoryFilingsLinksCell, sustainabilityLinksCell] = [...megaRow.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = headingCell.textContent.trim();
          heading.append(headingLink);
          leftDiv.append(heading);

          const description = document.createElement('p');
          description.textContent = descriptionCell.textContent.trim();
          leftDiv.append(description);

          const tempHighlightsDiv = document.createElement('div');
          tempHighlightsDiv.innerHTML = highlightsListCell?.innerHTML || '';
          const highlightsListUl = tempHighlightsDiv.querySelector('ul');
          if (highlightsListUl) {
            moveInstrumentation(highlightsListCell, highlightsListUl);
            leftDiv.append(highlightsListUl);
            highlightsListUl.querySelectorAll('li').forEach((highlightLi) => {
              highlightLi.classList.add('list-text-red');
            });
          }

          const subNavWrapOneLink = document.createElement('ul');
          subNavWrapOneLink.classList.add('sub-nav-wrap-one-link');
          const tempDisclosuresDiv = document.createElement('div');
          tempDisclosuresDiv.innerHTML = disclosuresLinksCell?.innerHTML || '';
          const disclosuresLinksUl = tempDisclosuresDiv.querySelector('ul');
          if (disclosuresLinksUl) {
            moveInstrumentation(disclosuresLinksCell, disclosuresLinksUl);
            subNavWrapOneLink.append(disclosuresLinksUl);
          }
          subNavWrap.append(subNavWrapOneLink);

          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

          const tempReportsDiv = document.createElement('div');
          tempReportsDiv.innerHTML = reportsLinksCell?.innerHTML || '';
          const reportsUl = tempReportsDiv.querySelector('ul');
          if (reportsUl) {
            moveInstrumentation(reportsLinksCell, reportsUl);
            innerSubNavWrapList.append(reportsUl);
          }
          const tempPoliciesDiv = document.createElement('div');
          tempPoliciesDiv.innerHTML = policiesLinksCell?.innerHTML || '';
          const policiesUl = tempPoliciesDiv.querySelector('ul');
          if (policiesUl) {
            moveInstrumentation(policiesLinksCell, policiesUl);
            innerSubNavWrapList.append(policiesUl);
          }
          const tempRegulatoryDiv = document.createElement('div');
          tempRegulatoryDiv.innerHTML = regulatoryFilingsLinksCell?.innerHTML || '';
          const regulatoryFilingsUl = tempRegulatoryDiv.querySelector('ul');
          if (regulatoryFilingsUl) {
            moveInstrumentation(regulatoryFilingsLinksCell, regulatoryFilingsUl);
            innerSubNavWrapList.append(regulatoryFilingsUl);
          }
          const tempSustainabilityDiv = document.createElement('div');
          tempSustainabilityDiv.innerHTML = sustainabilityLinksCell?.innerHTML || '';
          const sustainabilityUl = tempSustainabilityDiv.querySelector('ul');
          if (sustainabilityUl) {
            moveInstrumentation(sustainabilityLinksCell, sustainabilityUl);
            innerSubNavWrapList.append(sustainabilityUl);
          }
          subNavWrap.append(innerSubNavWrapList);
          moveInstrumentation(megaRow, leftDiv);
        });
      } else if (menuLabel.includes('newsroom')) {
        leftDiv.classList.add('newsroom-left-div');
        megaMenuNewsroomItemRows.forEach((megaRow) => {
          const [headingCell, pressReleasesLinksCell, mediaResourcesLinksCell, inTheNewsLinksCell] = [...megaRow.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = headingCell.textContent.trim();
          heading.append(headingLink);
          leftDiv.append(heading);

          const latestPressReleaseDiv = document.createElement('div');
          latestPressReleaseDiv.classList.add('latest-two-press-release');
          pressReleaseItemRows.forEach((prRow) => {
            const [titleCell, prLinkCell, dateCell, categoryCell] = [...prRow.children];
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slides');
            const slideWrap = document.createElement('div');
            slideWrap.classList.add('wrap');
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content');
            const descDiv = document.createElement('div');
            descDiv.classList.add('desc');
            const p = document.createElement('p');
            const prLink = document.createElement('a');
            prLink.href = prLinkCell.querySelector('a')?.href || '#';
            prLink.textContent = titleCell.textContent.trim();
            p.append(prLink);
            descDiv.append(p);

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date');
            const emDate = document.createElement('em');
            emDate.textContent = dateCell.textContent.trim();
            const emCategory = document.createElement('em');
            emCategory.textContent = categoryCell.textContent.trim();
            dateDiv.append(emDate, emCategory);
            descDiv.append(dateDiv);
            contentDiv.append(descDiv);
            slideWrap.append(contentDiv);
            slideDiv.append(slideWrap);
            latestPressReleaseDiv.append(slideDiv);
            moveInstrumentation(prRow, slideDiv);
          });
          leftDiv.append(latestPressReleaseDiv);

          const tempPressLinksDiv = document.createElement('div');
          tempPressLinksDiv.innerHTML = pressReleasesLinksCell?.innerHTML || '';
          const pressReleasesUl = tempPressLinksDiv.querySelector('ul');
          if (pressReleasesUl) {
            moveInstrumentation(pressReleasesLinksCell, pressReleasesUl);
            subNavWrap.append(pressReleasesUl);
          }
          const tempMediaLinksDiv = document.createElement('div');
          tempMediaLinksDiv.innerHTML = mediaResourcesLinksCell?.innerHTML || '';
          const mediaResourcesUl = tempMediaLinksDiv.querySelector('ul');
          if (mediaResourcesUl) {
            moveInstrumentation(mediaResourcesLinksCell, mediaResourcesUl);
            subNavWrap.append(mediaResourcesUl);
          }
          const tempInTheNewsDiv = document.createElement('div');
          tempInTheNewsDiv.innerHTML = inTheNewsLinksCell?.innerHTML || '';
          const inTheNewsUl = tempInTheNewsDiv.querySelector('ul');
          if (inTheNewsUl) {
            moveInstrumentation(inTheNewsLinksCell, inTheNewsUl);
            subNavWrap.append(inTheNewsUl);
          }
          moveInstrumentation(megaRow, leftDiv);
        });
      } else if (menuLabel.includes('careers')) {
        leftDiv.classList.add('career-left-div');
        subNavWrap.classList.add('careers-div');
        megaMenuCareersItemRows.forEach((megaRow) => {
          const [headingCell, descriptionCell, subDescriptionCell, careersLinksCell] = [...megaRow.children];
          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = headingCell.textContent.trim();
          heading.append(headingLink);
          leftDiv.append(heading);

          const description = document.createElement('p');
          description.classList.add('left-div-desc');
          description.textContent = descriptionCell.textContent.trim();
          leftDiv.append(description);

          const subDescription = document.createElement('p');
          subDescription.classList.add('left-div-subdesc');
          subDescription.textContent = subDescriptionCell.textContent.trim();
          leftDiv.append(subDescription);

          const tempCareersDiv = document.createElement('div');
          tempCareersDiv.innerHTML = careersLinksCell?.innerHTML || '';
          const careersLinksUl = tempCareersDiv.querySelector('ul');
          if (careersLinksUl) {
            moveInstrumentation(careersLinksCell, careersLinksUl);
            subNavWrap.append(careersLinksUl);
            transformNestedLists(careersLinksUl);
          }
          moveInstrumentation(megaRow, leftDiv);
        });
      }

      centerDiv.append(leftDiv, subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megaMenu.classList.toggle('active');
      });
    }
    navUl.append(li);
  });

  // Mobile Icon Nav
  const mobileIconNavDiv = document.createElement('div');
  mobileIconNavDiv.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNavDiv.append(mobileIconNavUl);
  navUl.append(mobileIconNavDiv);

  iconNavItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    mobileIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // Desktop Icon Nav
  const desktopIconNavDiv = document.createElement('div');
  desktopIconNavDiv.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNavDiv.append(desktopIconNavUl);
  navUl.append(desktopIconNavDiv);

  iconNavItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';

    // Add SVG for mail icon
    if (labelCell.textContent.trim().toLowerCase() === 'contact us') {
      anchor.innerHTML = `
        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                    C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                    L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
        </svg>
      `;
    } else if (labelCell.textContent.trim().toLowerCase() === 'search') {
      anchor.innerHTML = `
        <svg viewBox="0 0 21 21" fill="none" class="lens">
          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
        </svg>
        <svg viewBox="0 0 50 50" class="close">
          <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
        </svg>
      `;
    }
    li.append(anchor);
    desktopIconNavUl.append(li);
    moveInstrumentation(row, li);
  });

  // 80th Year Logo
  const yearLogoRow = children.find((row) => row.children[0]?.querySelector('picture') && row.children[0]?.querySelector('img')?.alt === '80th Year Logo');
  const yearLogoLinkRow = children.find((row) => row.children[0]?.querySelector('a')?.href.includes('yearLogoLink'));
  if (yearLogoRow && yearLogoLinkRow) {
    const yearLogoDiv = document.createElement('div');
    yearLogoDiv.classList.add('logo', 'year-80-logo');
    const yearLogoAnchor = document.createElement('a');
    yearLogoAnchor.href = yearLogoLinkRow.children[0]?.querySelector('a')?.href || '#';
    const yearLogoPicture = yearLogoRow.children[0]?.querySelector('picture');
    if (yearLogoPicture) {
      const img = yearLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(yearLogoRow, optimizedPic.querySelector('img'));
      yearLogoAnchor.append(optimizedPic);
      yearLogoAnchor.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      yearLogoAnchor.querySelector('img').width = 74;
      yearLogoAnchor.querySelector('img').height = 60;
    }
    moveInstrumentation(yearLogoLinkRow, yearLogoAnchor);
    yearLogoDiv.append(yearLogoAnchor);
    wrap.append(yearLogoDiv);
  }

  block.replaceChildren(header);

  // Add event listener for hamburger menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  });

  // Add event listener for search icon (desktop and mobile)
  const searchIcons = document.querySelectorAll('.icon-nav .search');
  searchIcons.forEach((searchIcon) => {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchIcon.classList.toggle('active');
      const searchScreenWrap = searchIcon.querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        searchScreenWrap.classList.toggle('active');
      }
      document.body.classList.toggle('overflow-hidden');
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    const activeSearch = document.querySelector('.icon-nav .search.active');
    if (activeSearch && !activeSearch.contains(e.target)) {
      activeSearch.classList.remove('active');
      activeSearch.querySelector('.search-screen-wrap')?.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  });

  // Prevent search form submission from closing search overlay
  const searchForms = document.querySelectorAll('.search-screen-wrap form');
  searchForms.forEach((form) => {
    form.addEventListener('click', (e) => e.stopPropagation());
  });
}
