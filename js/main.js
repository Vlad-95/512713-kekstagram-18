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

/*
* MODULE 3 TASK 3
*/

// Обращаемся к блоку с большой картинкой и удаляем класс скрывающий его
/*var bigPic = document.querySelector('.big-picture');*/
/*bigPic.classList.remove('hidden');*/

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

/*
* MODULE 4 TASK 2
*/
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var uploadBlockPic = document.querySelector('.img-upload__overlay');
var uploadPicInput = document.querySelector('#upload-file');
var uploadBlockClose = document.querySelector('#upload-cancel');
var scalePlus = document.querySelector('.scale__control--bigger');
var scaleMinus = document.querySelector('.scale__control--smaller');
var scaleValue = document.querySelector('.scale__control--value');
var previewPic = document.querySelector('.img-upload__preview img');
var effectsBtns = document.querySelectorAll('.effects__radio');

var onUploadPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadPopup();
  }
};

var openUploadPopup = function () {
  uploadBlockPic.classList.remove('hidden');
  document.addEventListener('keydown', onUploadPopupEscPress);
};

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

  previewPic.style.transform = 'scale(' + defaultScaleValue/100 +')';
});

scaleMinus.addEventListener('click', function () {

  defaultScaleValue = defaultScaleValue - 25;
  if (defaultScaleValue < 25) {
    defaultScaleValue = 25;
  }
  scaleValue.value = defaultScaleValue + '%';

  previewPic.style.transform = 'scale(' + defaultScaleValue/100 +')';
});


// применение эффектов

for (var i = 0; i < effectsBtns.length; i++) {
  effectsBtns[i].addEventListener('click', function (evt) {
    var effectBtnId = evt.target.getAttribute('id');
    previewPic.removeAttribute('class');
    if (effectBtnId === 'effect-none') {
      previewPic.removeAttribute('class');
    } else if (effectBtnId === 'effect-chrome') {
      previewPic.classList.add('effects__preview--chrome');
    } else if (effectBtnId === 'effect-sepia') {
      previewPic.classList.add('effects__preview--sepia');
    } else if (effectBtnId === 'effect-marvin') {
      previewPic.classList.add('effects__preview--marvin');
    } else if (effectBtnId === 'effect-phobos') {
      previewPic.classList.add('effects__preview--phobos');
    } else if (effectBtnId === 'effect-heat') {
      previewPic.classList.add('effects__preview--heat');
    }
  })
};

// валидация хэштегов
var hashtagsInput = document.querySelector('.text__hashtags');

hashtagsInput.addEventListener('change', function (evt) {

  var arrHashtags = hashtagsInput.value.split(/[\s#]+/);
  arrHashtags.splice(0, 1);
  for (var i = 0; i < arrHashtags.length; i++) {
    
  }
  console.log(arrHashtags);
});





