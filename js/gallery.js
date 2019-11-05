'use strict';

(function () {
  /*
   * Функция нажатия на кнопку ESC
   * @param evt - Объект Event
   */
  var onGalleryErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, closeGalleryError);
  };

  /*
   * Функция закрытия окна ошибки
   */
  var closeGalleryError = function () {
    window.util.errorTemplate.remove();
    document.removeEventListener('keydown', onGalleryErrorEscPress);
  };

  // закрытие окна ошибки
  window.util.errorTemplate.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('error') || evt.target.classList.contains('error__button')) {
      closeGalleryError();
    }
  });

  // обращаемся к шаблону фотографий
  var photosTemplate = document.querySelector('#picture').content.querySelector('.picture');

  /*
   * Функция возврщает сгенерированное фото
   *
   * @param photo - фото
   *
   * @return photoElement - сгенерированное фото
   */
  var renderPhoto = function (photo) {
    var photoElement = photosTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').setAttribute('src', photo['url']);

    photoElement.querySelector('.picture__likes').textContent = photo['likes'];
    photoElement.querySelector('.picture__comments').textContent = photo['comments'].length;

    photoElement.setAttribute('data-index', photo['index']);

    return photoElement;
  };

  window.renderGallery = function (data) {
    // в фрагмент записываем все сгенерированные фото
    for (var k = 0; k < data.length; k++) {
      // присваиваем дополнительное свойство для связки с DOM
      data[k]['index'] = k;

      window.util.photosBlock.appendChild(renderPhoto(data[k]));
    }
  };

  /*
  * Функция загрузки фотографий
  */
  var successLoadHandler = function (data) {
    // в пустой массив добавляем элементы с сервера
    window.util.picturesArr = data;

    window.renderGallery(window.util.picturesArr);

    // показываем кнопки фильтрации
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  /*
  * Функция вывода ошибок
  */
  var errorLoadHandler = function () {
    document.querySelector('main').insertAdjacentElement('afterbegin', window.util.errorTemplate);
    document.addEventListener('keydown', onGalleryErrorEscPress);
  };

  window.load(successLoadHandler, errorLoadHandler);


  // ФИЛЬТРАЦИЯ ИЗОБРАЖЕНИЙ
  var filtersBtnsBlock = document.querySelector('.img-filters');
  var filterBtns = document.querySelectorAll('.img-filters__button');

  // очистка галлереи
  var cleanGallery = function () {
    var galleryItems = window.util.photosBlock.children;

    for (var i = galleryItems.length - 1; i >= 2; i--) {
      var galleryItem = galleryItems[i];

      galleryItem.parentElement.removeChild(galleryItem);
    }
  };

  var clickFilterBtns = function (evt) {
    var target = evt.target;

    // Копирование массива изображений
    var copyPicturesArr = window.util.picturesArr.slice();
    // удаляем класс активной кнопки
    for (var i = 0; i < filterBtns.length; i++) {
      filterBtns[i].classList.remove('img-filters__button--active');
    }

    // присваиваем класс активной кнопки
    if (target.classList.contains('img-filters__button')) {
      target.classList.add('img-filters__button--active');
    }

    // получаем id кнопки
    var btnsId = target.getAttribute('id');

    switch (true) {
      case btnsId === 'filter-popular':
        cleanGallery();

        window.renderGallery(window.util.picturesArr);

        break;
      case btnsId === 'filter-random':

        cleanGallery();

        window.util.shuffleArr(copyPicturesArr);

        window.renderGallery(copyPicturesArr);


        break;
      case btnsId === 'filter-discussed':

        break;
    }
  };
  filtersBtnsBlock.addEventListener('click', clickFilterBtns);
})();
