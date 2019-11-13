'use strict';

(function () {
  var COMMENT_QOUNT = 5; // количество выводимых комментов
  var bigPic = document.querySelector('.big-picture'); // блок с превью
  var bigPicClose = document.querySelector('.big-picture__cancel'); // кнопка закрытия превью
  var bigPicComments = document.querySelector('.big-picture .social__comments'); // Обращаемся к блоку с комментариями
  var bigPicCommentTemplate = document.querySelector('.big-picture .social__comment'); // Обращаемся к шаблону комментария
  var bigPicCommentLoad = document.querySelector('.comments-loader'); // Обращаемся к кнопке подгрузки комментариев
  var fragmentComment = document.createDocumentFragment(); // создаем фрагмент для комментария

  /*
  * Функция нажатия на кнопку ESC
  *
  * @param evt - Объект Event
  */
  var previewEscPressHandler = function (evt) {

    window.util.isEscEvent(evt, closePreviewPopup);
  };

  /*
  * Функция открытия окна просмотра фото
  */
  var openPreviewPopup = function () {
    bigPic.classList.remove('hidden');

    document.addEventListener('keydown', previewEscPressHandler);
  };

  /*
  * Функция закрытия окна просмотра фото
  */
  var closePreviewPopup = function () {
    bigPic.classList.add('hidden');

    document.removeEventListener('keydown', previewEscPressHandler);
  };

  // закрытие окна превью
  bigPicClose.addEventListener('click', function () {
    closePreviewPopup();
  });

  // закрытие окна превью по клаве
  bigPicClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePreviewPopup);
  });

  /*
  * Функция возврщает сгенерированный комментарий
  *
  * @param comment - комментарий
  *
  * @return commentItem - генерированный комментарий
  */
  var renderComments = function (comment) {
    var commentItem = bigPicCommentTemplate.cloneNode(true);

    commentItem.querySelector('.social__picture').setAttribute('src', comment['avatar']);
    commentItem.querySelector('.social__picture').setAttribute('alt', comment['name']);
    commentItem.querySelector('.social__text').textContent = comment['message'];

    return commentItem;
  };

  /*
  * Функция открытия превью фотографии
  */
  var clickHandler = function (evt) {
    openPreviewPopup();

    // возвращаем исходное значение количества выводимых комментов
    COMMENT_QOUNT = 5;
    var clickedItem = evt.target;
    var index = clickedItem.parentNode.getAttribute('data-index');

    // устанавливаем аттрибут на превью, содержащий индекс
    bigPic.querySelector('.big-picture__preview').setAttribute('data-index', index);

    if (clickedItem.classList.contains('picture__img')) {
      // Устанавливаем атрибут src
      document.querySelector('.big-picture__img img').setAttribute('src', clickedItem.src);
      // Выводим количество лайков
      document.querySelector('.big-picture .likes-count').textContent = window.util.picturesArr[index]['likes'];
      // Выводим описание фотографии
      document.querySelector('.big-picture .social__caption').textContent = window.util.picturesArr[index]['description'];

      // в фрагмент записываем 5 сгенерированных комментариев
      for (var a = 0; a < COMMENT_QOUNT; a++) {
        fragmentComment.appendChild(renderComments(window.util.picturesArr[index]['comments'][a]));
      }

      bigPicComments.innerHTML = '';

      // добавляем в блок с комментариями созданый фрагмент
      bigPicComments.appendChild(fragmentComment);

      // показываем кнопку подгрузки комментов, если их больше 5
      if (window.util.picturesArr[index]['comments'].length > COMMENT_QOUNT) {
        bigPicCommentLoad.classList.remove('visually-hidden');
      }

    } else {
      bigPic.classList.add('hidden');
    }
  };

  // ловим клик на всем блоке с картинками
  window.util.photosBlock.addEventListener('click', clickHandler);


  /*
  * Функция показа остальных комментариев по клику на кнопку
  */
  var commentLoadClickHandler = function () {

    // получаем индекс картинки по которой кликнули
    var index = bigPic.querySelector('.big-picture__preview').getAttribute('data-index');

    // задаем шаг, показа комментариев
    var commentStep = 5;

    for (var b = COMMENT_QOUNT; b <= COMMENT_QOUNT + commentStep; b++) {

      // проверяем существуют ли комментарии в массиве на каждой итерации
      if (window.util.picturesArr[index]['comments'][b]) {
        fragmentComment.appendChild(renderComments(window.util.picturesArr[index]['comments'][b]));
        bigPicComments.appendChild(fragmentComment);
      } else {
        // прячем кнопку, если показаны все комментарии
        bigPicCommentLoad.classList.add('visually-hidden');
      }
    }

    // увеличиваем значение показаных комментов при каждом клике
    COMMENT_QOUNT += commentStep;
  };

  // вешаем листенер на кнопку подгрузки комментариев
  bigPicCommentLoad.addEventListener('click', commentLoadClickHandler);
})();
