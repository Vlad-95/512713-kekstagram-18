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
  var effectsPreview = document.querySelectorAll('.effects__preview'); // превьюшки эффектов

  // хэштеги
  var LIMIT_HASHTAGS = 5; // Лимит хештегов для загруженного фото.
  var MAX_HASHTAG_LENGTH = 20; // с учетом учета #
  var MIN_HASHTAG_LENGTH = 2; // с учетом учета #
  var regExpEmptySpace = /[а-яА-Яa-zA-Z0-9]+\#[^\s]/g; // регулярка на остутствие пробела;
  var regExpSpace = (/[\s]+/); // регулярка на содержание пробела для создания массива

  // длин комментария комментарии
  var COMMENT_LENGTH = 140; // Лимит символов в комментарии

  // обращаемся к форме отправки фотографий
  var uploadForm = document.querySelector('.img-upload__form');
  // обращаемся к шаблону успеха
  var successTemplate = document.querySelector('#success').content.querySelector('.success');


  /*
  * Функция закрытия окна загрузки/редактирования фото, нажатием на кнопку ESC
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
    // устанавливаем значение масштаба 100%
    scaleValue.setAttribute('value', 100 + '%');
    // обнуляем масштаб самой картинки
    previewPic.style.transform = 'scale(' + 1 + ')';
    // удаляем все эффекты при открытии
    previewPic.setAttribute('class', 'effect-none');
    previewPic.style.webkitFilter = 'none';
    // обнуляем значение инпута эффекта при открытии
    effectLevelInput.value = 0;

    // показываем загруженную фотку
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // формат загруженых файлов

    var file = uploadPicInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    // проверка на правильность формата файла
    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        // выводим загруженную фотку
        previewPic.src = reader.result;

        // выводим загруженную фотку для превью эффектов
        for (var n = 0; n < effectsPreview.length; n++) {
          effectsPreview[n].style.backgroundImage = 'url(' + reader.result + ')';
        }
      });

      reader.readAsDataURL(file);
    }

    // удаляем линию насыщенности
    if (previewPic.classList.contains('effect-none')) {
      effectBlock.style.display = 'none';
    }

    // добавляем листенер на закрытие окна по клавиатуре
    document.addEventListener('keydown', onUploadPopupEscPress);
  };

  /*
  * Функция закрытия окна загрузки/редактирования фото
  */
  var closeUploadPopup = function () {
    uploadBlockPic.classList.add('hidden');
    document.removeEventListener('keydown', onUploadPopupEscPress);
  };

  // отслеживание события на открытие окна загрузки/редактирования фото
  uploadPicInput.addEventListener('change', function () {
    openUploadPopup();
  });

  // закрытие окна загрузки/редактирования фото
  uploadBlockClose.addEventListener('click', function () {
    closeUploadPopup();
  });

  // закрытие окна по клаве загрузки/редактирования фото
  uploadBlockClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closeUploadPopup);
  });

  // масштаб картинки
  var defaultScaleValue = 100;
  var scaleStep = 25;
  scaleValue.setAttribute('value', defaultScaleValue + '%');

  // вешаем листенер на клик по кнопкам изменения масштаба
  scalePlus.addEventListener('click', function () {

    defaultScaleValue = defaultScaleValue + scaleStep;
    if (defaultScaleValue > 100) {
      defaultScaleValue = 100;
    }
    scaleValue.setAttribute('value', defaultScaleValue + '%');

    previewPic.style.transform = 'scale(' + defaultScaleValue / 100 + ')';
  });

  scaleMinus.addEventListener('click', function () {

    defaultScaleValue = defaultScaleValue - scaleStep;
    if (defaultScaleValue < scaleStep) {
      defaultScaleValue = scaleStep;
    }
    scaleValue.setAttribute('value', defaultScaleValue + '%');

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
      switch (effectBtnId) {
        case 'effect-none':
          previewPic.classList.add('effect-none');
          previewPic.style.webkitFilter = 'none';
          break;
        case 'effect-chrome':
          previewPic.classList.add('effects__preview--chrome');
          previewPic.style.webkitFilter = 'grayscale(0)';
          break;
        case 'effect-sepia':
          previewPic.classList.add('effects__preview--sepia');
          previewPic.style.webkitFilter = 'sepia(0)';
          break;
        case 'effect-marvin':
          previewPic.classList.add('effects__preview--marvin');
          previewPic.style.webkitFilter = 'invert(0)';
          break;
        case 'effect-phobos':
          previewPic.classList.add('effects__preview--phobos');
          previewPic.style.webkitFilter = 'blur(0)';
          break;
        case 'effect-heat':
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
    switch (true) {
      case previewPic.classList.contains('effects__preview--chrome'):
        previewPic.style.webkitFilter = 'grayscale(' + filtervalue + ')';
        break;
      case previewPic.classList.contains('effects__preview--sepia'):
        previewPic.style.webkitFilter = 'sepia(' + filtervalue + ')';
        break;
      case previewPic.classList.contains('effects__preview--marvin'):
        previewPic.style.webkitFilter = 'invert(' + filtervalueMarvin + '%' + ')';
        break;
      case previewPic.classList.contains('effects__preview--phobos'):
        previewPic.style.webkitFilter = 'blur(' + filterBlur + 'px' + ')';
        break;
      case previewPic.classList.contains('effects__preview--heat'):
        previewPic.style.webkitFilter = 'brightness(' + filterBrightness + ')';
        break;
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
  */
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
  var checkHashSymbol = function (item) {
    return item[0] === '#';
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

  /*
  * Метод проверки длины комментария
  */
  var checkCommentLength = function (comment) {
    return comment.value.length < COMMENT_LENGTH;
  };

  // Вешаем listener на ввод
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
    if (!arrHashtags.every(checkArrayItemMinLength)) {
      target.setCustomValidity('Минимальное количество символов хэштега более ' + MIN_HASHTAG_LENGTH);
    }

    // Проверка на максимальное количество
    if (!arrHashtags.every(checkArrayItemMaxLength)) {
      target.setCustomValidity('Минимальное количество символов хэштега менее ' + MAX_HASHTAG_LENGTH);
    }

    // Проверка на обязательный символ #
    if (!arrHashtags.every(checkHashSymbol)) {
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

  // Вешаем listener на изменение инпута с комментариями
  window.util.commentUploadInput.addEventListener('input', function (evt) {
    var target = evt.target;

    // Проверка на максимальную длину комментария
    if (!checkCommentLength(window.util.commentUploadInput)) {
      target.setCustomValidity('Максимальная длина комментария ' + COMMENT_LENGTH);
    }

    target.reportValidity(); // генерирует проверку валидации, вызывая метод oninvalid в случае не прохождения валидации.
  });

  /*
  * Функция закрытия успеха, нажатием на кнопку ESC
  *
  * @param evt - Объект Event
  */
  var onUploadSuccessEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadSuccess);
  };

  /*
  * Функция закрытия окна успешной отправки
  */
  var closeUploadSuccess = function () {
    successTemplate.remove();
    document.removeEventListener('keydown', onUploadSuccessEscPress);
  };

  // закрытие окна успешной отправки
  successTemplate.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('success') || evt.target.classList.contains('success__button')) {
      closeUploadSuccess();
    }
  });

  /*
  * Функция закрытия ошибки, нажатием на кнопку ESC
  *
  * @param evt - Объект Event
  */
  var onUploadErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadError);
  };

  /*
  * Функция закрытия окна ошибки
  */
  var closeUploadError = function () {
    window.util.errorTemplate.remove();
    document.removeEventListener('keydown', onUploadErrorEscPress);
  };

  // закрытие окна ошибки
  window.util.errorTemplate.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('error') || evt.target.classList.contains('error__button')) {
      closeUploadError();
    }
  });

  /*
  * Функция успешной загрузки
  */
  var successUploadHandler = function () {
    uploadBlockPic.classList.add('hidden'); // прячем окно редактирования
    uploadForm.reset(); // чистим форму

    // показываем окно успеха
    document.querySelector('main').insertAdjacentElement('afterbegin', successTemplate);

    // добавляем обработчик на закрытие окна успешного отправления по ESC
    document.addEventListener('keydown', onUploadSuccessEscPress);
  };

  /*
  * Функция вывода ошибок
  */
  var errorUploadHandler = function () {
    uploadBlockPic.classList.add('hidden'); // прячем окно редактирования
    uploadForm.reset(); // чистим форму

    // показываем окно ошибки
    document.querySelector('main').insertAdjacentElement('afterbegin', window.util.errorTemplate);

    // добавляем обработчик на закрытие окна ошибки по ESC
    document.addEventListener('keydown', onUploadErrorEscPress);
  };

  // обработчик на отправку формы
  uploadForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(uploadForm), successUploadHandler, errorUploadHandler);
    evt.preventDefault();
  });
})();
