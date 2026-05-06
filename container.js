//-----------------------------------------------------//


/*  1.무한 롤링 텍스트  */
document.addEventListener("DOMContentLoaded", () => {
  const scrollInner = document.querySelector(".scroll-inner");
  const listHTML = scrollInner.innerHTML;
  scrollInner.innerHTML += listHTML + listHTML; // 복제 2회 (끊김 방지)

  let position = 0;
  let speed = window.innerWidth <= 768 ? 0.2 : 0.4; // 모바일/PC 속도 분리
  let contentWidth;

  // 리스트 길이 계산 함수
  const calcWidth = () => {
    contentWidth = scrollInner.scrollWidth / 3; // 원본 리스트 길이 기준
  };

  calcWidth(); // 최초 1회 실행

  function scrollLoop() {
    position -= speed;
    if (Math.abs(position) >= contentWidth) {
      position = 0; // 한 바퀴 돌면 부드럽게 0으로 복귀
    }
    scrollInner.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(scrollLoop);
  }

  // 창 크기 변경 시에도 재계산 (모바일↔PC 전환 대응)
  window.addEventListener("resize", () => {
    calcWidth();
    speed = window.innerWidth <= 768 ? 0.2 : 0.4;
  });

  scrollLoop();
});


//-----------------------------------------------------//


/*  2.Refresh Your Life  */
document.addEventListener("DOMContentLoaded", () => {

  /* 1) Canvas 기반 리얼 물결 애니메이션  */
  function initRipple(card) {
    const img = card.querySelector("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    card.style.position = "relative";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";

    card.appendChild(canvas);

    function resize() {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      let t = Date.now() * 0.002;

      ctx.clearRect(0, 0, w, h);

      // 확대·축소 + 흔들림
      const scale = 1 + Math.sin(t * 0.8) * 0.04;
      const dx = Math.sin(t * 1.5) * 20;
      const dy = Math.cos(t * 1.2) * 14;

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2, -h / 2);
      ctx.drawImage(img, dx, dy, w, h);
      ctx.restore();

      // 물결 굴절
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let y = 0; y < h; y++) {
        const shift = Math.sin(y * 0.06 + Date.now() * 0.004) * 2;
        const row = y * w * 4;

        for (let x = row + (w - 1) * 4; x >= row; x -= 4) {
          const nx = x + shift * 4;
          if (nx >= row && nx < row + w * 4) {
            data[x] = data[nx];
            data[x + 1] = data[nx + 1];
            data[x + 2] = data[nx + 2];
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      requestAnimationFrame(draw);
    }

    draw();
  }

  document.querySelectorAll(".card").forEach(card => {
    initRipple(card);
  });



  /* 2) SVG Noise 물결 애니메이션  */
  const noise = document.querySelector("#waveNoise");
  let t = 0;

  if (noise) {
    function animateWave() {
      t += 0.003;
      const freqX = 0.015 + Math.sin(t * 1.2) * 0.005;
      const freqY = 0.03 + Math.cos(t * 1.0) * 0.007;
      noise.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      requestAnimationFrame(animateWave);
    }
    animateWave();
  }



  /* 3) Ripple Circle */
  document.querySelectorAll(".ripple-effect").forEach((container) => {
    container.addEventListener("mousemove", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple-circle");

      const rect = container.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      container.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* 4) 진동 + 사운드 효과 */
  const vibrationSound = new Audio("../resource/img/section--refresh/vibration.mov");
  vibrationSound.volume = 1.0;

  let soundAllowed = false;

  document.addEventListener("click", () => {
    if (!soundAllowed) {
      vibrationSound.play().catch(()=>{});
      soundAllowed = true;
    }
  }, { once: true });

  document.querySelectorAll(".vibration-btn").forEach((img) => {
    img.addEventListener("click", () => {

      if (soundAllowed) {
        vibrationSound.currentTime = 0;
        vibrationSound.play().catch(()=>{});
      }

      if (navigator.vibrate) {
        navigator.vibrate(80);
      }

    });
  });

});


//-----------------------------------------------------//


/* 5.Shaping a Healthier Rhythm */
document.addEventListener("DOMContentLoaded", () => {

  const wrap = document.querySelector(".rhythm__wrap");

  function isTablet() {
    return window.innerWidth <= 1024 && window.innerWidth >= 768;
  }
  function isMobile() {
    return window.innerWidth < 768;
  }

  function initSlider() {

    if (!(isTablet() || isMobile())) return;
    if (wrap.classList.contains("slider-applied")) return;
    wrap.classList.add("slider-applied");

    const cards = [...document.querySelectorAll(".rhythm__card")];
    const total = cards.length;

    /* 트랙 생성 & 클론 추가 */
    const track = document.createElement("div");
    track.classList.add("rhythm__slider-track");

    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[total - 1].cloneNode(true);

    track.appendChild(lastClone);
    cards.forEach(c => track.appendChild(c));
    track.appendChild(firstClone);

    wrap.innerHTML = "";
    wrap.appendChild(track);

    let index = 1;

    /* ★ 카드 width % 통일 */
    let cardWidthPercent = isTablet() ? 45 : 80; // Tablet 45%, Mobile 80%

    let position = -(cardWidthPercent * index);
    track.style.transform = `translateX(${position}%)`;

    /* pagination */
    const pagination = document.createElement("div");
    pagination.classList.add("rhythm__pagination");
    pagination.innerText = `1 / ${total}`;
    wrap.appendChild(pagination);

    function updatePagination() {
      let displayIndex = index - 1;
      if (index === 0) displayIndex = total - 1;
      if (index === total + 1) displayIndex = 0;
      pagination.innerText = `${displayIndex + 1} / ${total}`;
    }

    /* 이동 함수 */
    function moveSlide(step) {
      index += step;
      track.style.transition = "transform 0.4s ease";
      position = -(index * cardWidthPercent);
      track.style.transform = `translateX(${position}%)`;
      updatePagination();

      setTimeout(() => {
        if (index === 0) {
          track.style.transition = "none";
          index = total;
          position = -(index * cardWidthPercent);
          track.style.transform = `translateX(${position}%)`;
        }
        if (index === total + 1) {
          track.style.transition = "none";
          index = 1;
          position = -(index * cardWidthPercent);
          track.style.transform = `translateX(${position}%)`;
        }
      }, 400);
    }

    /* arrows */
    const arrows = document.createElement("div");
    arrows.classList.add("rhythm__arrows");
    arrows.innerHTML = `
        <span class="rhythm-arrow prev">←</span>
        <span class="rhythm-arrow next">→</span>
    `;
    wrap.parentElement.insertBefore(arrows, wrap);

    arrows.querySelector(".prev").addEventListener("click", () => moveSlide(-1));
    arrows.querySelector(".next").addEventListener("click", () => moveSlide(1));

    /* 스와이프 */
    let startX = 0;

    track.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;

      if (endX - startX < -40) moveSlide(1);
      if (endX - startX > 40) moveSlide(-1);
    });

    updatePagination();
  }

  initSlider();
  window.addEventListener("resize", () => location.reload());
});


//-----------------------------------------------------//


/* 6.Products */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".products-track");
  const slides = document.querySelectorAll(".products-slide");
  const nextBtns = document.querySelectorAll(".products-arrow.next");
  const prevBtns = document.querySelectorAll(".products-arrow.prev");

  let index = 0;
  const max = slides.length - 1;

  function moveSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (index < max) index++;
      moveSlide();
    })
  );

  prevBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (index > 0) index--;
      moveSlide();
    })
  );
});

