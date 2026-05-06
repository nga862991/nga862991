document.addEventListener("DOMContentLoaded", () => {
  const familyBtn = document.getElementById("familyBtn");
  const familyList = document.getElementById("familyList");
  const familyIcon = document.getElementById("familyIcon");

  let open = false; // 초기: 닫힌 상태

  // ▲▼ 토글 버튼
  familyBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 버블링 방지 (밖 클릭 닫힘과 충돌 방지)

    open = !open;

    if (open) {
      // 펼쳐짐 (아이콘: down)
      familyList.style.display = "block";
      familyIcon.src = "../resource/img/footer/footer_down.png";
    } else {
      // 닫힘 (아이콘: up)
      familyList.style.display = "none";
      familyIcon.src = "../resource/img/footer/footer_up.png";
    }
  });

  familyList.addEventListener("mouseleave", () => {
    open = false;
    familyList.style.display = "none";
    familyIcon.src = "../resource/img/footer/footer_up.png";
  });

  document.addEventListener("click", (e) => {
    if (!familyBtn.contains(e.target) && !familyList.contains(e.target)) {
      open = false;
      familyList.style.display = "none";
      familyIcon.src = "../resource/img/footer/footer_up.png";
    }
  });
});
