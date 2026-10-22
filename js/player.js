
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const seek = document.getElementById("seek");
const barFill = document.getElementById("barFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const statusEl = document.getElementById("status");

const playSVG =
  '<path d="M8 5.5v13l11-6.5-11-6.5z"/>';

const pauseSVG =
  '<path d="M7 5h4v14H7z M14 5h4v14h-4z"/>';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function updateButton(playing) {
  playIcon.innerHTML = playing ? pauseSVG : playSVG;

  playBtn.setAttribute(
    "aria-label",
    playing ? "إيقاف مؤقت" : "تشغيل"
  );
}

playBtn.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }

  try {
    statusEl.textContent = "جارٍ تحميل التلاوة...";
    await audio.play();
  } catch (error) {
    console.error("Playback error:", error);

    statusEl.textContent =
      "تعذر تشغيل التلاوة. تأكد من وجود ملف MP3 في مجلد audio.";

  }
});

audio.addEventListener("playing", () => {
  updateButton(true);
  statusEl.textContent = "جاري الاستماع إلى سورة يس";
});

audio.addEventListener("pause", () => {
  updateButton(false);

  if (!audio.ended && audio.currentTime > 0) {
    statusEl.textContent = "التلاوة متوقفة مؤقتًا";
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  statusEl.textContent = "استمع إلى سورة يس";
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  const progress = (audio.currentTime / audio.duration) * 100;

  barFill.style.width = `${progress}%`;

  if (document.activeElement !== seek) {
    seek.value = String(progress);
  }

  currentTimeEl.textContent = formatTime(audio.currentTime);
});

seek.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  audio.currentTime =
    (Number(seek.value) / 100) * audio.duration;

  barFill.style.width = `${seek.value}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  updateButton(false);
  seek.value = "0";
  barFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  statusEl.textContent = "انتهت التلاوة";
});

audio.addEventListener("error", () => {
  console.error("Audio error:", audio.error);
  console.error("Audio source:", audio.currentSrc);

  statusEl.textContent =
    "تعذر تحميل الصوت. راجع ملف MP3 ومساره داخل المشروع.";
});

updateButton(false);
