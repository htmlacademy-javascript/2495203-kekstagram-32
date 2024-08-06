import { uploadInputElement, onUploadInputChange } from './upload-form.js';
import { getPhotosData } from './api.js';
import { createPhotoGallery, onPhotosGettingError } from './photo-gallery.js';

uploadInputElement.addEventListener('change', onUploadInputChange);
getPhotosData(createPhotoGallery, onPhotosGettingError);
