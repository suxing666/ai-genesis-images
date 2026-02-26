import './styles/index.css';

import { initParticles } from './modules/particles.js';
import { initSizeSelector } from './modules/size-selector.js';
import { initSidebar } from './modules/sidebar.js';
import { initTabs } from './modules/tabs.js';
import { initImageGeneration } from './modules/image-gen.js';
import { initVideoGeneration } from './modules/video-gen.js';
import { initNumberInputControls } from './modules/number-controls.js';

initParticles();
initSizeSelector();
initSidebar();
initTabs();
initImageGeneration();
initVideoGeneration();
initNumberInputControls();
