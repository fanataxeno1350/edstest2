import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    nameRow,
    logoRow,
    urlRow,
    streetAddressRow,
    addressLocalityRow,
    addressRegionRow,
    postalCodeRow,
    addressCountryRow,
    areaServedRow,
    ...sameAsRows
  ] = [...block.children];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
  };

  const getName = (row) => row.firstElementChild?.textContent?.trim();
  const getUrl = (row) => row.querySelector('a')?.href;
  const getImgSrc = (row) => row.querySelector('picture img')?.src;
  const getImgAlt = (row) => row.querySelector('picture img')?.alt;

  if (nameRow) {
    schema.name = getName(nameRow);
  }

  if (logoRow) {
    const logoSrc = getImgSrc(logoRow);
    if (logoSrc) {
      schema.logo = logoSrc;
      const picture = logoRow.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
        }
      }
    }
  }

  if (urlRow) {
    schema.url = getUrl(urlRow);
  }

  const address = {};
  if (streetAddressRow) {
    address.streetAddress = getName(streetAddressRow);
  }
  if (addressLocalityRow) {
    address.addressLocality = getName(addressLocalityRow);
  }
  if (addressRegionRow) {
    address.addressRegion = getName(addressRegionRow);
  }
  if (postalCodeRow) {
    address.postalCode = getName(postalCodeRow);
  }
  if (addressCountryRow) {
    address.addressCountry = getName(addressCountryRow);
  }

  if (Object.keys(address).length > 0) {
    schema.address = {
      "@type": "PostalAddress",
      ...address,
    };
  }

  if (areaServedRow) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      areaServed: getName(areaServedRow),
    };
  }

  if (sameAsRows.length > 0) {
    schema.sameAs = sameAsRows.map((row) => getUrl(row));
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);

  block.textContent = '';
  block.append(script);
}
