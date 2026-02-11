import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const photos = [
  { src: "/memories/photo1.jpg", caption: "The sexy girl ❤️" },
  { src: "/memories/photo2.jpg", caption: "Irresistible🥵" },
  { src: "/memories/photo3.jpg", caption: "My favorite pic ✨" },
  { src: "/memories/photo4.jpg", caption: "To many more years 🥂" },
  { src: "/memories/IMG_3640.JPG", caption: "The muscline is musclining😂" },
  { src: "/memories/IMG_3641.JPG", caption: "Cheese ✨" },
  { src: "/memories/IMG_3642 (2).JPG", caption: " Kissing my dream girl🥂" },
  { src: "/memories/g.jpg", caption: "Your thing ✨" },
  { src: "/memories/l.jpg", caption: "Ready to serve you, queen 🥂" },
];

const countdownMessages = {
  d: "Thousands of days, and I'd still choose you every single time. Love you forever! ❤️",
  h: "Every hour with you feels like a minute, but every hour without you feels like a year. Hurry back! ❤️",
  m: "I’ve spent millions of minutes with you, and I still haven’t figured out how to understand what’s on your mind—the things you haven’t told me. Headache🤕",
  s: "Every second my heart beats, it's basically just saying your name. *Thump-Bemnet-Thump* 💓"
};

