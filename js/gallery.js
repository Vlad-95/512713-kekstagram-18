'use strict';

(function () {
  // обращаемся к шаблону фотографий
  var photosTemplate = document.querySelector('#picture').content.querySelector('.picture');

  // перемешиваем массивы имен, аватарок и описания
  window.util.shuffleArr(window.data.NAMES);
  window.util.shuffleArr(window.data.IMAGES);
  window.util.shuffleArr(window.data.AVATARS);
  window.util.shuffleArr(window.data.DESCRIPTIONS);

  // наполняем пустой массив
  for (var i = 0; i < window.data.QUANTITY_PHOTOS; i++) {
    // перемешиваем массив с комментариями на каждой итерации, чтобы были разными для каждой фотки
    window.util.shuffleArr(window.data.COMMENTS);
    // для каждого элемента массива создаем объект
    window.util.pictures[i] = {};
    window.util.pictures[i]['index'] = i;
    // в объект записываем свойста(имя, путь к картинке, описание, комментарии, количество лайков) и их значения
    window.util.pictures[i]['name'] = window.data.NAMES[i];
    window.util.pictures[i]['url'] = window.data.IMAGES[i];
    window.util.pictures[i]['avatar'] = window.data.AVATARS[i];
    window.util.pictures[i]['description'] = window.data.DESCRIPTIONS[i];
    window.util.pictures[i]['likes'] = Math.floor(Math.random() * (200 - 15 + 1) + 15);
    // в свойство комментарий записываем пустой обьект
    window.util.pictures[i]['comments'] = {};

    var commentLength = 0; // создаем переменную, которая будет хранить в себе длину объекта с комментами

    for (var j = 0; j < 2; j++) {
      window.util.pictures[i]['comments'][j] = [];
      window.util.pictures[i]['comments'][j]['text'] = window.data.COMMENTS[j];
      window.util.pictures[i]['comments'][j]['avatar'] = window.data.AVATARS[j];
      window.util.pictures[i]['comments'][j]['name'] = window.data.NAMES[j];
      commentLength++;
    }
  }

  /*
   * Функция возврщает сгенерированное фото
   *
   * @param photo - фото
   *
   * @return photoElement - сгенерированное фото
   */
  var renderPhoto = function (photo) {
    var photoElement = photosTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').setAttribute('src', 'photos/' + photo['url'] + '.jpg');

    photoElement.querySelector('.picture__likes').textContent = photo['likes'];
    photoElement.querySelector('.picture__comments').textContent = commentLength;

    photoElement.setAttribute('data-index', photo['index']);

    return photoElement;
  };

  // создаем фрагмент
  var fragmentPhoto = document.createDocumentFragment();

  // в фрагмент записываем все сгенерированные фото
  for (var k = 0; k < window.data.QUANTITY_PHOTOS; k++) {
    fragmentPhoto.appendChild(renderPhoto(window.util.pictures[k]));
  }
  // добавляем в блок с фото созданый фрагмент
  window.util.photosBlock.appendChild(fragmentPhoto);
})();
