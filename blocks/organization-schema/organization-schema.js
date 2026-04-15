import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    nameRow,
    logoRow,
    urlRow,
    areaServedRow,
    ...itemRows
  ] = [...block.children];

  const name = nameRow?.firstElementChild?.textContent.trim();
  const logoPicture = logoRow?.firstElementChild?.querySelector('picture');
  // CRITICAL FIX: url field is type=aem-content, must read href, not textContent
  const url = urlRow?.firstElementChild?.querySelector('a')?.href;
  const areaServed = areaServedRow?.firstElementChild?.textContent.trim();

  // Item rows are distinguished by the number of cells they contain
  // address-item has 5 cells, socialLinks (aem-content) has 1 cell
  const addressItems = itemRows.filter((row) => row.children.length === 5);
  const socialLinkItems = itemRows.filter((row) => row.children.length === 1);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
  };

  if (name) {
    organizationSchema.name = name;
  }

  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      organizationSchema.logo = img.src;
    }
    // Optimize the logo image
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '250' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoPicture.replaceWith(optimizedPic);
  }

  if (url) {
    organizationSchema.url = url;
  }

  if (addressItems.length > 0) {
    organizationSchema.address = addressItems.map((row) => {
      // Using destructuring for fixed-field item models is correct
      const [streetAddressCell, addressLocalityCell, addressRegionCell, postalCodeCell, addressCountryCell] = [...row.children];
      const address = {
        "@type": "PostalAddress",
      };
      if (streetAddressCell?.textContent.trim()) address.streetAddress = streetAddressCell.textContent.trim();
      if (addressLocalityCell?.textContent.trim()) address.addressLocality = addressLocalityCell.textContent.trim();
      if (addressRegionCell?.textContent.trim()) address.addressRegion = addressRegionCell.textContent.trim();
      if (postalCodeCell?.textContent.trim()) address.postalCode = postalCodeCell.textContent.trim();
      if (addressCountryCell?.textContent.trim()) address.addressCountry = addressCountryCell.textContent.trim();
      return address;
    });
    // If there's only one address, schema.org expects it as an object, not an array
    if (organizationSchema.address.length === 1) {
      organizationSchema.address = organizationSchema.address[0];
    }
  }

  if (areaServed) {
    organizationSchema.contactPoint = {
      "@type": "ContactPoint",
      areaServed: areaServed,
    };
  }

  if (socialLinkItems.length > 0) {
    organizationSchema.sameAs = socialLinkItems.map((row) => {
      // Social links are type=aem-content, so we need to get the href from the <a> tag
      const link = row.firstElementChild?.querySelector('a');
      return link ? link.href : null;
    }).filter(Boolean);
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(organizationSchema, null, 2);
  block.append(script);

  // Remove all original content from the block as it's only for schema generation
  block.textContent = '';
}
