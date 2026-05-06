document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".bannerSwiper", {
    loop: true,
    effect: "fade", // 기본은 부드러운 페이드
    fadeEffect: {
      crossFade: true, // 이미지가 자연스럽게 섞임
    },
    speed: 1200, // 전환 속도
    autoplay: {
      delay: 4000, // 자동 전환 주기
      disableOnInteraction: false, // 사용자가 넘겨도 자동 전환 유지
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // 손 스와이프 반응 강화
    simulateTouch: true,     // 마우스/터치로 드래그 가능
    grabCursor: true,        // 커서가 손모양으로 바뀜
    allowTouchMove: true,    // 손으로 넘길 수 있음
    touchRatio: 0.8,         // 터치 민감도 (1보다 낮으면 부드럽게)
    touchAngle: 45,          // 터치 허용 각도
    resistanceRatio: 0.7,    // 끝까지 당겼을 때의 저항감

    // 부드러운 이징 커브 추가 (자연스러운 감속)
    speed: 1200,
    on: {
      touchStart: function () {
        swiper.autoplay.stop(); // 사용자가 손대면 일시정지
      },
      touchEnd: function () {
        swiper.autoplay.start(); // 손을 떼면 다시 자동재생
      },
    },
  });
});