document.addEventListener("DOMContentLoaded", () => {

  if (window.innerWidth > 767) return;

  const slide = document.querySelector(".products-slide");
  const sliderWrapper = document.querySelector(".products-track");
  const imageCards = slide.querySelectorAll(".product-card");
  const info = slide.querySelector(".products-info");
  const prev = document.querySelector(".products-arrow.prev");
  const next = document.querySelector(".products-arrow.next");

  let current = 0;
  const total = imageCards.length;

  function initLayout() {

    // track 생성 (이미지만 가로 슬라이드)
    const track = document.createElement("div");
    track.classList.add("products-slide-track");
    track.style.display = "flex";
    track.style.flexDirection = "row";
    track.style.width = `${100 * total}%`;
    track.style.transition = "transform 0.4s ease";

    // 이미지 카드만 track으로 옮기기
    imageCards.forEach(card => {
      card.style.minWidth = "100%";
      card.style.flexShrink = "0";
      track.appendChild(card);
    });

    // 기존 products-slide 안에 info는 남겨두고 track만 맨 위로 삽입
    slide.insertBefore(track, info);

    return track;
  }

  const track = initLayout();

  // 슬라이드 이동
  function moveSlide() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  // 버튼 이벤트
  next.addEventListener("click", () => {
    current = (current + 1) % total;
    moveSlide();
  });

  prev.addEventListener("click", () => {
    current = (current - 1 + total) % total;
    moveSlide();
  });

});


//-----------------------------------------------------//



