import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    nameCell,
    logoCell,
    urlCell,
    streetAddressCell,
    addressLocalityCell,
    addressRegionCell,
    postalCodeCell,
    addressCountryCell,
    areaServedCell,
    ...sameAsLinkRows
  ] = [...block.children];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  };

  if (nameCell) {
    schema.name = nameCell.textContent.trim();
  }

  if (logoCell) {
    const img = logoCell.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      schema.logo = optimizedPic.querySelector('img').src;
    }
  }

  if (urlCell) {
    const urlLink = urlCell.querySelector('a');
    if (urlLink) {
      schema.url = urlLink.href;
    }
  }

  const address = {};
  if (streetAddressCell) address.streetAddress = streetAddressCell.textContent.trim();
  if (addressLocalityCell) address.addressLocality = addressLocalityCell.textContent.trim();
  if (addressRegionCell) address.addressRegion = addressRegionCell.textContent.trim();
  if (postalCodeCell) address.postalCode = postalCodeCell.textContent.trim();
  if (addressCountryCell) address.addressCountry = addressCountryCell.textContent.trim();

  if (Object.keys(address).length > 0) {
    schema.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  if (areaServedCell) {
    const areaServed = areaServedCell.textContent.trim();
    if (areaServed) {
      schema.contactPoint = {
        '@type': 'ContactPoint',
        areaServed,
      };
    }
  }

  const sameAsLinks = sameAsLinkRows.map((row) => {
    const link = row.querySelector('a');
    return link ? link.href : null;
  }).filter(Boolean);

  if (sameAsLinks.length > 0) {
    schema.sameAs = sameAsLinks;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);

  block.innerHTML = ''; // Clear the block content
  block.append(script);
  block.classList.add('organization-schema'); // Apply the class from original HTML
}
