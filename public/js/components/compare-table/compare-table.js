"use strict";

(function () {
  $(document).ready(function ($) {
    compareTableFixHeight();
    compareTableParametersMove();
  });

  var owl = $('.compare-products-slider');
  owl.owlCarousel({
    nav: true,
    navText: true,
    dots: true,
    items: 3,
    responsive: {
      0: {
        items: 1
      },
      1024: {
        items: 2
      },
      1440: {
        items: 3
      }
    }
  });

  function compareTableParametersMove() {
    $(".compare-table").find(".compare-table-aside-parameters").css("top", $(".compare-table-body").find(".product-item-title").css("height"));
  }

  function compareTableFixHeight() {
    var product_item = $(".compare-table-body .product-item"),
        temp_height,
        max_height_title = 0,
        amount_elements = 0,
        arr = [];

    //подсчитаем количество блоков с характеристиками
    $(".compare-table-aside-parameters").find(".compare-table-aside-parameters__parameter-name").each(function () {
      amount_elements++;
      arr.push(parseFloat($(this).css("height")));
    });

    //узнаем высоту наибольшего заголовка среди всех блоков с товарами
    $(".compare-table-body").find(".product-item").each(function () {
      var i = 0;

      temp_height = $(this).find(".product-item-title").css("height");
      if (parseFloat(temp_height) > max_height_title) {
        max_height_title = parseFloat(temp_height);
      }

      $(this).find(".product-item-info-block").each(function () {
        temp_height = $(this).css("height");
        if (parseFloat(temp_height) > arr[i]) {
          arr[i] = parseFloat(temp_height);
        }
        i++;
      });
    });

    //итоговый обход, присваиваем значения слайдеру
    $(".compare-table-body").find(".product-item").each(function () {
      var i = 0;
      $(this).find(".product-item-title").css("height", max_height_title);
      $(this).find(".product-item-info-block").each(function () {
        $(this).css("height", arr[i]);
        i++;
      });
    });

    var j = 0;
    $(".compare-table-aside-parameters").find(".compare-table-aside-parameters__parameter-name").each(function () {
      $(this).css("height", arr[j]);
      j++;
    });
  }
})();