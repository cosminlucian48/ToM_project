import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import sunImg from "../assets/day.png";
import moonImg from "../assets/night.png";
import { game2Config } from "../utils/config.js";

const images = [
  { src: sunImg, label: "zi" }, // "day" -> "zi"
  { src: moonImg, label: "noapte" }, // "night" -> "noapte"
];

const Game2 = () => {
  const navigate = useNavigate();
  const [round, setRound] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const [results, setResults] = useState([]);
  const [swapped, setSwapped] = useState(false);
  const [showSwapMsg, setShowSwapMsg] = useState(false);
  const timerRef = useRef(null);

  // Get config
  const { roundsOrder, totalRounds, swapAt } = game2Config;

  // Determine correct key based on swap state and image
  const getCorrectKey = (imgIdx) => {
    if (!swapped) {
      return imgIdx === 0 ? "ArrowLeft" : "ArrowRight"; // day=sun, night=moon
    } else {
      return imgIdx === 0 ? "ArrowRight" : "ArrowLeft"; // day=moon, night=sun
    }
  };

  // For CSV: game state
  const getGameState = () => (swapped ? "inversat" : "normal");

  useEffect(() => {
    if (round < totalRounds) {
      // Show swap message if needed
      if (round === swapAt && !swapped) {
        setShowSwapMsg(true);
        setShowImage(false);
        return;
      }
      setShowImage(true);
      timerRef.current = performance.now();
      const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const responseTime = performance.now() - timerRef.current;
          const imgIdx = roundsOrder[round];
          const correctKey = getCorrectKey(imgIdx);
          const correct = e.key === correctKey;
          setResults((prev) => [
            ...prev,
            {
              round: round + 1,
              shown: images[imgIdx].label,
              pressed: e.key === "ArrowLeft" ? "soare" : "luna",
              correct,
              responseTime: Math.round(responseTime),
              gameState: getGameState(),
            },
          ]);
          setShowImage(false);
          setTimeout(() => setRound((r) => r + 1), 400);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line
  }, [round, swapped]);

  // Handle swap message and wait for space
  useEffect(() => {
    if (showSwapMsg) {
      const handleSpace = (e) => {
        if (e.code === "Space") {
          setSwapped(true);
          setShowSwapMsg(false);
        }
      };
      window.addEventListener("keydown", handleSpace);
      return () => window.removeEventListener("keydown", handleSpace);
    }
  }, [showSwapMsg]);

  // Save results at the end
  useEffect(() => {
    if (round === totalRounds && results.length === totalRounds) {
      const child = JSON.parse(localStorage.getItem("childData"));
      window.electronAPI.saveResultsToCSV({
        childName: child.name,
        results: results.map((r) => ({
          round: r.round,
          shown: r.shown,
          pressed: r.pressed,
          correct: r.correct ? 1 : 0,
          responseTime: r.responseTime,
          gameState: r.gameState,
        })),
        gameName: "daynight_stroop",
      });
    }
  }, [round, results, totalRounds]);

  if (showSwapMsg) {
    return (
      <div className="container">
        <button
          onClick={() => window.electronAPI.closeApp()}
          className="close-btn"
          title="Închide"
        >
          ×
        </button>
        <h2>Schimbare reguli!</h2>
        <p>
          <b>Regulile s-au schimbat!</b>
          <br />
          Acum, când vezi <b>zi</b>, apasă <b>→</b> pentru Lună.
          <br />
          Când vezi <b>noapte</b>, apasă <b>←</b> pentru Soare.
          <br />
          <br />
          Apasă <b>Space</b> pentru a continua.
        </p>
      </div>
    );
  }

  if (round === totalRounds) {
    const correctCount = results.filter((r) => r.correct).length;
    const avgTime = Math.round(
      results.reduce((a, b) => a + b.responseTime, 0) / results.length
    );
    return (
      <div className="container">
        <button
          onClick={() => window.electronAPI.closeApp()}
          className="close-btn"
          title="Închide"
        >
          ×
        </button>
        <h2>Rezultate</h2>
        <p>
          Corecte: {correctCount} / {totalRounds}
        </p>
        <p>Timp mediu de răspuns: {avgTime} ms</p>
        <button
          onClick={() => navigate("/menu")}
          className="block mt-2 bg-green-500 text-white px-3 py-2"
        >
          Înapoi la meniu
        </button>
      </div>
    );
  }

  const imgIdx = roundsOrder[round];
  const currentImg = images[imgIdx];

   return (
    <div className="container" tabIndex={0}>
      <button
        onClick={() => window.electronAPI.closeApp()}
        className="close-btn"
        title="Close"
      >
        ×
      </button>
      <h2>Sarcina Zi/Noapte (Stroop)</h2>
      <div style={{ marginBottom: 24 }}>
        {!swapped ? (
          <ul className="instructions-list">
            <li>
              <b>←</b> Soare <i>(Zi)</i>
            </li>
            <li>
              <b>→</b> Lună <i>(Noapte)</i>
            </li>
          </ul>
        ) : (
          <ul className="instructions-list">
            <li>
              <b>→</b> Lună <i>(Zi)</i>
            </li>
            <li>
              <b>←</b> Soare <i>(Noapte)</i>
            </li>
          </ul>
        )}
      </div>
      <div className="image-area-2">
        <img
          src={currentImg.src}
          alt={currentImg.label}
          className="game-image"
          style={{ opacity: showImage ? 1 : 0 }}
        />
      </div>
      <p>
        Runda {round + 1} / {totalRounds}
      </p>
    </div>
  );
};

export default Game2;
