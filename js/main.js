import {onMiniatureClick} from './image-fullsize-mode.js';
import { photosDataArray, renderPhotoMiniatures } from './photo-miniatures.js';

renderPhotoMiniatures(photosDataArray);
onMiniatureClick(photosDataArray);
