import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const schemaData = {};
  const sameAsLinks = [];

  const [
    orgNameRow,
    logoRow,
    urlRow,
    streetAddressRow,
    addressLocalityRow,
    addressRegionRow,
    postalCodeRow,
    addressCountryRow,
    areaServedRow,
    ...socialLinkRows
  ] = [...block.children];

  const orgName = orgNameRow?.firstElementChild?.textContent.trim();
  if (orgName) schemaData.name = orgName;

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      schemaData.logo = img.src;
      // Optimize logo image
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoPicture.replaceWith(optimizedPic);
    }
  }

  const urlLink = urlRow?.querySelector('a');
  if (urlLink) schemaData.url = urlLink.href;

  const address = {};
  const streetAddress = streetAddressRow?.firstElementChild?.textContent.trim();
  if (streetAddress) address.streetAddress = streetAddress;

  const addressLocality = addressLocalityRow?.firstElementChild?.textContent.trim();
  if (addressLocality) address.addressLocality = addressLocality;

  const addressRegion = addressRegionRow?.firstElementChild?.textContent.trim();
  if (addressRegion) address.addressRegion = addressRegion;

  const postalCode = postalCodeRow?.firstElementChild?.textContent.trim();
  if (postalCode) address.postalCode = postalCode;

  const addressCountry = addressCountryRow?.firstElementChild?.textContent.trim();
  if (addressCountry) address.addressCountry = addressCountry;

  if (Object.keys(address).length > 0) {
    schemaData.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  const areaServed = areaServedRow?.firstElementChild?.textContent.trim();
  if (areaServed) {
    schemaData.contactPoint = {
      '@type': 'ContactPoint',
      areaServed,
    };
  }

  socialLinkRows.forEach((row) => {
    const linkElement = row.querySelector('a');
    if (linkElement && linkElement.href) {
      sameAsLinks.push(linkElement.href);
    }
  });

  if (sameAsLinks.length > 0) {
    schemaData.sameAs = sameAsLinks;
  }

  if (Object.keys(schemaData).length > 0) {
    const fullSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      ...schemaData,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(fullSchema, null, 2);
    block.append(script);
  }

  // Clear the block content as it's only for schema generation
  block.textContent = '';
  block.classList.add('org-schema'); // Apply the block's own class
}
