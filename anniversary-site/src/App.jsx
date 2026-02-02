import React, { useEffect, useState, useRef } from "react";
import "./App.css";

// --- DATA CONFIGURATION ---
const photos = ["/memories/photo1.jpg", "/memories/photo2.jpg", "/memories/photo3.jpg", "/memories/photo4.jpg", "/memories/photo5.jpg", "/memories/photo6.jpg"];

const reasonsList = [
  { title: "🌸 Your kindness", desc: "The way you care for everyone around you inspires me every single day." },
  { title: "😂 Your laugh", desc: "It's my favorite soundtrack. One chuckle from you can fix my darkest days." },
  { title: "💪 Your strength", desc: "I admire how you handle challenges with grace. You are my rock." },
  { title: "💖 Your heart", desc: "You have the most beautiful soul I have ever known." },
];

const sweetNotes = [
  "You're my favorite thought. ❤️",
  "I'm so glad I found you. ✨",
  "You make every day better just by being in it.",
  "I love you more than words can say. 🌹",
  "You are my greatest adventure. 🌎"
];

const openWhenLetters = [
  { title: "Miss Me", content: "Close your eyes and breathe. I'm always right there in your heart. ❤️" },
  { title: "Sad", content: "Remember that you are the strongest person I know. I am your biggest fan. 🌻" },
  { title: "Need a Laugh", content: "Think about the face I make when I'm confused! 😂" },
];

const timelineEvents = [
  { date: "Feb 13, 2023", title: "The Day We Met", desc: "The moment my life changed forever." },
  { date: "March 10, 2023", title: "Our First Date", desc: "I was so nervous, but your smile made everything easy." },
  { date: "Today", title: "Happy Anniversary", desc: "Still falling for you every single day." },
];

