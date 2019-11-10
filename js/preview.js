'use strict';

(function () {
  var COMMENT_QOUNT = 5;
  var bigPic = document.querySelector('.big-picture');
  var bigPicClose = document.querySelector('.big-picture__cancel');

  /*
   * Функция нажатия на кнопку ESC
   * @param evt - Объект Event
   */
  var onPreviewEscPress = function (evt) {
    // проверка на клавишу esc и фокус в инпуте хэштегов
    window.util.isEscEvent(evt, closePreviewPopup);
  };

  /*
   * Функция открытия окна просмотра фото
   */
  var openPreviewPopup = function () {
    bigPic.classList.remove('hidden');

    document.addEventListener('keydown', onPreviewEscPress);
  };

  /*
   * Функция закрытия окна просмотра фото
   */
  var closePreviewPopup = function () {
    bigPic.classList.add('hidden');
    COMMENT_QOUNT = 5;
    document.removeEventListener('keydown', onPreviewEscPress);
  };

  // закрытие окна просмотра
  bigPicClose.addEventListener('click', function () {
    closePreviewPopup();
  });

  // закрытие окна просмотра по клаве
  bigPicClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePreviewPopup);
  });

  // Обращаемся к блоку с комментариями
  var bigPicComments = document.querySelector('.big-picture .social__comments');
  // Обращаемся к шаблону комментария
  var bigPicCommentTemplate = document.querySelector('.big-picture .social__comment');
  // Обращаемся к кнопке подгрузки комментариев
  var bigPicCommentLoad = document.querySelector('.comments-loader');

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
    commentElement.querySelector('.social__text').textContent = comment['message'];

    return commentElement;
  };

  /*
  * Функция открытия превью фотографии
  */
  var clickHandler = function (evt) {
    openPreviewPopup();
    var clickedElement = evt.target;
    var commentVisible = 5;
    var index = clickedElement.parentNode.getAttribute('data-index');

    if (clickedElement.classList.contains('picture__img')) {
      // Устанавливаем атрибут src
      document.querySelector('.big-picture__img img').setAttribute('src', clickedElement.src);
      // Выводим количество лайков
      document.querySelector('.big-picture .likes-count').textContent = window.util.picturesArr[index]['likes'];
      // Выводим описание фотографии
      document.querySelector('.big-picture .social__caption').textContent = window.util.picturesArr[index]['description'];

      var fragmentComment = document.createDocumentFragment();

      // в фрагмент записываем 5 сгенерированных комментариев
      for (var a = 0; a < commentVisible; a++) {
        fragmentComment.appendChild(renderComments(window.util.picturesArr[index]['comments'][a]));
      }

      bigPicComments.innerHTML = '';

      // добавляем в блок с комментариями созданый фрагмент
      bigPicComments.appendChild(fragmentComment);

      // показываем кнопку подгрузки комментов, если их больше 5
      if (window.util.picturesArr[index]['comments'].length > COMMENT_QOUNT) {
        bigPicCommentLoad.classList.remove('visually-hidden');
      }

      bigPicCommentLoad.addEventListener('click', function () {
        var commentStep = 5;

        for (var b = commentVisible; b < commentVisible + commentStep; b++) {

          if (window.util.picturesArr[index]['comments'].length > commentVisible) {
            fragmentComment.appendChild(renderComments(window.util.picturesArr[index]['comments'][b]));
          }
        }
        commentVisible += commentStep;

        bigPicComments.appendChild(fragmentComment);

      });

    } else {
      bigPic.classList.add('hidden');
    }
  };

  // ловим клик на всем блоке с картинками
  window.util.photosBlock.addEventListener('click', clickHandler);
})();
