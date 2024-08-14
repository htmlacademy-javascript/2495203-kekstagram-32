import { uploadInputElement, onUploadInputChange } from './upload-form.js';
import { getPhotosData } from './api.js';
import { createPhotoGallery, onPhotosGettingError } from './photo-gallery.js';

const GET_PHOTOS_DATA_ROUTE = 'https://32.javascript.htmlacademy.pro/kekstagram/data';

uploadInputElement.addEventListener('change', onUploadInputChange);
getPhotosData(GET_PHOTOS_DATA_ROUTE, createPhotoGallery, onPhotosGettingError);