export default function App() {
  // --- STATES ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [openWhen, setOpenWhen] = useState(null);
  const [currentNote, setCurrentNote] = useState(sweetNotes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [stars, setStars] = useState([]);

  const audioRef = useRef(new Audio("/music/love.mp3"));
  const voiceRef = useRef(new Audio("/music/voice.mp3"));
  const canvasRef = useRef(null);

  // --- LOGIC: Password & Confetti ---
  const checkPassword = () => {
    if (password === "0213") {
      setIsUnlocked(true);
      triggerConfetti();
    } else alert("Wrong date! Hint: 0213");
  };

  const triggerConfetti = () => {
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "❤️";
      heart.className = "confetti";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = Math.random() * 2 + 3 + "s";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
  };

  // --- LOGIC: Countdown ---
  useEffect(() => {
    const anniversaryDate = new Date("2026-12-31T00:00:00"); 
    const timer = setInterval(() => {
      const now = new Date();
      const difference = anniversaryDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGIC: Stars & Scratch ---
  useEffect(() => {
    if (isPlaying) {
      setStars(Array.from({ length: 40 }).map((_, i) => ({ id: i, top: Math.random() * 100 + "%", left: Math.random() * 100 + "%", delay: Math.random() * 3 + "s" })));
    } else setStars([]);
  }, [isPlaying]);

  useEffect(() => {
    if (isUnlocked && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(0, 0, 200, 200);
      ctx.font = "bold 14px Poppins"; ctx.fillStyle = "#555"; ctx.textAlign = "center";
      ctx.fillText("Scratch Me!", 100, 105);
    }
  }, [isUnlocked]);

  const handleScratch = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
  };

  if (!isUnlocked) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h2>🔒 Anniversary Site</h2>
          <input type="text" placeholder="MMDD" onChange={(e) => setPassword(e.target.value)} />
          <button className="love-btn" onClick={checkPassword}>Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="video-container"><video autoPlay loop muted playsInline className="bg-video"><source src="/video/background.mp4" type="video/mp4" /></video></div>
      {isPlaying && <div className="star-container">{stars.map(s => <div key={s.id} className="star" style={{ top: s.top, left: s.left, animationDelay: s.delay }} />)}</div>}

      <div className="content-wrapper">
        <header>
          <h1>Happy Anniversary ❤️</h1>
          <div className={`music-toggle-header ${isPlaying ? "playing" : ""}`} onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}>
            <span className="vinyl-icon">🎵</span> <span>{isPlaying ? "Music: On" : "Music: Off"}</span>
          </div>
          <div className="countdown-box">
            <div className="timer-display">
              <div><span>{timeLeft.days || 0}</span>d</div>
              <div><span>{timeLeft.hours || 0}</span>h</div>
              <div><span>{timeLeft.mins || 0}</span>m</div>
              <div><span>{timeLeft.secs || 0}</span>s</div>
            </div>
          </div>
        </header>

        <div className="note-box" onClick={() => setCurrentNote(sweetNotes[Math.floor(Math.random() * sweetNotes.length)])}>
          <p>💌 Tap for a note: <span className="note-text">"{currentNote}"</span></p>
        </div>

        <section className="reasons">
          <h3>✨ Why I Love You</h3>
          <div className="reason-grid">
            {reasonsList.map((r, i) => <div key={i} className="reason-card" onClick={() => setSelectedReason(r)}>{r.title}</div>)}
          </div>
        </section>

        <section className="open-when">
          <h3>💌 Open When...</h3>
          <div className="folder-grid">
            {openWhenLetters.map((l, i) => <button key={i} className="folder-btn" onClick={() => setOpenWhen(l)}>{l.title}</button>)}
          </div>
        </section>

        <section className="scratch-section">
          <h3>🎁 Scratch for a Memory</h3>
          <div className="scratch-container">
            <img src="/memories/photo1.jpg" alt="Secret" className="secret-img" />
            <canvas ref={canvasRef} width={200} height={200} onMouseMove={handleScratch} onTouchMove={handleScratch} />
          </div>
        </section>

        <section className="timeline-section">
          <h3>🛤️ Our Journey</h3>
          <div className="timeline-container">
            {timelineEvents.map((event, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
                <div className="timeline-dot">❤️</div>
                <div className="timeline-content"><h4>{event.date}</h4><h5>{event.title}</h5><p>{event.desc}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="gallery">
          <h3>📸 Our Memories</h3>
          <div className="photo-grid">
            {photos.map((src, i) => <div key={i} className="polaroid" onClick={() => setSelectedImage(src)}><img src={src} alt="Memory" /><span>Memory {i+1}</span></div>)}
          </div>
        </section>

        <button className="love-btn big-btn" onClick={() => { setShowLetter(true); triggerConfetti(); }}>✉️ Read My Letter</button>
      </div>

      {/* Modals (Letter, Reasons, OpenWhen, Image) */}
      {showLetter && <div className="modal" onClick={() => setShowLetter(false)}><div className="letter-card" onClick={e => e.stopPropagation()}><h2>My Love 💕</h2><div className="voice-player" onClick={() => { isVoicePlaying ? voiceRef.current.pause() : voiceRef.current.play(); setIsVoicePlaying(!isVoicePlaying); }}>{isVoicePlaying ? "⏸ Pause Voice" : "▶️ Play Voice Note"}</div><p>You are my everything...</p><button className="love-btn" onClick={() => setShowLetter(false)}>Close</button></div></div>}
      {selectedReason && <div className="modal" onClick={() => setSelectedReason(null)}><div className="letter-card" onClick={e => e.stopPropagation()}><h2>{selectedReason.title}</h2><p>{selectedReason.desc}</p><button className="love-btn" onClick={() => setSelectedReason(null)}>Close</button></div></div>}
      {openWhen && <div className="modal" onClick={() => setOpenWhen(null)}><div className="letter-card" onClick={e => e.stopPropagation()}><h2>{openWhen.title}</h2><p>{openWhen.content}</p><button className="love-btn" onClick={() => setOpenWhen(null)}>Close</button></div></div>}
      {selectedImage && <div className="modal" onClick={() => setSelectedImage(null)}><img src={selectedImage} className="zoomed-img" alt="Memory" /></div>}
    </div>
  );
}