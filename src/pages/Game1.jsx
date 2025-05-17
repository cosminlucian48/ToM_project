import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bunnyBlue from "../assets/bunny_blue.png";
import bunnyRed from "../assets/bunny_red.png";
import boatBlue from "../assets/boat_blue.png";
import boatRed from "../assets/boat_red.png";
import { game1Config } from "../utils/config.js";

const images = [
  { src: bunnyBlue, shape: "iepure", color: "albastru" },
  { src: bunnyRed, shape: "iepure", color: "roșu" },
  { src: boatBlue, shape: "barcă", color: "albastru" },
  { src: boatRed, shape: "barcă", color: "roșu" },
];

const topImages = [
  { src: boatRed, shape: "barcă", color: "roșu", label: "barcă" }, // left
  { src: bunnyBlue, shape: "iepure", color: "albastru", label: "iepure" }, // right
];

const Game1 = () => {
  const navigate = useNavigate();
  const [round, setRound] = useState(0);
  const [results, setResults] = useState([]);
  const [swapped, setSwapped] = useState(false);
  const [showSwapMsg, setShowSwapMsg] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const timerRef = useRef(null);

  const { roundsOrder, totalRounds, swapAt } = game1Config;

  // Determine rule
  const getRule = () => (swapped ? "culoare" : "formă");

  // Handle click on top image
  const handleChoice = (choiceIdx) => {
    if (waiting) return;
    setWaiting(true);
    const shownIdx = roundsOrder[round];
    const shown = images[shownIdx];
    const rule = getRule();
    const correct =
      rule === "formă"
        ? shown.shape === topImages[choiceIdx].shape
        : shown.color === topImages[choiceIdx].color;
    const responseTime = Math.round(performance.now() - timerRef.current);

    setResults((prev) => [
      ...prev,
      {
        round: round + 1,
        shownShape: shown.shape,
        shownColor: shown.color,
        chosen: topImages[choiceIdx].label,
        correct,
        responseTime,
        rule,
      },
    ]);
    setTimeout(() => {
      setRound((r) => r + 1);
      setWaiting(false);
    }, 400);
  };

  // Swap rule in the middle
  useEffect(() => {
    if (round === swapAt && !swapped) {
      setShowSwapMsg(true);
      return;
    }
    if (round < totalRounds) timerRef.current = performance.now();
  }, [round, swapped, swapAt, totalRounds]);

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
          runda: r.round,
          forma: r.shownShape,
          culoare: r.shownColor,
          ales: r.chosen,
          corect: r.correct ? 1 : 0,
          timpRaspuns: r.responseTime,
          regula: r.rule,
        })),
        gameName: "shape_color",
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
          Acum trebuie să alegi după <b>culoare</b>!
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

  const shownIdx = roundsOrder[round];
  const shown = images[shownIdx];

  return (
    <div className="container-shape-color" tabIndex={0}>
      <button
        onClick={() => window.electronAPI.closeApp()}
        className="close-btn"
        title="Închide"
      >
        ×
      </button>
      <h2>Jocul Formă & Culoare</h2>
      <p style={{ textAlign: "center" }}>
        {swapped
          ? "Alege imaginea cu aceeași culoare ca cea de jos"
          : "Alege imaginea cu aceeași formă ca cea de jos"}
      </p>
      <div className="top-images-row">
        <img
          src={topImages[0].src}
          alt={topImages[0].label}
          className="top-image-shape-color"
          style={{
            cursor: waiting ? "not-allowed" : "pointer",
            border: "4px solid #ef4444",
          }}
          onClick={() => handleChoice(0)}
        />
        <img
          src={topImages[1].src}
          alt={topImages[1].label}
          className="top-image-shape-color"
          style={{
            cursor: waiting ? "not-allowed" : "pointer",
            border: "4px solid #2563eb",
          }}
          onClick={() => handleChoice(1)}
        />
      </div>
      <div className="bottom-image-area">
        <img
          src={shown.src}
          alt={shown.shape + " " + shown.color}
          className="bottom-image-shape-color"
        />
      </div>
      <p>
        Runda {round + 1} / {totalRounds}
      </p>
    </div>
  );
};

export default Game1;
