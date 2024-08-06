const createMiniatureElement = (photoItem) => `<a href="#" class="picture" data-photo-id="${photoItem.id}">
                                                <img class="picture__img" src="${photoItem.url}" width="182" height="182" alt="${photoItem.description}">
                                                <p class="picture__info">
                                                  <span class="picture__comments">${photoItem.comments.length}</span>
                                                  <span class="picture__likes">${photoItem.likes}</span>
                                                </p>
                                              </a>`;

const renderPhotoMiniatures = (photosData) => {
  const picturesSection = document.querySelector('.pictures');

  photosData.forEach((photoItem) => {
    picturesSection.insertAdjacentHTML('beforeend', createMiniatureElement(photoItem));
  });
};

export { renderPhotoMiniatures };
