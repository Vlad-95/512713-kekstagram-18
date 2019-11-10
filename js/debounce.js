'use strict';
(function () {
  /*
  * Функция для отложенного выполнения скрипта
  */
  var DEBOUNCE_INTERVAL = 500;

  var debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.timer = {
    debounce: debounce
  };
})();
