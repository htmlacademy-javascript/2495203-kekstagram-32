import { getPhotosData } from './api.js';
import './upload-form.js';
import { createPhotoGallery, onPhotosGettingError } from './photo-gallery.js';

getPhotosData(createPhotoGallery, onPhotosGettingError);
