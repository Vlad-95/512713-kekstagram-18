'use strict';

var QUANTITY_PHOTOS = 25;
var NAMES = ['Артем', 'Влад', 'Алексей', 'Ярослав'];
var IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 25];
var AVATARS = ['img/avatar-1.svg', 'img/avatar-2.svg', 'img/avatar-3.svg', 'img/avatar-4.svg', 'img/avatar-5.svg', 'img/avatar-6.svg'];
var DESCRIPTIONS = ['Это моя супер фотка, смотрите все', 'Я люблю фоткаться', 'Жизнь - яркая штука'];
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

/*
 * Функция перемешивания массива
 *
 * @param arr - исходный массив
 *
 * @return arr - перемешанный массив
 */
var shuffleArr = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

// обращаемся к блоку с картинками
var photosBlock = document.querySelector('.pictures');
// обращаемся к шаблону фотографий
var photosTemplate = document.querySelector('#picture').content.querySelector('.picture');

// перемешиваем массивы имен, аватарок и описания
shuffleArr(NAMES);
shuffleArr(IMAGES);
shuffleArr(AVATARS);
shuffleArr(DESCRIPTIONS);


// создаем пустой массив картинок
var pictures = [];

// наполняем пустой массив
for (var i = 0; i < QUANTITY_PHOTOS; i++) {
  // перемешиваем массив с комментариями на каждой итерации, чтобы были разными для каждой фотки
  shuffleArr(COMMENTS);
  // для каждого элемента массива создаем объект
  pictures[i] = {};
  // в объект записываем свойста(имя, путь к картинке, описание, комментарии, количество лайков) и их значения
  pictures[i]['name'] = NAMES[i];
  pictures[i]['url'] = IMAGES[i];
  pictures[i]['avatar'] = AVATARS[i];
  pictures[i]['description'] = DESCRIPTIONS[i];
  pictures[i]['likes'] = Math.floor(Math.random() * (200 - 15 + 1) + 15);
  // в свойство комментарий записываем пустой обьект
  pictures[i]['comments'] = {};

  var commentLength = 0; // создаем переменную, которая будет хранить в себе длину объекта с комментами

  for (var j = 0; j < 2; j++) {
    pictures[i]['comments'][j] = [];
    pictures[i]['comments'][j]['text'] = COMMENTS[j];
    pictures[i]['comments'][j]['avatar'] = AVATARS[j];
    pictures[i]['comments'][j]['name'] = NAMES[j];
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

  return photoElement;
};

// создаем фрагмент
var fragment = document.createDocumentFragment();

// в фрагмент записываем все сгенерированные фото
for (var k = 0; k < QUANTITY_PHOTOS; k++) {
  fragment.appendChild(renderPhoto(pictures[k]));
}

// добавляем в блок с фото созданый фрагмент
photosBlock.appendChild(fragment);

/**
 * MODULE 3 TASK 3
 */

// Обращаемся к блоку с большой картинкой и удаляем класс скрывающий его
// var bigPic = document.querySelector('.big-picture');
// bigPic.classList.remove('hidden');

// Устанавливаем атрибут src из первого элемента массива с картинками
document.querySelector('.big-picture__img img').setAttribute('src', 'photos/' + pictures[0]['url'] + '.jpg');
// Выводим количество лайков из первого элемента массива с картинками
document.querySelector('.big-picture .likes-count').textContent = pictures[0]['likes'];
// Выводим описание фотографии из первого элемента массива с картинками
document.querySelector('.big-picture .social__caption').textContent = pictures[0]['description'];
// Выводим количество комментариев из первого элемента массива с картинками
document.querySelector('.big-picture .comments-count').textContent = commentLength;
// Обращаемся к блоку с комментариями
var bigPicComments = document.querySelector('.big-picture .social__comments');
// Обращаемся к шаблону комментария
var bigPicCommentTemplate = document.querySelector('.big-picture .social__comment');

/*
 * Функция возврщает сгенерированный комментарий
 *
 * @param comment - комментарий
 *
 * @return commentElement - генерированный комментарий
 */
var renderComments = function (comment) {
  var commentElement = bigPicCommentTemplate.cloneNode(true);

  commentElement.querySelector('.social__picture').setAttribute('src', comment['avatar']);
  commentElement.querySelector('.social__picture').setAttribute('alt', comment['name']);
  commentElement.querySelector('.social__text').textContent = comment['text'];

  return commentElement;
};

// в фрагмент записываем все сгенерированные комментарии
for (var a = 0; a < commentLength; a++) {
  fragment.appendChild(renderComments(pictures[0]['comments'][a]));
}

// добавляем в блок с комментариями созданый фрагмент
bigPicComments.appendChild(fragment);

/**
 * MODULE 4 TASK 2
 */
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var uploadBlockPic = document.querySelector('.img-upload__overlay'); // блок редактирования картинки
var uploadPicInput = document.querySelector('#upload-file'); // инпут загрузки файлов
var uploadBlockClose = document.querySelector('#upload-cancel'); // инпут закрытия
var previewPic = document.querySelector('.img-upload__preview img'); // загруженная картинка
var scalePlus = document.querySelector('.scale__control--bigger'); // масштаб +
var scaleMinus = document.querySelector('.scale__control--smaller'); // масштаб -
var scaleValue = document.querySelector('.scale__control--value'); // значение масштаба

var startCoordX; // координаты клика
var effectLevelInput = document.querySelector('.effect-level__value'); // скрытый инпут, в котором отправляется значение
var effectBlock = document.querySelector('.img-upload__effect-level'); // родительский блок изменения насыщенности
var effectLine = document.querySelector('.effect-level__line'); // линия насыщенности эффекта
var effectPin = document.querySelector('.effect-level__pin'); // бегунок насыщенности
var effectDepth = document.querySelector('.effect-level__depth'); // уровень насыщенности (линия до бегунка)
var effectsBtns = document.querySelectorAll('.effects__radio'); // эффекты

/*
 * Функция нажатия на кнопку ESC
 * @param evt - Объект Event
 */
var onUploadPopupEscPress = function (evt) {
  // проверка на клавишу esc и фокус в инпуте хэштегов
  if (evt.keyCode === ESC_KEYCODE && document.activeElement !== hashtagsInput) {
    closeUploadPopup();
  }
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

/**
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
uploadBlockClose.addEventListener('click', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeUploadPopup();
  }
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

var LIMIT_HASHTAGS = 5; // Лимит хештегов для загруженного фото.
var MAX_HASHTAG_LENGTH = 20; // с учетом учета #
var MIN_HASHTAG_LENGTH = 2; // с учетом учета #
var regExpEmptySpace = /[а-яА-Яa-zA-Z0-9]+\#[^\s]/g; // регулярка на остутствие пробела;
var regExpSpace = (/[\s]+/); // регулярка на содержание пробела для создания массива

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

// Обращаемся к инпуту с хэштегами
var hashtagsInput = document.querySelector('.text__hashtags');

// Вешаем listener на изменение
hashtagsInput.addEventListener('input', function (evt) {
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
