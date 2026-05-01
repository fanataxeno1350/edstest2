import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block is an experience fragment, which means its content is static
  // and should replace the block itself. The blockJson has an empty model,
  // confirming this is a static structure.
  // We need to recreate the exact structure from the ORIGINAL HTML.

  const footer = document.createElement('footer');
  footer.classList.add('experiencefragment');
  moveInstrumentation(block, footer);

  const cmpExperiencefragment = document.createElement('div');
  cmpExperiencefragment.id = 'experiencefragment-90f25bb0b6';
  cmpExperiencefragment.classList.add('cmp-experiencefragment', 'cmp-experiencefragment--footer');
  footer.append(cmpExperiencefragment);

  const cmpContainer = document.createElement('div');
  cmpContainer.id = 'container-8ff4e6e956';
  cmpContainer.classList.add('cmp-container', 'container-8ff4e6e956');
  cmpExperiencefragment.append(cmpContainer);

  const aemGrid = document.createElement('div');
  aemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
  cmpContainer.append(aemGrid);

  const embedGridColumn = document.createElement('div');
  embedGridColumn.classList.add('embed', 'aem-GridColumn', 'aem-GridColumn--default--12');
  aemGrid.append(embedGridColumn);

  const cmpEmbed = document.createElement('div');
  cmpEmbed.id = 'embed-f4b743e8d5';
  cmpEmbed.classList.add('cmp-embed');
  embedGridColumn.append(cmpEmbed);

  // The original HTML contains a <style> block within the embed.
  // We should replicate this as is, as it contains critical styling.
  const style = document.createElement('style');
  style.textContent = `
@media only screen and (max-width: 600px) {.cmp-product-listing .product-listing-content-wrapper .list-item-wrapper {
    width: 100%;
    text-align: center;
}}
 .text .cmp-text p a {
    color:  #d62118;}
.flex-cards li p:nth-child(2) {color:#d62118 !important;}
.tabs.tabs--timeline .cmp-tabs .cmp-tabs__tablist .cmp-tabs__tab.cmp-tabs__tab--active {
    background-color: #ed241b;
}
.carousel .cmp-carousel__indicators .cmp-carousel__indicator.cmp-carousel__indicator--active {
    background-color: #ed241b ;
}
.cmp-experiencefragment--footer>.cmp-container .footer-main .footer-secondary .cmp-container>div .text.red-cross-disclaimer p:first-child {
    color: #ff261d;
}
.cmp-experiencefragment--footer{
margin-top:0;
}

#submenu-heading{
font-size: 1rem;
    font-weight: 700;
}
#submenu-heading1{
font-size: 1rem;
    font-weight: 700;
}


#allproductsmenu .aem-Grid.aem-Grid--default--12>.aem-GridColumn.aem-GridColumn--default--6{
    width:33.33%
}

#submenucol1, #submenucol2, #submenucol3{
    padding: 20px 10px;
        text-align: center;
}

#allproductsmenu .aem-Grid.aem-Grid--default--12>.aem-GridColumn.aem-GridColumn--default--6 a.cmp-button:not(#submenu-heading){
    color: #000;
    font-size: .75rem;
    line-height: 1.2;
    font-family: ff-dax-compact-web-pro, Arial, Helvetica, sans-serif;
    font-weight: 600;
    width: 50%;
    text-align: center;
}

@media only screen and (max-width: 991px) {
.cmp-experiencefragment--footer>.cmp-container .footer-main .footer-primary>.cmp-container>div .footer-social-links>.cmp-container>div .container>.cmp-container>div {
jus
`;
  cmpEmbed.append(style);

  block.replaceWith(footer);
}
