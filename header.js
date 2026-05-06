// PC 전용 드롭다운 메뉴
document.addEventListener("DOMContentLoaded", () => {
  const mainLinks = document.querySelectorAll(".has-main > a");

  mainLinks.forEach(link => {
    link.addEventListener("click", e => {
      // PC 화면에서만 작동하도록 (태블릿·모바일 제외)
      if (window.innerWidth > 1279) {
        e.preventDefault();
        const dropdown = link.nextElementSibling;

        // 다른 드롭다운 닫기
        document.querySelectorAll('[class^="brand-dropdown__"]').forEach(menu => {
          if (menu !== dropdown) menu.style.display = "none";
        });

        // 현재 클릭한 메뉴만 토글
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  });

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", e => {
    if (!e.target.closest(".has-main") && window.innerWidth > 1279) {
      document.querySelectorAll('[class^="brand-dropdown__"]').forEach(menu => {
        menu.style.display = "none";
      });
    }
  });

  // 창 크기 바뀔 때 드롭다운 초기화 (반응형 대비)
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1279) {
      document.querySelectorAll('[class^="brand-dropdown__"]').forEach(menu => {
        menu.style.display = "none";
      });
    }
  });
});



// 오버레이 메뉴
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.header__util img');
  const overlay = document.querySelector('.overlay-menu');
  const closeBtn = document.querySelector('.overlay-menu .close-btn');

  // 배경 어둡게용 div 생성 (중복 방지)
  let bg = document.querySelector('.overlay-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.classList.add('overlay-bg');
    document.body.appendChild(bg);
  }

  // 메뉴 열기
  menuBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    bg.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
  });

  // 메뉴 닫기 함수
  function closeMenu() {
    overlay.classList.remove('active');
    bg.classList.remove('active');
    document.body.style.overflow = '';

    // 모든 하위 메뉴 닫기
    document.querySelectorAll('.has-sub').forEach(li => {
      li.classList.remove('active');
      const sub = li.querySelector('.sub-menu');
      if (sub) {
        sub.style.maxHeight = '0px';
        sub.style.opacity = '0';
      }
    });
  }

  // 닫기 버튼 / 배경 클릭 시 닫기
  closeBtn.addEventListener('click', closeMenu);
  bg.addEventListener('click', closeMenu);

  // 1차 메뉴 클릭 시 슬라이드 토글
  const hasSubs = document.querySelectorAll('.has-sub > a');

  hasSubs.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const parent = link.parentElement;
      const sub = parent.querySelector('.sub-menu');
      const isActive = parent.classList.contains('active');

      // 다른 메뉴 닫기
      document.querySelectorAll('.has-sub').forEach(li => {
        li.classList.remove('active');
        const subMenu = li.querySelector('.sub-menu');
        if (subMenu) {
          subMenu.style.maxHeight = '0px';
          subMenu.style.opacity = '0';
        }
      });

      // 같은 메뉴 클릭 시 닫기 / 아니면 열기
      if (!isActive) {
        parent.classList.add('active');
        if (sub) {
          sub.style.maxHeight = sub.scrollHeight + 'px';
          sub.style.opacity = '1';
        }
      }
    });
  });

  // ESC 키로 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
});

