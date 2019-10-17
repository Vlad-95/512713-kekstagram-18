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

  /*
  * Функция загрузки фотографий
  */
  var successLoadHandler = function (pictures) {
    // создаем фрагмент
    var fragmentPhoto = document.createDocumentFragment();

    // в фрагмент записываем все сгенерированные фото
    for (var k = 0; k < pictures.length; k++) {
      // присваиваем дополнительное свойство для связки с DOM
      pictures[k]['index'] = k;
      // в пустой массив добавляем элементы с сервера
      window.util.picturesArr.push(pictures[k]);
      fragmentPhoto.appendChild(renderPhoto(pictures[k]));
    }

    // добавляем в блок с фото созданый фрагмент
    window.util.photosBlock.appendChild(fragmentPhoto);
  };

  /*
  * Функция вывода ошибок
  */
  var errorLoadHandler = function () {
    document.querySelector('main').insertAdjacentElement('afterbegin', window.util.errorTemplate);
    document.addEventListener('keydown', onGalleryErrorEscPress);
  };

  window.load(successLoadHandler, errorLoadHandler);


})();
