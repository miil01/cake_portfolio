document.addEventListener("DOMContentLoaded", () => {
  emailjs.init('be9OA_lUoqYAu8Z_P');

  // =============================
  // DOM要素取得
  // =============================
  const slices = document.querySelectorAll(".slice");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalCakeImg = document.getElementById("modal-cake-img");
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

  const hourHand = document.querySelector(".hand-wrapper.hour");
  const minuteHand = document.querySelector(".hand-wrapper.minute");
  const secondHand = document.querySelector(".hand-wrapper.second");

  const bgm = document.getElementById("bgm");
  const bellIcon = document.getElementById("bell-icon");
  const bgmPopup = document.getElementById("bgm-popup");
  const bgmOk = document.getElementById("bgm-ok");
  const bgmNo = document.getElementById("bgm-no");

  const feedbackForm = document.getElementById("feedback-form");
  const feedbackMsg = document.getElementById("feedback-msg");

  const pageLoadTime = Date.now();
  let clickedSlice = null;
  let isPlaying = false; 
  let confirmed = false;
  let firstClick = true;

  const forkOrSpoon = ["spoon.png","fork.png","spoon.png","fork.png","spoon.png","fork.png","spoon.png","fork.png"];
  const hasBeenClicked = Array(slices.length).fill(false);

  // =============================
  // 最初のフルーツケーキ演出
  // =============================
  const firstSlice = slices[0];
  firstSlice.classList.add("sparkle");
  const arrow = firstSlice.querySelector(".click-arrow");
  firstSlice.addEventListener("click", () => {
    firstSlice.classList.remove("sparkle");
    if (arrow) arrow.style.display = "none";
  });

  // =============================
  // フォーム送信（EmailJS）
  // =============================
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedbackText = feedbackForm.feedback.value.trim();
      if (!feedbackText) {
        alert("感想を入力してください");
        return;
      }

      emailjs.send('service_01tm3no', 'template_g2ttiuk', {
        user_name: 'mina',
        feedback: feedbackText
      }).then((response) => {
        console.log("EmailJS response:", response);
        feedbackMsg.classList.remove("hidden");
        feedbackForm.reset();
        setTimeout(() => feedbackMsg.classList.add("hidden"), 3000);
      }).catch((err) => {
        console.error("EmailJS error:", err);
      });
    });
  }

  // =============================
  // スライスクリック処理
  // =============================
  slices.forEach((slice, index) => {
    const img = slice.querySelector("img");
    const hoverOrder = slice.querySelector(".hover-order");

    if (!slice.dataset.originalImg) slice.dataset.originalImg = img.src;

    slice.addEventListener("click", () => {
      if (img.src.includes("spoon.png") || img.src.includes("fork.png")) return;
      clickedSlice = slice;
      modalImg.src = slice.dataset.modalImg;
      modalCakeImg.src = img.src;
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



  // =============================
  // 終了アイコンポップアップ
  // =============================
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
    showTeaSet(); // ティーセット表示
    startCupRotation();
    setupLetterModal();
  });

  endNo.addEventListener("click", () => {
    endPopup.classList.add("hidden");
    endPopup.style.display = "none";
  });

  // =============================
  // 最初に戻るボタン
  // =============================
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      whiteFade.style.opacity = "1";
      enterSound.currentTime = 0;
      enterSound.play();
      setTimeout(() => window.location.href = "index.html", 2000);
    });
  }

  // =============================
  // ケーキホイール回転
  // =============================
  let wheelAngle = 0;
  setInterval(() => {
    slices.forEach((slice, i) => {
      const baseAngle = i * 45;
      slice.style.transform = `rotate(${baseAngle + wheelAngle}deg) translateY(-200px)`;
    });
    wheelAngle -= 2;
  }, 200);

  // =============================
  // 時計更新
  // =============================
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

  // =============================
  // BGM操作
  // =============================
  bellIcon.addEventListener("click", () => {
    if (!confirmed) bgmPopup.classList.add("active");
    else toggleBGM();
  });

  bgmOk.addEventListener("click", () => {
    bgm.play().catch(() => {});
    bellIcon.src = "bell-on.png";
    isPlaying = true;
    confirmed = true;
    firstClick = false;
    bgmPopup.classList.remove("active");
  });

  bgmNo.addEventListener("click", () => {
    bgm.pause();
    bellIcon.src = "bell-on.png";
    isPlaying = false;
    firstClick = false;
    bgmPopup.classList.remove("active");
  });

  function toggleBGM() {
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

  // =============================
  // ティーセット表示
  // =============================
  function showTeaSet() {
    const teaSet = document.getElementById("tea-set");
    const teacup = teaSet.querySelector(".teacup");
    const handle = teaSet.querySelector(".handle");
    const plate = teaSet.querySelector(".plate");

    teaSet.classList.remove("hidden");
    requestAnimationFrame(() => {
      teacup.classList.add("show");
      handle.classList.add("show");
      plate.classList.add("show");
    });
    cupSound.currentTime = 0;
    cupSound.play().catch(() => {});
  }

  function startCupRotation() {
    const teaSet = document.getElementById("tea-set");
    const cup = teaSet.querySelector(".teacup");
    const handle = teaSet.querySelector(".handle");
    let angle = 0;

    function rotateCupAndHandle() {
      cup.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      handle.style.transform = `rotate(${angle}deg) translateX(70px)`;
      angle += 1;
      requestAnimationFrame(rotateCupAndHandle);
    }
    rotateCupAndHandle();
  }

  // =============================
  // 手紙モーダル処理
  // =============================
  function setupLetterModal() {
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

    const teaSet = document.getElementById("tea-set");
    const cup = teaSet.querySelector(".teacup");
    const handle = teaSet.querySelector(".handle");
    const plate = teaSet.querySelector(".plate");

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
  }



});