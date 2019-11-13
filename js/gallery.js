'use strict';

(function () {

  var photosTemplate = document.querySelector('#picture').content.querySelector('.picture'); // обращаемся к шаблону фотографий
  var filtersBtnsBlock = document.querySelector('.img-filters'); // блок с кнопками фильтрации
  var filterBtns = document.querySelectorAll('.img-filters__button'); // кнопки фильтрации

  /*
  * Функция нажатия на кнопку ESC
  *
  * @param evt - Объект Event
  */
  var galleryErrorEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeGalleryError);
  };

  /*
  * Функция закрытия окна ошибки
  */
  var closeGalleryError = function () {
    window.util.errorTemplate.remove();
    document.removeEventListener('keydown', galleryErrorEscPressHandler);
  };

  // закрытие окна ошибки
  window.util.errorTemplate.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('error') || evt.target.classList.contains('error__button')) {
      closeGalleryError();
    }
  });

  /*
  * Функция возврщает сгенерированное фото
  *
  * @param photo - фото
  *
  * @return photoItem - сгенерированное фото
  */
  var renderPhoto = function (photo) {
    var photoItem = photosTemplate.cloneNode(true);

    photoItem.querySelector('.picture__img').setAttribute('src', photo['url']);

    photoItem.querySelector('.picture__likes').textContent = photo['likes'];
    photoItem.querySelector('.picture__comments').textContent = photo['comments'].length;

    photoItem.setAttribute('data-index', photo['index']);

    return photoItem;
  };

  /*
  * Функция отрисовки галереи
  *
  * @param data - массив данных
  * @param quantity - количество выводимых фотографий
  */
  var renderGallery = function (data, quantity) {
    // в фрагмент записываем все сгенерированные фото
    for (var k = 0; k < quantity; k++) {
      window.util.picturesArr[k]['index'] = k;
      window.util.photosBlock.appendChild(renderPhoto(data[k]));
    }
  };

  /*
  * Функция загрузки фотографий
  */
  var successLoadHandler = function (data) {
    // в пустой массив добавляем элементы с сервера
    window.util.picturesArr = data;

    for (var c = 0; c < window.util.picturesArr.length; c++) {
      // присваиваем дополнительное свойство для связки с DOM
      window.util.picturesArr[c]['index'] = c;
    }

    renderGallery(window.util.picturesArr, 25);

    // показываем кнопки фильтрации
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  /*
  * Функция вывода ошибок
  */
  var errorLoadHandler = function () {
    document.querySelector('main').insertAdjacentElement('afterbegin', window.util.errorTemplate);
    document.addEventListener('keydown', galleryErrorEscPressHandler);
  };

  window.load.loadFunc(successLoadHandler, errorLoadHandler);

  // очистка галлереи
  var cleanGallery = function () {
    var galleryItems = window.util.photosBlock.children;

    for (var i = galleryItems.length - 1; i >= 2; i--) {
      var galleryItem = galleryItems[i];

      galleryItem.parentElement.removeChild(galleryItem);
    }
  };

  /*
  * Функция клика по кнопкам фильтрации
  */
  var clickFilterBtns = function (evt) {
    var target = evt.target;

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

    // проверка условий на содержание id соответствующей кнопки
    switch (btnsId) {
      case 'filter-popular':
        cleanGallery();

        renderGallery(window.util.picturesArr, 25);

        break;

      case 'filter-random':
        cleanGallery();

        // Копирование массива изображений
        var randomPictureArr = window.util.picturesArr.slice();
        // Перемешиваем массив
        window.util.shuffleArr(randomPictureArr);
        // показываем перемешанные фотки
        renderGallery(randomPictureArr, 10);

        break;

      case 'filter-discussed':
        cleanGallery();

        // Копирование массива изображений
        var discussedPictureArr = window.util.picturesArr.slice();
        // сортируем массив по убыванию количеству комментариев
        discussedPictureArr.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        // показываем отсортированные фотки
        renderGallery(discussedPictureArr, 25);

        break;
    }
  };

  filtersBtnsBlock.addEventListener('click', window.timer.debounce(clickFilterBtns));
})();
