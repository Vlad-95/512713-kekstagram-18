'use strict';

(function () {
  // окно редактирования/загрузки
  var uploadBlockPic = document.querySelector('.img-upload__overlay'); // блок редактирования картинки
  var uploadPicInput = document.querySelector('#upload-file'); // инпут загрузки файлов
  var uploadBlockClose = document.querySelector('#upload-cancel'); // инпут закрытия
  var previewPic = document.querySelector('.img-upload__preview img'); // загруженная картинка

  // масштаб
  var scalePlus = document.querySelector('.scale__control--bigger'); // масштаб +
  var scaleMinus = document.querySelector('.scale__control--smaller'); // масштаб -
  var scaleValue = document.querySelector('.scale__control--value'); // значение масштаба

  // эффекты
  var startCoordX; // координаты клика
  var effectLevelInput = document.querySelector('.effect-level__value'); // скрытый инпут, в котором отправляется значение
  var effectBlock = document.querySelector('.img-upload__effect-level'); // родительский блок изменения насыщенности
  var effectLine = document.querySelector('.effect-level__line'); // линия насыщенности эффекта
  var effectPin = document.querySelector('.effect-level__pin'); // бегунок насыщенности
  var effectDepth = document.querySelector('.effect-level__depth'); // уровень насыщенности (линия до бегунка)
  var effectsBtns = document.querySelectorAll('.effects__radio'); // эффекты

  // хэштеги
  var LIMIT_HASHTAGS = 5; // Лимит хештегов для загруженного фото.
  var MAX_HASHTAG_LENGTH = 20; // с учетом учета #
  var MIN_HASHTAG_LENGTH = 2; // с учетом учета #
  var regExpEmptySpace = /[а-яА-Яa-zA-Z0-9]+\#[^\s]/g; // регулярка на остутствие пробела;
  var regExpSpace = (/[\s]+/); // регулярка на содержание пробела для создания массива

  // комментарии
  var COMMENT_LENGTH = 140; // Лимит символов в комментарии

  /*
   * Функция нажатия на кнопку ESC
   * @param evt - Объект Event
   */
  var onUploadPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadPopup);
  };

  /*
   * Функция открытия окна загрузки/редактирования фото
   */
  var openUploadPopup = function () {
    uploadBlockPic.classList.remove('hidden');
    // удаляем все эффекты при открытии
    previewPic.classList.add('effect-none');
    // обнуляем значение инпута эффекта при открытии
    effectLevelInput.value = 0;
    // удаляем линию насыщенности
    if (previewPic.classList.contains('effect-none')) {
      effectBlock.style.display = 'none';
    }
    document.addEventListener('keydown', onUploadPopupEscPress);
  };

  /*
   * Функция закрытия окна загрузки/редактирования фото
   */
  var closeUploadPopup = function () {
    uploadBlockPic.classList.add('hidden');
    document.removeEventListener('keydown', onUploadPopupEscPress);
  };

  // отслеживание события на открытие онка
  uploadPicInput.addEventListener('change', function () {
    openUploadPopup();
  });

  // закрытие окна
  uploadBlockClose.addEventListener('click', function () {
    closeUploadPopup();
  });

  // закрытие окна по клаве
  uploadBlockClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closeUploadPopup);
  });

  // масштаб картинки
  var defaultScaleValue = 100;
  scaleValue.value = defaultScaleValue + '%';

  scalePlus.addEventListener('click', function () {

    defaultScaleValue = defaultScaleValue + 25;
    if (defaultScaleValue > 100) {
      defaultScaleValue = 100;
    }
    scaleValue.value = defaultScaleValue + '%';

    previewPic.style.transform = 'scale(' + defaultScaleValue / 100 + ')';
  });

  scaleMinus.addEventListener('click', function () {

    defaultScaleValue = defaultScaleValue - 25;
    if (defaultScaleValue < 25) {
      defaultScaleValue = 25;
    }
    scaleValue.value = defaultScaleValue + '%';

    previewPic.style.transform = 'scale(' + defaultScaleValue / 100 + ')';
  });

  // применение эффектов
  for (var b = 0; b < effectsBtns.length; b++) {
    effectsBtns[b].addEventListener('click', function (evt) {
      // обнуляем инпут при каждом выборе эффекта
      effectLevelInput.value = 0;
      // получаем id элемента, по которому кликнули
      var effectBtnId = evt.target.getAttribute('id');
      // возвращаем бегунок в начальное положение
      effectPin.style.left = 0 + 'px';
      effectDepth.style.width = 0 + 'px';
      // при каждом клике удаляем все классы наа изображении
      previewPic.removeAttribute('class');

      // присваиваем классы в соответствии с полученным id
      if (effectBtnId === 'effect-none') {
        previewPic.classList.add('effect-none');
        previewPic.style.webkitFilter = 'none';
      } else if (effectBtnId === 'effect-chrome') {
        previewPic.classList.add('effects__preview--chrome');
        previewPic.style.webkitFilter = 'grayscale(0)';
      } else if (effectBtnId === 'effect-sepia') {
        previewPic.classList.add('effects__preview--sepia');
        previewPic.style.webkitFilter = 'sepia(0)';
      } else if (effectBtnId === 'effect-marvin') {
        previewPic.classList.add('effects__preview--marvin');
        previewPic.style.webkitFilter = 'invert(0)';
      } else if (effectBtnId === 'effect-phobos') {
        previewPic.classList.add('effects__preview--phobos');
        previewPic.style.webkitFilter = 'blur(0)';
      } else if (effectBtnId === 'effect-heat') {
        previewPic.classList.add('effects__preview--heat');
        previewPic.style.webkitFilter = 'brightness(1)';
      }

      // удаляем линию насыщенности, если кликнули на "ОРИГИНАЛ"
      if (previewPic.classList.contains('effect-none')) {
        effectBlock.style.display = 'none';
      } else {
        effectBlock.style.display = 'block';
      }
    });
  }

  /*
   * Функция изменения насыщенности эффекта
   * @param x - позиция по оси x
   */
  var changeIntensiveFilter = function (x) {
    var positionX = parseInt(x, 10); // переводим x в число
    // делаем пропорции для каждого эффекта
    var filtervalue = positionX / effectLine.offsetWidth; // 0...1
    var filtervalueMarvin = (positionX / effectLine.offsetWidth) * 100; // 0...100%
    var filterBlur = positionX / 100;
    var filterBrightness = positionX / 100;

    if (filterBrightness < 1) {
      filterBrightness = 1;
    }

    // записываем value эффекта в скрытый инпут
    effectLevelInput.value = Math.round((positionX / effectLine.offsetWidth) * 100);

    // присваиваем полученные значения
    if (previewPic.classList.contains('effects__preview--chrome')) {
      previewPic.style.webkitFilter = 'grayscale(' + filtervalue + ')';
    }
    if (previewPic.classList.contains('effects__preview--sepia')) {
      previewPic.style.webkitFilter = 'sepia(' + filtervalue + ')';
    }
    if (previewPic.classList.contains('effects__preview--marvin')) {
      previewPic.style.webkitFilter = 'invert(' + filtervalueMarvin + '%' + ')';
    }
    if (previewPic.classList.contains('effects__preview--phobos')) {
      previewPic.style.webkitFilter = 'blur(' + filterBlur + 'px' + ')';
    }
    if (previewPic.classList.contains('effects__preview--heat')) {
      previewPic.style.webkitFilter = 'brightness(' + filterBrightness + ')';
    }
  };

  /*
   * Фунция перемещения бегунка
   * @param moveEvt - объект Event
   */
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    // разница координат
    var shift = startCoordX - moveEvt.clientX;

    // начальный координаты
    startCoordX = moveEvt.clientX;

    // позиционирование бегунка
    var pinPositionX = effectPin.offsetLeft - shift;

    // проверка на отрицательность и превышение максимального значения
    if (pinPositionX < 0) {
      pinPositionX = 0;
    } else if (pinPositionX > effectLine.offsetWidth) {
      pinPositionX = effectLine.offsetWidth;
    }

    // координаты записываем в стили left
    changeIntensiveFilter(effectPin.style.left);
    effectPin.style.left = pinPositionX + 'px';
    effectDepth.style.width = pinPositionX + 'px';
  };

  /*
   * Функция отжатия кнопки мыши
   */
  var onMouseUp = function () {
    // удаляем все обработчики
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  /*
   * Функция нажатия кнопки мыши
   */
  var onMouseDown = function (downEvt) {
    downEvt.preventDefault();
    startCoordX = downEvt.clientX;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  effectBlock.addEventListener('mousedown', onMouseDown);

  /*
   * Метод проверки уникальности значений в массиве.
   * @param {array} arr  Исходный массив.
   */
  var isArrayUnique = function (arr) {

    var myArray = arr.sort();

    for (var c = 0; c < myArray.length; c++) {
      if (myArray.indexOf(myArray[c]) !== myArray.lastIndexOf(myArray[c])) {
        return true;
      }
    }

    return false;
  };

  /*
  * Методы проверки количества символов
  *
  * @param element - элемент массива
  * */
  var checkArrayItemMinLength = function (element) {
    return element.length > MIN_HASHTAG_LENGTH;
  };

  var checkArrayItemMaxLength = function (element) {
    return element.length < MAX_HASHTAG_LENGTH;
  };

  /*
  * Метод проверки обязательного символа #
  *
  * @param arr - массив
  * @param item - элемент массива
  */
  var checkHashSymbol = function (arr) {
    return arr.some(function (item) {
      return item[0] === '#';
    });
  };

  /*
  * Метод проверки на наличие пробела между хештегами
  *
  * @param input - инпут с хэштегами
  * @param regExp - регулярка
  */
  var checkSpaceSymbols = function (input, regExp) {

    if (input.value.match(regExp)) {
      return false;
    }

    return true;
  };

  /*
  * Метод проверки количества хэштегов
  *
  * @param arr - массив
  */
  var checkArrayLength = function (arr) {
    return arr.length <= LIMIT_HASHTAGS;
  };

  // Вешаем listener на изменение
  window.util.hashtagsInput.addEventListener('input', function (evt) {
    var target = evt.target;

    target.setCustomValidity(''); // После каждого редактирования сбрасываем ошибку, считая что она исправлена, и выполняем проверку по новой.

    // создаем массив разделяя элементы по пробелу
    var arrHashtags = target.value.toLowerCase().split(regExpSpace);

    // Проверка дубликатов
    if (isArrayUnique(arrHashtags)) {
      target.setCustomValidity('Хэштеги не должны повторяться.');
    }

    // Проверка на минимальное количество
    if (!arrHashtags.some(checkArrayItemMinLength)) {
      target.setCustomValidity('Минимальное количество символов хэштега более ' + MIN_HASHTAG_LENGTH);
    }

    // Проверка на максимальное количество
    if (!arrHashtags.some(checkArrayItemMaxLength)) {
      target.setCustomValidity('Минимальное количество символов хэштега менее ' + MAX_HASHTAG_LENGTH);
    }

    // Проверка на обязательный символ #
    if (!checkHashSymbol(arrHashtags)) {
      target.setCustomValidity('Хэштег должен начинаться с #');
    }

    // Проверка на содержание пробелов между хэштегами
    if (!checkSpaceSymbols(target, regExpEmptySpace)) {
      target.setCustomValidity('Хэштеги должны быть разделены пробелом');
    }

    // Проверка на максимальное количество хэштегов
    if (!checkArrayLength(arrHashtags)) {
      target.setCustomValidity('Максимальное количество хэштегов ' + LIMIT_HASHTAGS);
    }

    target.reportValidity(); // генерирует проверку валидации, вызывая метод oninvalid в случае не прохождения валидации.
  });

  /*
  * Метод проверки длины комментария
  */
  var checkCommentLength = function (comment) {
    return comment.value.length < COMMENT_LENGTH;

  };

  // Вешаем listener на изменение
  window.util.commentUploadInput.addEventListener('input', function (evt) {
    var target = evt.target;

    // Проверка на максимальную длину комментария
    if (!checkCommentLength(window.util.commentUploadInput)) {
      target.setCustomValidity('Максимальная длина комментария ' + COMMENT_LENGTH);
    }

    target.reportValidity(); // генерирует проверку валидации, вызывая метод oninvalid в случае не прохождения валидации.
  });
})();
