import { onMiniatureClick } from './image-fullsize-mode.js';
import { photosDataArray, renderPhotoMiniatures } from './photo-miniatures.js';
import './upload-form.js';

renderPhotoMiniatures(photosDataArray);
onMiniatureClick(photosDataArray);
