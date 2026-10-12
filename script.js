(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  /* ---------------- photos ---------------- */
  const photos = [
    { src: "images/isha-1.jpg", cap: "this smile 🥹✨", tag: "💖" },
    { src: "images/isha-2.jpg", cap: "golden in every way", tag: "🌟" },
    { src: "images/isha-3.jpg", cap: "my favorite human", tag: "💫" },
    { src: "images/isha-4.jpg", cap: "main character energy", tag: "👑" },
    { src: "images/isha-5.jpg", cap: "pretty & kind", tag: "🌸" },
    { src: "images/isha-6.jpg", cap: "the best memories", tag: "🎀" },
  ];

  const reasons = [
    { icon: "🌞", text: "You make everything feel lighter, even my heaviest days." },
    { icon: "💛", text: "You listen like no one else — truly, deeply, without judgement." },
    { icon: "😂", text: "Your laugh is contagious and I'm not okay about it." },
    { icon: "🛡️", text: "You'd fight a whole army for the people you love." },
    { icon: "✨", text: "You have the kindest heart and it shows in every choice you make." },
    { icon: "🏡", text: "With you, anywhere feels like home." },
  ];

  const grid = $("#photo-grid");
  const rots = [-2.5, 2.5, -1, 2.5, -2.5, 1.2];
  photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "photo-card";
    fig.dataset.rot = rots[i % rots.length];
    fig.innerHTML = `<span class="tag">${p.tag}</span>
      <img src="${p.src}" alt="${p.cap}" loading="lazy" />
      <figcaption>${p.cap}</figcaption>`;
    fig.addEventListener("click", () => openLightbox(i));
    grid.appendChild(fig);
  });

  const cards = $("#reason-cards");
  reasons.forEach((r) => {
    const div = document.createElement("div");
    div.className = "flip";
    div.innerHTML = `<div class="flip-inner">
        <div class="flip-face flip-front">${r.icon} #${reasons.indexOf(r) + 1}</div>
        <div class="flip-face flip-back"><span class="big">${r.icon}</span>${r.text}</div>
      </div>`;
    div.addEventListener("click", () => div.classList.toggle("flipped"));
    cards.appendChild(div);
  });

  /* ---------------- lightbox ---------------- */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  const lbCap = $("#lb-cap");
  function openLightbox(i) {
    lbImg.src = photos[i].src;
    lbCap.textContent = photos[i].cap;
    lb.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  $("#lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });
  function closeLb() {
    lb.classList.add("hidden");
    document.body.style.overflow = "";
  }

  /* ---------------- typewriter ---------------- */
  const lines = [
    "The world is softer and brighter because you're in it.",
    "You're not just my best friend — you're my family.",
    "Today we celebrate the day magic walked into this world. 🎂",
    "Isha, you are so deeply loved. Never doubt that.",
  ];
  let li = 0, ci = 0, deleting = false;
  const typedEl = $("#typed");
  const typeLoop = () => {
    const line = lines[Math.min(li, lines.length - 1)];
    typedEl.textContent = line.slice(0, ci);
    if (!deleting) {
      if (ci < line.length) { ci++; setTimeout(typeLoop, 55); }
      else { deleting = true; setTimeout(typeLoop, 2400); }
    } else {
      if (ci > 0) { ci--; setTimeout(typeLoop, 24); }
      else { deleting = false; li = (li + 1) % lines.length; setTimeout(typeLoop, 300); }
    }
  };
  typeLoop();

  /* ---------------- entrance + music ---------------- */
  const enterScreen = $("#enter-screen");
  const content = $("#content");
  let musicStarted = false;
  let audioCtx;

  function playTune() {
    if (musicStarted) return;
    musicStarted = true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = new Ctx();
    // Happy Birthday melody
    const notes = [
      523.25, 523.25, 587.33, 523.25, 698.46, 659.26, 0,
      523.25, 523.25, 587.33, 523.25, 783.99, 698.46, 0,
      523.25, 523.25, 1046.5, 880, 698.46, 659.26, 587.33, 0,
      987.77, 987.77, 880, 698.46, 783.99, 659.26, 0,
    ];
    const dur = [0.4, 0.4, 0.8, 0.8, 0.8, 1.1, 0.3,
                 0.4, 0.4, 0.8, 0.8, 0.8, 1.1, 0.3,
                 0.4, 0.4, 0.8, 0.6, 0.4, 0.8, 1.2, 0.3,
                 0.5, 0.5, 0.5, 0.7, 0.8, 1.6, 0];
    let t = audioCtx.currentTime + 0.1;
    notes.forEach((f, i) => {
      if (f === 0) { t += dur[i]; return; }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur[i]);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur[i] + 0.05);
      t += dur[i];
    });
  }

  $("#enter-btn").addEventListener("click", async () => {
    enterScreen.classList.add("fade-out");
    content.classList.remove("hidden");
    try { playTune(); } catch (e) { /* fine */ }
    revealArmed = true;
    requestAnimationFrame(revealCheck);
    setTimeout(revealCheck, 250);
    setTimeout(revealCheck, 900);
    burst(160);
    setTimeout(() => enterScreen.remove(), 800);
  });

  /* ---------------- open the letter ---------------- */
  const envelope = $("#envelope");
  $("#env-open").addEventListener("click", () => {
    if (envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    burst(90);
    setTimeout(revealCheck, 400);
  });

  /* ---------------- confetti ---------------- */
  const canvas = $("#confetti-canvas");
  const ctx = canvas.getContext("2d");
  let pieces = [];
  let rafId = null;
  const COLORS = ["#ff5fa2", "#b26bff", "#ffd166", "#5f9dff", "#7ef0b0", "#ff9f43", "#ff6b9d"];

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let ambientOn = false;
  const spawnAmbient = () => {
    pieces.push(makePiece(true));
    if (ambientOn && pieces.length < 120) setTimeout(spawnAmbient, 260);
  };
  function makePiece(ambient) {
    const w = ambient ? 6 : Math.random() * 8 + 6;
    return {
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.4,
      w, h: w * (0.6 + Math.random() * 0.5),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      vy: (ambient ? 1.2 : 1.6) + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    };
  }
  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > window.innerHeight + 30) { pieces.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.9;
      if (p.shape === "rect") ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      else ctx.beginPath(), ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2), ctx.fill();
      ctx.restore();
    }
    if (pieces.length) rafId = requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); rafId = null; }
  }
  function burst(n) {
    ambientOn = true;
    for (let i = 0; i < (n || 120); i++) pieces.push(makePiece(false));
    if (!rafId) tick();
    spawnAmbient();
  }
  $("#big-confetti").addEventListener("click", () => burst(220));

  /* ---------------- candles ---------------- */
  const candles = $$(".candle");
  let outCount = 0;
  const wishMsg = $("#wish-message");
  candles.forEach((c) => {
    c.addEventListener("click", () => {
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      const smoke = document.createElement("div");
      smoke.className = "smoke";
      c.appendChild(smoke);
      outCount++;
      if (outCount === candles.length) {
        wishMsg.textContent = "💫 wish made! the universe is listening…";
        setTimeout(() => burst(160), 350);
      } else {
        wishMsg.textContent = `🔥 ${candles.length - outCount} more to go…`;
      }
    });
  });

  /* ---------------- cursor sparkles ---------------- */
  const sparkles = [];
  function makeSparkle(x, y) {
    const s = document.createElement("div");
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:10px;height:10px;pointer-events:none;
      z-index:70;border-radius:50%;background:radial-gradient(circle,#fff,#ff5fa2);
      transform:translate(-50%,-50%) scale(0);animation:pop 0.7s ease-out forwards;`;
    s.textContent = "✦";
    s.style.background = "none";
    s.style.color = ["#ff5fa2", "#b26bff", "#ffd166", "#fff"][(Math.random() * 4) | 0];
    s.style.fontSize = "14px";
    s.style.lineHeight = "1";
    s.style.textAlign = "center";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
  let lastSpark = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSpark > 60 && Math.random() > 0.5) {
      lastSpark = now;
      makeSparkle(e.clientX + (Math.random() * 30 - 15), e.clientY + (Math.random() * 30 - 15));
    }
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = $$(".photo-card, .flip, .envelope, .cake-stage");
  let revealArmed = false;
  let revealTicking = false;

  const restTransform = (el) =>
    (el.dataset.rot ? `rotate(${el.dataset.rot}deg) ` : "") + "translateY(0)";

  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform =
      (el.dataset.rot ? `rotate(${el.dataset.rot}deg) ` : "") + "translateY(40px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  function revealCheck() {
    revealTicking = false;
    if (!revealArmed) return;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach((el) => {
      if (el.dataset.shown) return;
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.dataset.shown = "1";
        el.style.opacity = "1";
        el.style.transform = restTransform(el);
      }
    });
  }

  function onScrollReveal() {
    if (!revealArmed || revealTicking) return;
    revealTicking = true;
    requestAnimationFrame(revealCheck);
  }

  window.addEventListener("scroll", onScrollReveal, { passive: true });
  window.addEventListener("resize", onScrollReveal, { passive: true });
  window.addEventListener("orientationchange", onScrollReveal, { passive: true });
  window.addEventListener("pageshow", () => { if (revealArmed) revealCheck(); });
})();