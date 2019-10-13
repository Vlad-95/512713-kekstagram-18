'use strict';

(function () {
  var bigPic = document.querySelector('.big-picture');
  var bigPicClose = document.querySelector('.big-picture__cancel');
  var photoItems = document.querySelectorAll('.picture');

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
    commentElement.querySelector('.social__text').textContent = comment['text'];

    return commentElement;
  };

   var clickHandler = function (evt) {
    openPreviewPopup();
    var clickedElement = evt.currentTarget;
    var index = clickedElement.getAttribute('data-index');

    // Устанавливаем атрибут src из первого элемента массива с картинками
    document.querySelector('.big-picture__img img').setAttribute('src', 'photos/' + window.util.pictures[index]['url'] + '.jpg');
    // Выводим количество лайков из первого элемента массива с картинками
    document.querySelector('.big-picture .likes-count').textContent = window.util.pictures[index]['likes'];
    // Выводим описание фотографии из первого элемента массива с картинками
    document.querySelector('.big-picture .social__caption').textContent = window.util.pictures[index]['description'];

    var fragmentComment = document.createDocumentFragment();

    // в фрагмент записываем все сгенерированные комментарии
    for (var a = 0; a < 2; a++) {
      fragmentComment.appendChild(renderComments(window.util.pictures[index]['comments'][a]));
    }

    bigPicComments.innerHTML = '';

    // добавляем в блок с комментариями созданый фрагмент
    bigPicComments.appendChild(fragmentComment);
  };

  for (var n = 0; n < window.data.QUANTITY_PHOTOS; n++) {
    photoItems[n].addEventListener('click', clickHandler);
  }
})();
