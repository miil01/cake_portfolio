document.addEventListener("DOMContentLoaded", () => {
  const slices = document.querySelectorAll(".slice");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalClose = document.getElementById("modal-close");
  const clickSound = document.getElementById("click-sound");
  const orderSound = document.getElementById("order-sound");

  const endIcon = document.getElementById("end-icon");
  const endPopup = document.getElementById("end-popup");
  const endOk = document.getElementById("end-ok");
  const endNo = document.getElementById("end-no");

  const goHomeBtn = document.getElementById("go-home");
  const whiteFade = document.getElementById("whiteFade");
  const enterSound = document.getElementById("enterSound");

  const cupSound = document.getElementById("cup-sound");
const modalCakeImg = document.getElementById("modal-cake-img");


  
  // -----------------------------
  // 自己紹介フルーツケーキひかる　一度クリックしたら開かない
  // -----------------------------
// 最初のフルーツケーキ
const firstSlice = document.querySelector(".slice:first-child");
firstSlice.classList.add("sparkle");

// 矢印を取得
const arrow = firstSlice.querySelector(".click-arrow");

// クリックしたら光らない・矢印消える
firstSlice.addEventListener("click", () => {
  firstSlice.classList.remove("sparkle");
  if (arrow) arrow.style.display = "none";
});
  

  // -----------------------------
  // スプーンフォークを交互に配置　画像切り替え
  // -----------------------------

  const forkOrSpoon = [
    "spoon.png","fork.png","spoon.png","fork.png",
    "spoon.png","fork.png","spoon.png","fork.png"
  ];

  const hasBeenClicked = Array(slices.length).fill(false);
  let clickedSlice = null;
  const pageLoadTime = Date.now();

  // -----------------------------
  // ティーセット演出 共通関数
  // -----------------------------
function showTeaSet() {
  const teaSet = document.getElementById("tea-set");
  const teacup = teaSet.querySelector(".teacup");
  const handle = teaSet.querySelector(".handle");
  const plate = teaSet.querySelector(".plate");

  teaSet.classList.remove("hidden");   // ← display: block にする

  requestAnimationFrame(() => {        // ← レイアウト更新を待ってから
    teacup.classList.add("show");
    handle.classList.add("show");
    plate.classList.add("show");
  });

  cupSound.currentTime = 0;
  cupSound.play().catch(() => {});
}

  // -----------------------------
  // ケーキクリック処理
  // -----------------------------
  slices.forEach((slice, index) => {
    const img = slice.querySelector("img");
    const hoverOrder = slice.querySelector(".hover-order");
    if (!slice.dataset.originalImg) slice.dataset.originalImg = img.src;

    slice.addEventListener("click", () => {
      if (img.src.includes("spoon.png") || img.src.includes("fork.png")) return;
      clickedSlice = slice;
      modalImg.src = slice.dataset.modalImg;

      modalCakeImg.src = img.src;   // ★ クリックしたケーキ画像をセット
      
      modalTitle.textContent = slice.dataset.modalTitle;
      modalDesc.textContent = slice.dataset.modalDesc;
      modal.classList.add("active");
    });

    hoverOrder.addEventListener("click", e => {
      e.stopPropagation();
      img.src = slice.dataset.originalImg;
      img.classList.remove("spoon-fork");
      slice.classList.remove("hover-enabled");
      orderSound.currentTime = 0;
      orderSound.play();
      checkAllClicked();
    });
  });

  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
    if (!clickedSlice) return;

    const img = clickedSlice.querySelector("img");
    const index = Array.from(slices).indexOf(clickedSlice);

    clickSound.currentTime = 0;
    clickSound.play();

    img.src = forkOrSpoon[index];
    img.classList.add("spoon-fork");
    clickedSlice.classList.add("hover-enabled");

    hasBeenClicked[index] = true;
    clickedSlice = null;
    checkAllClicked();
  });

  function checkAllClicked() {
    if (hasBeenClicked.every(v => v)) {
      endIcon.classList.remove("hidden");
      endIcon.classList.add("visible");
    }
  }

  // -----------------------------
  // 終了アイコンポップアップ
  // -----------------------------
  endIcon.addEventListener("click", () => {
    endPopup.classList.remove("hidden");
    endPopup.style.display = "flex";
  });

  endOk.addEventListener("click", () => {
    endPopup.classList.add("hidden");
    endPopup.style.display = "none";
    endIcon.classList.add("hidden");
    endIcon.classList.remove("visible");

    document.querySelector(".cake-wheel").style.display = "none";

    // ✅ OKクリック時のティーセット登場
    showTeaSet();

    const teaSet = document.getElementById("tea-set");
    const handle = teaSet.querySelector(".handle");
    const cup = teaSet.querySelector(".teacup"); 
    const plate = teaSet.querySelector(".plate");
    const cupImages = ["cup1.png", "cup2.png", "cup3.png"];

    // -----------------------------
    // 画像切替 & 演出
    // -----------------------------
    function updateCupImage() {
      const elapsed = (Date.now() - pageLoadTime) / 1000; // 秒
      let index = 0;
      if (elapsed >= 2 * 60 && elapsed < 5 * 60) index = 1;
      else if (elapsed >= 5 * 60) index = 2;

      if (cup.src.includes(cupImages[index])) return;

    }


    // -----------------------------
    // 回転アニメーション
    // -----------------------------
    let angle = 0;
    function rotateCupAndHandle() {
      cup.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      handle.style.transform = `rotate(${angle}deg) translateX(70px)`;
      angle += 1;
      requestAnimationFrame(rotateCupAndHandle);
    }
    rotateCupAndHandle();

    // -----------------------------
    // 手紙モーダル
    // -----------------------------
    const letterModal = document.getElementById("letter-modal");
    const messages = letterModal.querySelectorAll(".message");
    const letterSound = document.getElementById("letter-sound");
    const teaTimeEl = document.getElementById("tea-time");

    function formatTime(ms) {
      const sec = Math.floor(ms / 1000) % 60;
      const min = Math.floor(ms / 1000 / 60);
      return `${min}分${sec}秒`;
    }

    messages.forEach(el => {
      const text = el.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      el.innerHTML = "";
      for (let ch of text) {
        if (ch === "\n") el.appendChild(document.createElement("br"));
        else {
          const span = document.createElement("span");
          span.textContent = ch;
          span.style.opacity = 0;
          el.appendChild(span);
        }
      }
    });

    cup.addEventListener("click", () => {
      cup.style.display = "none";
      handle.style.display = "none";
      plate.style.display = "none";

      const elapsed = Date.now() - pageLoadTime;
      teaTimeEl.textContent = `あなたのお茶会は ${formatTime(elapsed)} でした。`;

      messages.forEach(m => m.classList.add("hidden"));
      if (elapsed < 2 * 60 * 1000) messages[0].classList.remove("hidden");
      else if (elapsed < 5 * 60 * 1000) messages[1].classList.remove("hidden");
      else messages[2].classList.remove("hidden");

      letterModal.classList.add("active");
      if (letterSound) { letterSound.currentTime = 0; letterSound.play().catch(()=>{}); }

      const spans = letterModal.querySelector(".message:not(.hidden)").querySelectorAll("span");
      let idx = 0;
      const interval = setInterval(() => {
        if (idx >= spans.length) return clearInterval(interval);
        spans[idx].style.opacity = 1;
        idx++;
      }, 50);
    });
  });

  endNo.addEventListener("click", () => {
    endPopup.classList.add("hidden");
    endPopup.style.display = "none";
  });

  // -----------------------------
  // 「最初に戻る」ボタン
  // -----------------------------
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      whiteFade.style.opacity = "1";
      enterSound.currentTime = 0;
      enterSound.play();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  // -----------------------------
  // ケーキホイール回転
  // -----------------------------
  let wheelAngle = 0;
  setInterval(() => {
    slices.forEach((slice, i) => {
      const baseAngle = i * 45; 
      slice.style.transform = `rotate(${baseAngle + wheelAngle}deg) translateY(-200px)`; 
    });
    wheelAngle -= 2;
  }, 200);

  // -----------------------------
  // 時計
  // -----------------------------
  const hourHand = document.querySelector(".hand-wrapper.hour");
  const minuteHand = document.querySelector(".hand-wrapper.minute");
  const secondHand = document.querySelector(".hand-wrapper.second");

  function updateClock() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    hourHand.style.transform = `translate(-50%, -50%) rotate(${h*30 + m*0.5}deg)`;
    minuteHand.style.transform = `translate(-50%, -50%) rotate(${m*6 + s*0.1}deg)`;
    secondHand.style.transform = `translate(-50%, -50%) rotate(${s*6}deg)`;
  }
  updateClock();
  setInterval(updateClock, 1000);