const compliments = [
  "You are the most beautiful person I know, inside and out.",
  "Your smile is my favorite thing in the world.",
  "I am so proud of everything you do.",
  "You make every day feel like a dream.",
  "You are my greatest adventure and my favorite home."
];

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [isScratched, setIsScratched] = useState(false);
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [activeTimeCard, setActiveTimeCard] = useState(null);
  const [compliment, setCompliment] = useState("Your smile is my favorite thing in the world.");
  const [timeTogether, setTimeTogether] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [permHearts, setPermHearts] = useState(false);
  const [currentView, setCurrentView] = useState("hub"); 
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const scratchCheckRef = useRef(0);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const checkPassword = () => {
    if (password === "0213") { 
      setIsUnlocked(true); 
      triggerConfetti(); 
    } else alert("Try our special date (MMDD) ❤️");
  };

  const triggerConfetti = () => {
    const emojis = ["❤️", "🌸", "💖", "🌷", "✨"];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = Math.random() * 20 + 10 + "px";
      el.style.animationDuration = Math.random() * 3 + 2 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const startDate = new Date("2015-02-13T00:00:00");
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      setTimeTogether({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isUnlocked && currentView === "gift" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.fillStyle = "#C0C0C0";
      ctx.fillRect(0, 0, 250, 250);
      ctx.font = "bold 16px Poppins";
      ctx.fillStyle = "#666";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH TO REVEAL 🎁", 125, 130);
    }
  }, [isUnlocked, currentView]);

  const handleScratch = (e) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    scratchCheckRef.current++;
    if (scratchCheckRef.current % 15 === 0) {
      const pixels = ctx.getImageData(0, 0, 250, 250).data;
      let trans = 0;
      for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] === 0) trans++; }
      if (trans > (pixels.length / 4) * 0.40) setIsScratched(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="login-screen">
        <div className="login-card-fancy">
          <div className="login-icon" style={{fontSize: '3rem', marginBottom: '10px'}}>🔐</div>
          <h2>Bemnet & Eyuel</h2>
          <p style={{opacity: 0.7, marginBottom: '20px'}}>Enter our special date (MMDD)</p>
          <input 
            type="password" 
            placeholder="••••" 
            autoFocus 
            maxLength={4}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()} 
          />
          <button className="love-btn-glow" onClick={checkPassword}>Enter Our World</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      {permHearts && (
        <div className="background-hearts">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="bg-heart" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, fontSize: `${Math.random() * 20 + 10}px` }}>❤️</div>
          ))}
        </div>
      )}

      <div className="app-container nudge-left">
        <div className="glass-wrapper">
          <header>
            <h1 className="main-title">Bemnet & Eyuel</h1>
            <h2 className="sub-title">11 Years of Love</h2>
            
            <div className="music-container">
              <audio ref={audioRef} loop>
                <source src="/akale.m4a" type="audio/mp4" />
              </audio>
              <button className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                <span className="music-icon">{isPlaying ? "⏸" : "▶️"}</span>
                <span className="music-text">{isPlaying ? "Listening to Akale" : "Play Akale"}</span>
                {isPlaying && <div className="music-waves"><span></span><span></span><span></span></div>}
              </button>
            </div>

            <div className="countdown-row">
              {['d', 'h', 'm', 's'].map((unit) => (
                <div key={unit} className="time-block-clickable" onClick={() => setActiveTimeCard(unit)}>
                  <span>{timeTogether[unit]}</span>
                  <label>{unit === 'd' ? 'Days Together' : unit === 'h' ? 'Hrs' : unit === 'm' ? 'Mins' : 'Secs'}</label>
                </div>
              ))}
            </div>

            <div className="compliment-section-compact">
              <div className="compliment-box-mini" onClick={() => {
                setCompliment(compliments[Math.floor(Math.random() * compliments.length)]);
                triggerConfetti();
                setPermHearts(true);
              }}>
                <div className="heart-icon-mini">💖</div>
                <p>{compliment}</p>
              </div>
            </div>

            {activeTimeCard && (
              <div className="modal-overlay" style={{background: 'rgba(0,0,0,0.6)'}} onClick={() => setActiveTimeCard(null)}>
                <div className="modal-card" style={{padding: '30px', margin: '20px'}}>
                  <p style={{fontSize: '1.2rem', lineHeight: '1.6'}}>{countdownMessages[activeTimeCard]}</p>
                  <button className="back-btn" style={{marginTop: '20px', marginBottom: 0}} onClick={() => setActiveTimeCard(null)}>Close</button>
                </div>
              </div>
            )}
          </header>

          <hr className="divider" />

          {currentView === "hub" && (
            <section className="hub-section">
              <h3 className="section-label" style={{letterSpacing: '2px', opacity: 0.6, marginBottom: '20px'}}>THESE ARE FOR YOU</h3>
              <div className="gift-grid">
                <div className="gift-item" onClick={() => setCurrentView("flowers")}>
                  <div className="gift-icon">🪷</div>
                  <label>Flowers</label>
                </div>
                <div className="gift-item" onClick={() => setCurrentView("memories")}>
                  <div className="gift-icon">🖼️</div>
                  <label>Memories</label>
                </div>
                <div className="gift-item" onClick={() => setCurrentView("gift")}>
                  <div className="gift-icon">🎁</div>
                  <label>Gift</label>
                </div>
                <div className="gift-item" onClick={() => setCurrentView("letter")}>
                  <div className="gift-icon">✉️</div>
                  <label>Letter</label>
                </div>
              </div>
            </section>
          )}

          {currentView === "flowers" && (
            <section className="view-container">
              <button className="back-btn" onClick={() => setCurrentView("hub")}>← Return</button>
              <h2 className="view-title">Your favorite Flowers</h2>
              <div className="flower-display">
                <div className="flower-art">🪷</div>
                <div className="flower-details" style={{textAlign: 'center', maxWidth: '400px', margin: '0 auto'}}>
                  <h3 style={{color: '#ff4d6d'}}>The Lotus: Our Journey</h3>
                  <ul style={{listStyle: 'none', padding: 0, lineHeight: '2'}}>
                    <li><strong>The Bloom:</strong> Beautiful and pure, representing the love we’ve nurtured.</li>
                    <li><strong>The Roots:</strong> Deep and resilient, rising through everything together for 11 years.</li>
                    <li><strong>The Petals:</strong> Opening one by one, just like our many memories and seasons.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {currentView === "memories" && (
            <section className="view-container">
              <button className="back-btn" onClick={() => setCurrentView("hub")}>← Return</button>
              <h3 className="section-label">Our Precious Memories</h3>
              <div className="memory-gallery">
                {photos.map((p, i) => (
                  <div key={i} className="polaroid-frame">
                    <div className="polaroid-inner">
                      <img src={p.src} alt="memory" />
                      <p className="polaroid-caption">{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentView === "gift" && (
            <section className="view-container">
              <button className="back-btn" onClick={() => setCurrentView("hub")}>← Return</button>
              <h3 className="section-label">Something you need</h3>
              <div className="scratch-container-fancy">
                <div className="under-layer" style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}>
                  <button className={`love-btn-reveal ${isScratched ? 'show bounce' : ''}`} onClick={() => setShowGiftCard(true)}>🎁 Unlock Me</button>
                </div>
                <canvas 
                    ref={canvasRef} 
                    width={250} 
                    height={250} 
                    onMouseMove={handleScratch} 
                    onTouchMove={handleScratch} 
                    className={isScratched ? "hide-canvas" : ""} 
                    style={{position: 'relative', cursor: 'crosshair'}}
                />
              </div>
              {isScratched && <p className="success-txt">Success! Tap the button ✨</p>}
            </section>
          )}

          {currentView === "letter" && (
            <section className="view-container">
              <button className="back-btn" onClick={() => setCurrentView("hub")}>← Return</button>
              <div className="letter-paper">
                <h2 className="view-title" style={{fontSize: '2rem'}}>Happiest Anniversary!</h2>
                <p>
                  Dear cute sexy,<br/><br/>
                  Eleven years. It feels like a lifetime and a heartbeat all at once. From "ማነው?" "ማናት?" till these beautiful and peacful days❤️, every moment with you has been a treasure. I live to make you laugh and happy. Even on my worst days, God gave me hope through your strength. You were there for me all the time. You deserve my everything.<br/><br/>
                  Thank you for being my partner, my best friend, my lover—my girl. I am so incredibly lucky to walk through life by your side. Trust me, this is not even our prime; there are many more joyful days to come. I can’t wait to see your beautiful eyes 🥹. I love you.<br/><br/>
                  Always yours,<br/>
                  <strong>Eyuel ❤️</strong>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {showGiftCard && (
        <div className="modal-overlay" onClick={() => setShowGiftCard(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ padding: '15px', maxWidth: '400px' }}>
            <div className="polaroid-inner" style={{ background: '#fff', padding: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <img 
                src="/memories/IMG_5853.JPG" 
                alt="Surprise" 
                style={{ width: '100%', borderRadius: '5px', display: 'block' }} 
              />
              <p className="polaroid-caption" style={{ marginTop: '15px', fontSize: '1.1rem', color: '#ff4d6d', fontWeight: 'bold' }}>
                You are my greatest gift! ❤️
              </p>
            </div>
            <button 
              className="love-btn-glow" 
              style={{ marginTop: '20px', width: '100%' }} 
              onClick={() => setShowGiftCard(false)}
            >
              My Heart is Yours
            </button>
          </div>
        </div>
      )}
    </div>
  );
}