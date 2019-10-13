'use strict';

window.util = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  // Обращаемся к инпуту с хэштегами
  var hashtagsInput = document.querySelector('.text__hashtags');
  // Обращаемся к инпуту с комментариями (ФОТО ПОЛЬЗОВАТЕЛЕЙ)
  var commentPreviewInput = document.querySelector('.social__footer-text');
  // Обращаемся к инпуту с с комментариями (ЗАГРУЗКА ФОТО)
  var commentUploadInput = document.querySelector('.text__description');
  // создаем пустой массив картинок
  var pictures = [];
  return {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE && document.activeElement !== hashtagsInput && document.activeElement !== commentPreviewInput && document.activeElement !== commentUploadInput) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
      }
    },
    /*
     * Функция перемешивания массива
     *
     * @param arr - исходный массив
     *
     * @return arr - перемешанный массив
     */
    shuffleArr: function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    },

    hashtagsInput: hashtagsInput,
    commentPreviewInput: commentPreviewInput,
    commentUploadInput: commentUploadInput,
    pictures: pictures
  }
})();
