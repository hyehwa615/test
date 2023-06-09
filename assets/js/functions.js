$(document).ready(function () {

  var canScroll = true, // 스크롤 가능 여부를 나타내는 변수.
    scrollController = null;

  // 마우스 휠 스크롤 이벤트 및 DOM 마우스 스크롤 이벤트 핸들러 등록.
  $(this).on('mousewheel DOMMouseScroll', function (e) {
    if (!($('.outer-nav').hasClass('is-vis'))) { // outer-nav 요소에 is-vis 클래스가 없는 경우에만 실행.

      e.preventDefault(); // 기본 스크롤 이벤트 방지.

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20; // 스크롤 방향 및 거리를 계산.

      if (delta > 50 && canScroll) { // 스크롤 방향이 위쪽인 경우.
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800); // 800ms 동안 스크롤 잠금 설정 후 다시 스크롤 가능 상태로 변경.
        updateHelper(1); // 스크롤 도우미 함수 호출하여 내용 업데이트.
      } else if (delta < -50 && canScroll) { // 스크롤 방향이 아래쪽인 경우.
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800); // 800ms 동안 스크롤 잠금 설정 후 다시 스크롤 가능 상태로 변경.
        updateHelper(-1); // 스크롤 도우미 함수 호출하여 내용 업데이트.
      }

    }

  });

  // 사이드 네비게이션 및 아우터 네비게이션의 항목 클릭 이벤트 핸들러 등록.
  $('.side-nav li, .outer-nav li').click(function () {

    if (!($(this).hasClass('is-active'))) { // 클릭한 항목이 현재 활성화된 항목이 아닌 경우에만 실행.

      var $this = $(this),
        curActive = $this.parent().find('.is-active'), // 현재 활성화된 항목.
        curPos = $this.parent().children().index(curActive), // 현재 활성화된 항목의 인덱스.
        nextPos = $this.parent().children().index($this), // 클릭한 항목의 인덱스.
        lastItem = $(this).parent().children().length - 1; // 마지막 항목의 인덱스.

      updateNavs(nextPos); // 네비게이션 업데이트.
      updateContent(curPos, nextPos, lastItem); // 컨텐츠 업데이트.

    }

  });
  // CTA(호출 행동) 클릭 이벤트 핸들러 등록.
  $('.cta').click(function () {

    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = lastItem;

    updateNavs(lastItem);
    updateContent(curPos, nextPos, lastItem);

  });


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

  // 스크롤, 스와이프 및 화살표 키 방향 결정.
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

  // 사이드 및 아우터 내비게이션 동기화.
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  // 메인 콘텐츠 영역 업데이트.
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


  // 외부 네비게이션 설정.
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

  // 작업 슬라이더 설정.
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

        // 다음 버튼 클릭 시,
        if ($this.hasClass('slider--next')) {
          if (curLeftPos < totalWorks - 1 && curCenterPos < totalWorks - 1 && curRightPos < totalWorks - 1) {
            $left.removeClass('slider--item-left').next().addClass('slider--item-left');
            $center.removeClass('slider--item-center').next().addClass('slider--item-center');
            $right.removeClass('slider--item-right').next().addClass('slider--item-right');
          } else { // 슬라이더의 마지막 요소일 경우.
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
        } else { // 이전 버튼 클릭 시,
          if (curLeftPos !== 0 && curCenterPos !== 0 && curRightPos !== 0) {
            $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
            $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
            $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
          } else { // 슬라이더의 첫 번째 요소일 경우.
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

      // correct mobile device window position
      window.scrollTo(0, 0);

    });

  }

  outerNav();
  workSlider();
  transitionLabels();

});
