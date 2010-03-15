(function($) {
  
  
  $.html5 = function() {
  }
  
  $.html5.supportsOffline = function() {
    return !!window.applicationCache && !!window.openDatabase;
  }
  
  $.html5.supportsLocalStorage = function() {
    return !!window.localStorage;
  }


})(jQuery);