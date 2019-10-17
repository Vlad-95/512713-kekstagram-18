'use strict';

(function () {
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
  var successHandler = function (pictures) {
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

  var errorHandler = function (errorMessage) {

    // обращаемся к шаблону Ошибки
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');

    errorTemplate.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorTemplate);
  };

  window.load(successHandler, errorHandler);


})();
