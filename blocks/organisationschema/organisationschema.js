import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    organizationNameRow,
    logoRow,
    urlRow,
    streetAddressRow,
    addressLocalityRow,
    addressRegionRow,
    postalCodeRow,
    addressCountryRow,
    areaServedRow,
    ...sameAsLinkRows
  ] = [...block.children];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  };

  const organizationName = organizationNameRow?.querySelector('div')?.textContent?.trim();
  if (organizationName) {
    schemaData.name = organizationName;
  }

  const logoImg = logoRow?.querySelector('picture img');
  if (logoImg) {
    schemaData.logo = logoImg.getAttribute('src');
  }

  const websiteUrl = urlRow?.querySelector('a');
  if (websiteUrl) {
    schemaData.url = websiteUrl.href;
  }

  const streetAddress = streetAddressRow?.querySelector('div')?.textContent?.trim();
  const addressLocality = addressLocalityRow?.querySelector('div')?.textContent?.trim();
  const addressRegion = addressRegionRow?.querySelector('div')?.textContent?.trim();
  const postalCode = postalCodeRow?.querySelector('div')?.textContent?.trim();
  const addressCountry = addressCountryRow?.querySelector('div')?.textContent?.trim();

  if (streetAddress || addressLocality || addressRegion || postalCode || addressCountry) {
    schemaData.address = {
      '@type': 'PostalAddress',
    };
    if (streetAddress) schemaData.address.streetAddress = streetAddress;
    if (addressLocality) schemaData.address.addressLocality = addressLocality;
    if (addressRegion) schemaData.address.addressRegion = addressRegion;
    if (postalCode) schemaData.address.postalCode = postalCode;
    if (addressCountry) schemaData.address.addressCountry = addressCountry;
  }

  const areaServed = areaServedRow?.querySelector('div')?.textContent?.trim();
  if (areaServed) {
    schemaData.contactPoint = {
      '@type': 'ContactPoint',
      areaServed,
    };
  }

  const sameAsLinks = sameAsLinkRows
    .map((row) => row.querySelector('a')?.href)
    .filter(Boolean);

  if (sameAsLinks.length > 0) {
    schemaData.sameAs = sameAsLinks;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemaData, null, 2);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('organisationschema-wrapper'); // Applying a class from the original HTML structure (or a reasonable wrapper class)

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('organisationschema-content'); // Applying a class from the original HTML structure (or a reasonable content class)
  contentDiv.append(script);

  wrapperDiv.append(contentDiv);

  block.textContent = '';
  block.append(wrapperDiv);

  // Optimize images if any were present (though for this block, logo is usually just a URL in schema)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
