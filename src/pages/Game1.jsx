import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import image assets
import img1 from '../assets/image1.png';
import img2 from '../assets/image2.png';
import img3 from '../assets/image3.png';
import img4 from '../assets/image4.png';
import img5 from '../assets/image5.png';
import img6 from '../assets/image6.png';
import img7 from '../assets/image7.png';

const images = [
  img1, 
  img2, 
  // img3, 
  // img4, 
  // img5, 
  // img6, 
  // img7
];

export default function Game1() {
  const figRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle, animating, ready, timing, result, finished
  const [round, setRound] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const moveDuration = 2000;

  const startAnimation = () => {
    setResult(null);
    setPhase('animating');
    const fig = figRef.current;
    fig.style.transition = `left ${moveDuration}ms linear`;
    fig.style.left = '90%';

    setTimeout(() => {
      fig.style.transition = 'none';
      fig.style.left = '0%';
      setPhase('ready');
    }, moveDuration);
  };

  const handleKeyPress = (e) => {
    if (e.code !== 'Space') return;

    if (phase === 'ready') {
      setStartTime(Date.now());
      setPhase('timing');
    } else if (phase === 'timing') {
      const guessTime = Date.now();
      const diff = guessTime - startTime;
      const error = diff - moveDuration;

      const currentResult = {
        round: round + 1,
        guess: diff,
        error,
        direction: error > 0 ? 'late' : 'early',
      };

      setResults(prev => [...prev, currentResult]);
      setResult(currentResult);
      setPhase('result');
    }
  };

  const nextRound = () => {
    if (round + 1 < images.length) {
      setRound(prev => prev + 1);
      startAnimation();
    } else {
      setPhase('finished');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, startTime]);

  return (
    <div className="container">
      <h2>Game 1: Movement Estimation</h2>
      <p>Round {round + 1} of {images.length}</p>

      <div
        style={{
          position: 'relative',
          height: '120px',
          border: '1px solid #ccc',
          margin: '40px 0',
          background: '#f8fafc',
        }}
      >
        <img
          ref={figRef}
          src={images[round]}
          alt="figurine"
          style={{
            position: 'absolute',
            top: '30px',
            left: '0%',
            width: '80px',
            height: '80px',
            objectFit: 'contain',
          }}
        />
      </div>

      {phase === 'idle' && <button onClick={startAnimation}>Start</button>}

      {phase === 'animating' && <p>Watch the figurine move...</p>}

      {phase === 'ready' && (
        <p>Press <strong>Space</strong> to begin your timing guess.</p>
      )}

      {phase === 'timing' && (
        <p>Press <strong>Space</strong> again when you think the figurine reaches the right edge.</p>
      )}

      {phase === 'result' && result && (
        <div>
          <p>
            You were <strong>{Math.abs(result.error)}ms</strong> {result.direction}.
          </p>
          <button onClick={nextRound}>
            {round + 1 < images.length ? 'Next Round' : 'Finish'}
          </button>
        </div>
      )}

      {phase === 'finished' && (
        <div>
          <h3>Game Over</h3>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                Round {r.round}: {Math.abs(r.error)}ms {r.direction}
              </li>
            ))}
          </ul>
          <button onClick={() => {
            setRound(0);
            setResults([]);
            setPhase('idle');
          }}>
            Play Again
          </button>
          <button onClick={() => {
            window.electronAPI.saveResultsToCSV(results);
            navigate("/menu"); // 👈 Save via Electron
          }}>
            Go back to the menu
          </button>
        </div>
      )}
    </div>
  );
}