const bgm = document.getElementById("bgm");
const bellIcon = document.getElementById("bell-icon");
const bgmPopup = document.getElementById("bgm-popup");
const bgmOk = document.getElementById("bgm-ok");
const bgmNo = document.getElementById("bgm-no");

let confirmed = false; // OKが押されたかどうか
let firstClick = true;  // 初回クリック判定

bellIcon.addEventListener("click", () => {
  if (!confirmed) {
    // まだOKしていない場合は必ずモーダルを出す
    bgmPopup.classList.add("active");
  } else {
    // OK済みならBGMのON/OFF切り替え
    if (isPlaying) {
      bgm.pause();
      bellIcon.src = "bell-off.png";
      isPlaying = false;
    } else {
      bgm.play().catch(() => {});
      bellIcon.src = "bell-on.png";
      isPlaying = true;
    }
  }
});

// OKボタン
bgmOk.addEventListener("click", () => {
  bgm.play().catch(() => {});
  bellIcon.src = "bell-on.png";
  isPlaying = true;
  confirmed = true;      // ✅ OK押したので操作可能に
  firstClick = false;
  bgmPopup.classList.remove("active");
});

// NOボタン
bgmNo.addEventListener("click", () => {
  // NOでもconfirmedはfalseのまま
  bgm.pause();
  bellIcon.src = "bell-on.png";
  isPlaying = false;
  firstClick = false;    // 初回クリックは消すけどconfirmedはfalse
  bgmPopup.classList.remove("active");
});

});


