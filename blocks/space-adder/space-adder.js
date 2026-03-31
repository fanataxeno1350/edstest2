import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The original HTML already contains the <section class="verticalPadding_section padding-80"></section>
  // The block itself is just a container for this section.
  // No additional elements need to be created or appended by the JS.
  // The block is essentially a wrapper for a pre-defined empty section.
}
