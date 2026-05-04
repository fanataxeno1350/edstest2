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
    ...sameAsRows
  ] = [...block.children];

  const name = nameCell?.textContent.trim();
  const logoPicture = logoCell?.querySelector('picture');
  const logo = logoPicture ? logoPicture.querySelector('img') : null;
  const url = urlCell?.querySelector('a')?.href;
  const streetAddress = streetAddressCell?.textContent.trim();
  const addressLocality = addressLocalityCell?.textContent.trim();
  const addressRegion = addressRegionCell?.textContent.trim();
  const postalCode = postalCodeCell?.textContent.trim();
  const addressCountry = addressCountryCell?.textContent.trim();
  const areaServed = areaServedCell?.textContent.trim();

  // FIX: Replaced row.children[0] with content detection for sameAsRows
  const sameAs = sameAsRows.map((row) => {
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    return linkCell?.querySelector('a')?.href;
  }).filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  };

  if (name) jsonLd.name = name;
  if (logo) {
    const optimizedLogo = createOptimizedPicture(logo.src, logo.alt, false, [{ width: '250' }]);
    jsonLd.logo = optimizedLogo.querySelector('img').src;
  }
  if (url) jsonLd.url = url;

  const address = {};
  if (streetAddress) address.streetAddress = streetAddress;
  if (addressLocality) address.addressLocality = addressLocality;
  if (addressRegion) address.addressRegion = addressRegion;
  if (postalCode) address.postalCode = postalCode;
  if (addressCountry) address.addressCountry = addressCountry;

  if (Object.keys(address).length > 0) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  if (areaServed) {
    jsonLd.contactPoint = {
      '@type': 'ContactPoint',
      areaServed,
    };
  }

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd, null, 2);

  // Clear the block content and append the script
  block.innerHTML = '';
  block.append(script);
  block.classList.add('organization-schema'); // Apply the block's own class
}
