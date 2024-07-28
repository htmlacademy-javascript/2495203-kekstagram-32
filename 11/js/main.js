import { downloadData, onDataDownloadingError } from './data-downloading.js';
import './upload-form.js';
import { createPhotoGallery } from './photo-gallery.js';

downloadData(createPhotoGallery, onDataDownloadingError);
