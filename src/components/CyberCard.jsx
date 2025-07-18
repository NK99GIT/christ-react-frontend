// src/components/CyberCard.jsx
import { useRef } from "react"; 

/**
 * Props:
 *   title  – big text (2 lines with <br/> allowed)
 *   logo   – img url (optional; shows instead of default CYBER text)
 *   prompt – hover prompt text
 */
export default function CyberCard({ title = "CYBER<br/>CARD", logo, prompt = "HOVER ME" }) {
  const box = useRef(null);

  /* simple mouse-tilt */
  const handleMove = (e) => {
    const b = box.current.getBoundingClientRect();
    const x = e.clientX - b.left - b.width / 2;
    const y = e.clientY - b.top - b.height / 2;
    const rx = (-y / (b.height / 2)) * 10; // max 10deg
    const ry = (x / (b.width / 2)) * 10;
    box.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const resetTilt = () => (box.current.style.transform = "rotateX(0) rotateY(0)");

  return (
    <div className="cyber-container noselect">
      {/* 25 trackers for the 3-D demo */}
      <div className="canvas">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className={`tracker tr-${i + 1}`} />
        ))}

        {/* the actual card */}
        <div
          id="card"
          ref={box}
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
        >
          <div className="card-content">
            <div className="card-glare" />
            <div className="cyber-lines">
              <span></span><span></span><span></span><span></span>
            </div>

            {/* prompt */}
            <p id="prompt">{prompt}</p>

            {/* title OR logo */}
            {logo ? (
              <img
                src={logo}
                alt={title.replace(/<br\/?>/g, " ")}
                className="w-24 mx-auto mt-10 mb-6 select-none pointer-events-none"
              />
            ) : (
              <div
                className="title select-none pointer-events-none"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            <div className="glowing-elements">
              <div className="glow-1"></div>
              <div className="glow-2"></div>
              <div className="glow-3"></div>
            </div>

            <div className="subtitle">
              <span>INTERACTIVE</span>
              <span className="highlight">3D EFFECT</span>
            </div>

            <div className="card-particles">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
            <div className="corner-elements">
              <span></span><span></span><span></span><span></span>
            </div>
            <div className="scan-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
