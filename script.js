document.addEventListener("DOMContentLoaded", () => {

  // ===== モーダル =====
  const alertModal = document.getElementById("first-alert");
  const alertOk = document.getElementById("alert-ok");

  if (!alertModal || !alertOk) return;

  // ページを開いたら必ずモーダル表示
  alertModal.style.display = "flex";

  alertOk.addEventListener("click", () => {
    alertModal.style.display = "none";
  });

  // ===== クロッシュ演出 =====
  let clickCount = 0;
  const maxClicks = 4;
  const nextPageUrl = 'cake.html';

  const cloche = document.getElementById('cloche');
  const countImg = document.getElementById('countImg');
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const tickSound = document.getElementById('tickSound');
  const enterSound = document.getElementById('enterSound');
  const whiteFade = document.getElementById('whiteFade');

  cloche.addEventListener('click', () => {

    // モーダル表示中は押せない
    if (alertModal.style.display !== "none") return;

    clickCount++;

    if (clickCount < maxClicks) {
      countImg.src = `count${maxClicks - clickCount}.png`;
      countImg.style.display = 'block';

      hourHand.style.display = 'block';
      minuteHand.style.display = 'block';

      if (clickCount === 1) tickSound.play();

    } else if (clickCount === maxClicks) {

      countImg.src = "count0.png";
      countImg.style.display = 'block';

      tickSound.pause();
      tickSound.currentTime = 0;

      enterSound.play();
      whiteFade.style.opacity = 1;

      setTimeout(() => {
        window.location.href = nextPageUrl;
      }, 2500);
    }

    // クロッシュ揺れ
    cloche.classList.remove('shake');
    void cloche.offsetWidth;
    cloche.classList.add('shake');
  });

});
