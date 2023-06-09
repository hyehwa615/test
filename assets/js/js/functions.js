$(document).ready(function () {

  // 마우스 휠 이벤트.
  var canScroll = true,
    scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function (e) {

    if (!($('.outer-nav').hasClass('is-vis'))) {

      e.preventDefault();

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(1);
      } else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }

    }

  });

  $('.side-nav li, .outer-nav li').click(function () {

    if (!($(this).hasClass('is-active'))) {

      var $this = $(this),
        curActive = $this.parent().find('.is-active'),
        curPos = $this.parent().children().index(curActive),
        nextPos = $this.parent().children().index($this),
        lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);

    }

  });

  $('.cta').click(function () {

    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = lastItem;

    updateNavs(lastItem);
    updateContent(curPos, nextPos, lastItem);

  });

  // 터치 기기를 위한 스와이프 지원.
  var targetElement = document.getElementById('viewport'),
    mc = new Hammer(targetElement);
  mc.get('swipe').set({
    direction: Hammer.DIRECTION_VERTICAL
  });
  mc.on('swipeup swipedown', function (e) {

    updateHelper(e);

  });

  $(document).keyup(function (e) {

    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      updateHelper(e);
    }

  });



  /* 사용자의 입력에 따라 페이지를 스크롤하거나 전환하기 위해
  스크롤 이벤트, 마우스 스와이프 이벤트, 클릭 이벤트, 터치 스와이프 이벤트, 키보드 화살표 키 이벤트를 처리하는 로직을 포함하고 있음. */
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    } else if (param.type === "swipedown" || param.keyCode === 38 || param < 0) {
      if (curPos !== 0) {
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }

  }

  /* 사이드 네비게이션과 외부 네비게이션의 동기화.
  이 코드는 사용자가 사이드 네비게이션 또는 외부 네비게이션을 클릭할 때 해당 항목을 활성화하고, 다른 네비게이션에도 동일한 활성화 상태를 적용하는 역할을 함. */
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  /* 메인 콘텐츠 영역을 업데이트하는 것을 설명하고 있음.
  이 코드는 사용자가 사이드 네비게이션 또는 외부 네비게이션에서 새로운 항목을 선택할 때, 메인 콘텐츠 영역을 해당 항목의 내용으로 업데이트하는 역할을 함. */
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    } else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    } else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    } else {
      $('.header--cta').removeClass('is-active');
    }

  }

  function outerNav() {

    $('.header--nav-toggle').click(function () {

      $('.perspective').addClass('perspective--modalview');
      setTimeout(function () {
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');

    });

    $('.outer-nav--return, .outer-nav li').click(function () {

      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function () {
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');

    });

  }

  function workSlider() {

    $('.slider--prev, .slider--next').click(function () {

      var $this = $(this),
        curLeft = $('.slider').find('.slider--item-left'),
        curLeftPos = $('.slider').children().index(curLeft),
        curCenter = $('.slider').find('.slider--item-center'),
        curCenterPos = $('.slider').children().index(curCenter),
        curRight = $('.slider').find('.slider--item-right'),
        curRightPos = $('.slider').children().index(curRight),
        totalWorks = $('.slider').children().length,
        $left = $('.slider--item-left'),
        $center = $('.slider--item-center'),
        $right = $('.slider--item-right'),
        $item = $('.slider--item');

      $('.slider').animate({
        opacity: 0
      }, 400);

      setTimeout(function () {

        if ($this.hasClass('slider--next')) {
          if (curLeftPos < totalWorks - 1 && curCenterPos < totalWorks - 1 && curRightPos < totalWorks - 1) {
            $left.removeClass('slider--item-left').next().addClass('slider--item-left');
            $center.removeClass('slider--item-center').next().addClass('slider--item-center');
            $right.removeClass('slider--item-right').next().addClass('slider--item-right');
          } else {
            if (curLeftPos === totalWorks - 1) {
              $item.removeClass('slider--item-left').first().addClass('slider--item-left');
              $center.removeClass('slider--item-center').next().addClass('slider--item-center');
              $right.removeClass('slider--item-right').next().addClass('slider--item-right');
            } else if (curCenterPos === totalWorks - 1) {
              $left.removeClass('slider--item-left').next().addClass('slider--item-left');
              $item.removeClass('slider--item-center').first().addClass('slider--item-center');
              $right.removeClass('slider--item-right').next().addClass('slider--item-right');
            } else {
              $left.removeClass('slider--item-left').next().addClass('slider--item-left');
              $center.removeClass('slider--item-center').next().addClass('slider--item-center');
              $item.removeClass('slider--item-right').first().addClass('slider--item-right');
            }
          }
        } else {
          if (curLeftPos !== 0 && curCenterPos !== 0 && curRightPos !== 0) {
            $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
            $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
            $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
          } else {
            if (curLeftPos === 0) {
              $item.removeClass('slider--item-left').last().addClass('slider--item-left');
              $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
              $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
            } else if (curCenterPos === 0) {
              $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
              $item.removeClass('slider--item-center').last().addClass('slider--item-center');
              $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
            } else {
              $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
              $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
              $item.removeClass('slider--item-right').last().addClass('slider--item-right');
            }
          }
        }

      }, 400);

      $('.slider').animate({
        opacity: 1
      }, 400);

    });

  }

  function transitionLabels() {

    $('.work-request--information input').focusout(function () {

      var textVal = $(this).val();

      if (textVal === "") {
        $(this).removeClass('has-value');
      } else {
        $(this).addClass('has-value');
      }

      // 모바일 기기에서 창(window) 위치를 올바르게 조정.
      window.scrollTo(0, 0);

    });

  }

  outerNav();
  workSlider();
  transitionLabels();

});
