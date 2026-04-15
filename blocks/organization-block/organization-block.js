import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const orgData = {};
  const socialLinks = [];

  const rows = [...block.children];

  // Fixed fields
  const nameCell = [...rows[0].children].find(c => c.textContent.trim() !== '');
  if (nameCell) {
    orgData.name = nameCell.textContent.trim();
  }

  const logoCell = [...rows[1].children].find(c => c.querySelector('picture'));
  if (logoCell) {
    const picture = logoCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    if (img) {
      orgData.logo = img.src;
    }
  }

  const urlCell = [...rows[2].children].find(c => c.querySelector('a'));
  if (urlCell) {
    const link = urlCell.querySelector('a');
    if (link) {
      orgData.url = link.href;
    }
  }

  const streetAddressCell = [...rows[3].children].find(c => c.textContent.trim() !== '');
  if (streetAddressCell) {
    orgData.streetAddress = streetAddressCell.textContent.trim();
  }

  const addressLocalityCell = [...rows[4].children].find(c => c.textContent.trim() !== '');
  if (addressLocalityCell) {
    orgData.addressLocality = addressLocalityCell.textContent.trim();
  }

  const addressRegionCell = [...rows[5].children].find(c => c.textContent.trim() !== '');
  if (addressRegionCell) {
    orgData.addressRegion = addressRegionCell.textContent.trim();
  }

  const postalCodeCell = [...rows[6].children].find(c => c.textContent.trim() !== '');
  if (postalCodeCell) {
    orgData.postalCode = postalCodeCell.textContent.trim();
  }

  const addressCountryCell = [...rows[7].children].find(c => c.textContent.trim() !== '');
  if (addressCountryCell) {
    orgData.addressCountry = addressCountryCell.textContent.trim();
  }

  const areaServedCell = [...rows[8].children].find(c => c.textContent.trim() !== '');
  if (areaServedCell) {
    orgData.areaServed = areaServedCell.textContent.trim();
  }

  // Social Links (item rows start from index 9)
  const socialLinkRows = rows.slice(9);
  socialLinkRows.forEach((row) => {
    const linkCell = [...row.children].find(c => c.querySelector('a'));
    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        socialLinks.push(link.href);
      }
    }
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
  };

  if (orgData.name) schema.name = orgData.name;
  if (orgData.logo) schema.logo = orgData.logo;
  if (orgData.url) schema.url = orgData.url;

  if (orgData.streetAddress || orgData.addressLocality || orgData.addressRegion || orgData.postalCode || orgData.addressCountry) {
    schema.address = {
      "@type": "PostalAddress",
    };
    if (orgData.streetAddress) schema.address.streetAddress = orgData.streetAddress;
    if (orgData.addressLocality) schema.address.addressLocality = orgData.addressLocality;
    if (orgData.addressRegion) schema.address.addressRegion = orgData.addressRegion;
    if (orgData.postalCode) schema.address.postalCode = orgData.postalCode;
    if (orgData.addressCountry) schema.address.addressCountry = orgData.addressCountry;
  }

  if (orgData.areaServed) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      "areaServed": orgData.areaServed,
    };
  }

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);

  block.textContent = '';
  block.append(script);

  // Apply classes to the block itself if needed, based on original HTML context
  // The original HTML only shows the script, so no visual elements are created by this block.
  // If the block were to render visual elements, classes would be applied here.
  // For example: block.classList.add('organization-schema-block');
}
