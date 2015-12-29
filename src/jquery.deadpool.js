;(function ( $, window, document, undefined ) {

  "use strict";

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "deadPool",
    phrase,
    defaults = {
      action: "focus",
      delay: 200
    },
    tornadoPlaceholder = "!!!TORNADO!!!";

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.deadPoolAvatar = $('<div class="deadpool-wrapper"><img id="deadpool-cloud" /><img id="deadpool-avatar" src="https://pbs.twimg.com/profile_images/628761937778577408/MJV82jvR.png" id="deadpool-avatar" /><div id="deadpool-cloud-text"></div><div id="deadpool-poster-text"></div></div>');
    this.deadPoolAvatar.hide();
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      var _this = this;
      this.element.parents('form').submit(function (e) {
        //setTimeout(this.attachDeadPool, _this.settings.delay);
        _this.attachDeadPool();
        e.preventDefault();
      });

      $('body').append(this.deadPoolAvatar);
      //this.attachDeadPool();
    },
    attachDeadPool: function () {
      var deadPoolImg = this.deadPoolAvatar.find('#deadpool-avatar'),
        deadPoolCloud = this.deadPoolAvatar.find('#deadpool-cloud'),
        deadPoolCloudText = this.deadPoolAvatar.find('#deadpool-cloud-text'),
        deadPoolPosterText = this.deadPoolAvatar.find('#deadpool-poster-text'),
        item = this.moveFirst,
        _this = this;

      for (var i = 0; i < answers.length; i++) {
        item = answers[i];
        if (item.condition(this.element) && Math.random() < item.chance) {
          this.deadPoolAvatar.css(
            {
              "bottom": item.avatar.bottom,
              "left": this.element.offset()['left'] + item.avatar.left,
              "position": "fixed"
            }
          );
          deadPoolImg.attr('src', item.avatar.image);
          deadPoolCloud.attr('src', item.cloud.image);
          deadPoolCloud.css({
            "top": item.cloud.top,
            "left": item.cloud.left,
            "position": "absolute"
          });
          deadPoolCloudText.css({
            "top": item.cloud_text.top,
            "left": item.cloud_text.left,
            "position": "absolute",
            "padding": item.cloud_text.padding,
            "width": "550px"
          });
          deadPoolPosterText.css({
            "top": item.poster_text.top,
            "left": item.poster_text.left,
            "position": "absolute",
            "width": "250px"
          });
          this.deadPoolAvatar.show();
          if (item.poster_text.text.length > 0) {
            phrase = item.poster_text.text[Math.floor(Math.random()*item.poster_text.text.length)];
            deadPoolPosterText.text(phrase);
          }
          if (item.cloud_text.text.length > 0) {
            phrase = item.cloud_text.text[Math.floor(Math.random()*item.cloud_text.text.length)];
            var regex = new RegExp(tornadoPlaceholder, 'g');
            if (phrase.match(regex)) {
              deadPoolImg.attr('src', '../images/deadpool/12.png');
              deadPoolPosterText.html('<img src="../images/t_2.png" />');
              phrase = phrase.replace(tornadoPlaceholder, '');
            }
            deadPoolCloudText.text(phrase);
          }
          setTimeout(function () {_this.deadPoolAvatar.hide()}, item.length);
          break;
        }
      }
    }
  });

  var answers = [
    {
      "condition": function (element) {
        return element.val().match(/(\!\!\!\!)+/gi);
      },
      "avatar": {
        "image": "../images/deadpool/12.png",
        "bottom": "-2px",
        "left": 200
      },
      "cloud": {
        "image": "../images/cloud/say_2.png",
        "top": "225px",
        "left": "-400px"
      },
      "cloud_text": {
        "text": [
          "Больше восклицательных знаков. И запятые не забудь. Вернусь - проверю.",
          "Какая экспрессия! Я тебе запятых еще подвёз",
          "Не ори на меня! Запятые расставь. Вот они — пользуйся.",
          "Столько восклицательных знаков — это от передозировки Tornado."
        ],
        "top": "267px",
        "left": "-400px",
        "padding": "20px 40px"
      },
      "poster_text": {
        "text": [
          ",,,,,,,,,,,,,,,,,"
        ],
        "top": "50px",
        "left": "400px"
      },
      "weight": 0,
      "chance": 1,
      "length": 50000,

    },
    {
      "condition": function (element) {
        return element.val().match(/(\!\!\!\!)+/gi);
      },
      "avatar": {
        "image": "../images/deadpool/12.png",
        "bottom": "-2px",
        "left": 200
      },
      "cloud": {
        "image": "../images/cloud/say_2.png",
        "top": "225px",
        "left": "-400px"
      },
      "cloud_text": {
        "text": [
          //"Больше восклицательных знаков. И запятые не забудь. Вернусь - проверю.",
          //"Какая экспрессия! Я тебе запятых еще подвёз",
          //"Не ори на меня! Запятые расставь. Вот они — пользуйся.",
          tornadoPlaceholder + "Столько восклицательных знаков — это от передозировки Tornado."
        ],
        "top": "267px",
        "left": "-400px",
        "padding": "20px 40px"
      },
      "poster_text": {
        "text": [
          ",,,,,,,,,,,,,,,,,"
        ],
        "top": "50px",
        "left": "400px"
      },
      "weight": 0,
      "chance": 1,
      "length": 50000
    }
  ];

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };

})( jQuery, window, document );
