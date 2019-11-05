'use strict';

(function () {
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

  var clickHandler = function (evt) {
    openPreviewPopup();
    var clickedElement = evt.target;

    var index = clickedElement.parentNode.getAttribute('data-index');

    if (clickedElement.classList.contains('picture__img')) {
      // Устанавливаем атрибут src
      document.querySelector('.big-picture__img img').setAttribute('src', window.util.picturesArr[index]['url']);
      // Выводим количество лайков
      document.querySelector('.big-picture .likes-count').textContent = window.util.picturesArr[index]['likes'];
      // Выводим описание фотографии
      document.querySelector('.big-picture .social__caption').textContent = window.util.picturesArr[index]['description'];

      var fragmentComment = document.createDocumentFragment();

      // в фрагмент записываем все сгенерированные комментарии
      for (var a = 0; a < 5; a++) {
        fragmentComment.appendChild(renderComments(window.util.picturesArr[index]['comments'][a]));
      }

      bigPicComments.innerHTML = '';

      // добавляем в блок с комментариями созданый фрагмент
      bigPicComments.appendChild(fragmentComment);
    } else {
      bigPic.classList.add('hidden');
    }
  };

  // ловим клик на всем блоке с картинками
  window.util.photosBlock.addEventListener('click', clickHandler);
})();