/* 8.Event Zone */
document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".event-track");
  const originalCards = Array.from(document.querySelectorAll(".event-card"));
  const dots = document.querySelectorAll(".dot");

  let index = 2;  // 첫 가운데 카드
  let startX = 0;
  let isDragging = false;

  /* -----------------------------
        depth 적용 함수
  ----------------------------- */
  function applyDepth(cards) {
    cards.forEach(card => {
      card.classList.remove("depth-0", "depth-1", "depth-2");
    });

    // 중앙(2)
    cards[2].classList.add("depth-0");

    // 양옆 (1, 3)
    if (cards[1]) cards[1].classList.add("depth-1");
    if (cards[3]) cards[3].classList.add("depth-1");

    // 바깥 (0, 4)
    if (cards[0]) cards[0].classList.add("depth-2");
    if (cards[4]) cards[4].classList.add("depth-2");
  }

  /* -----------------------------
        카드 재배열
  ----------------------------- */
  function renderSlider() {
    const newOrder = [];

    for (let i = 0; i < originalCards.length; i++) {
      let newIndex =
        (index + i - 2 + originalCards.length) % originalCards.length;
      newOrder.push(originalCards[newIndex]);
    }

    // 트랙 재구성
    track.innerHTML = "";
    newOrder.forEach(card => track.appendChild(card));

    // depth 적용
    applyDepth(newOrder);

    // dot 업데이트
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  /* -----------------------------
        부드러운 슬라이드
  ----------------------------- */
  function smoothSlide(direction) {
    track.style.transition = "transform 0.35s ease";
    track.style.transform = `translateX(${direction * -120}px)`;  

    setTimeout(() => {
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      renderSlider();
    }, 350);
  }

  /* -----------------------------
        DOT 클릭
  ----------------------------- */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const direction = i > index ? 1 : -1;
      index = i;
      smoothSlide(direction);
    });
  });

  /* -----------------------------
        드래그/터치
  ----------------------------- */
  function start(e) {
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
  }

  function end(e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX;

    if (diff < -30) {
      index = (index + 1) % originalCards.length;
      smoothSlide(1);
    } else if (diff > 30) {
      index = (index - 1 + originalCards.length) % originalCards.length;
      smoothSlide(-1);
    }
  }

  track.addEventListener("touchstart", start);
  track.addEventListener("touchend", end);
  track.addEventListener("mousedown", start);
  track.addEventListener("mouseup", end);

  /* 초기 실행 */
  renderSlider();
});


//-----------------------------------------------------//


/* 9.Latest News & Stories */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".news-track");
  const cards = document.querySelectorAll(".news-card");

  const prevBtn = document.querySelector(".news-prev");
  const nextBtn = document.querySelector(".news-next");

  const currentEl = document.getElementById("news-current");
  const totalEl = document.getElementById("news-total");

  let currentIndex = 0;
  let resizeTimer;

  /* PC: 화면 크기에 따라 4개 또는 3개 자동 선택 */
  function getPcVisibleCount() {
    const trackWidth = track.clientWidth;         // 전체 영역 폭
    const cardWidth = cards[0].offsetWidth;       // 카드 실제 폭
    const gap = 30;

    const need4 = (cardWidth * 4) + (gap * 3);    // 4개가 필요로 하는 최소 폭

    return trackWidth >= need4 ? 4 : 3;           // 4개 or 3개
  }

  /* 기기별 보여줄 카드 개수 */
  function getVisibleCount() {
    const width = window.innerWidth;

    if (width <= 767) return 1;    // 모바일
    if (width <= 1024) return 2;   // 태블릿

    return getPcVisibleCount();    // PC → 4 또는 3
  }

  /* PC일 때 가운데정렬 / 왼쪽정렬 + margin 34px */
  function updateAlignment() {
    const width = window.innerWidth;

    if (width > 1024) {
      const pcCount = getPcVisibleCount();

      if (pcCount === 4) {
        // PC 넓음 → 4개 → 가운데 정렬
        track.style.justifyContent = "center";
        track.style.marginLeft = "0";
      } else {
        // PC 좁아짐 → 3개 → 왼쪽 정렬 + margin-left 20px
        track.style.justifyContent = "flex-start";
        track.style.marginLeft = "34px";
      }

    } else {
      // Tablet, Mobile은 기존대로
      track.style.justifyContent = "flex-start";
      track.style.marginLeft = "0";
    }
  }

  /* 이동 거리 계산 */
  function getMoveDistance() {
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap || 0);
    return cards[0].offsetWidth + gap;
  }

  /* 총 페이지 업데이트 */
  function updateTotalPages() {
    const visible = getVisibleCount();
    totalEl.textContent = cards.length - visible + 1;
  }

  /* 슬라이드 업데이트 */
  function updateSlider() {
    updateAlignment(); // 정렬 먼저 조정

    const distance = getMoveDistance();
    const maxIndex = cards.length - getVisibleCount();

    // index 안전 처리
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    track.style.transform = `translateX(-${currentIndex * distance}px)`;

    // 현재 페이지
    currentEl.textContent = currentIndex + 1;
    updateTotalPages();
  }

  /* 버튼 이벤트 */
  nextBtn.addEventListener("click", () => {
    const maxIndex = cards.length - getVisibleCount();
    if (currentIndex < maxIndex) currentIndex++;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    updateSlider();
  });

  /* resize 이벤트 */
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlider();
    }, 150);
  });

  /* 초기 실행 */
  updateSlider();
});


//-----------------------------------------------------//


/* 10.tvcf */
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".tvcf__title span");

  // 텍스트 복제 (자연스러운 무한 반복)
  const clone = title.cloneNode(true);
  title.parentElement.appendChild(clone);

  // 폰트 로드 이후 정확한 길이 계산을 위해 setTimeout 사용
  setTimeout(() => {
    const totalWidth = title.offsetWidth;
    const speed = totalWidth / 35; // 숫자 낮을수록 빠름
    title.parentElement.style.setProperty("--roll-speed", `${speed}s`);
  }, 50);
});