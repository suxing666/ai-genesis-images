import './styles/index.css';

import { initSizeSelector } from './modules/size-selector.js';
import { initStyleSelector } from './modules/style-selector.js';
import { initSidebar } from './modules/sidebar.js';
import { initTabs } from './modules/tabs.js';
import { initImageGeneration } from './modules/image-gen.js';
import { initVideoGeneration } from './modules/video-gen.js';
import { initNumberInputControls } from './modules/number-controls.js';

initSizeSelector();
initStyleSelector();
initSidebar();
initTabs();
initImageGeneration();
initVideoGeneration();
initNumberInputControls();
