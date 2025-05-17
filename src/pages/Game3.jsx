import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../utils/game3Questions.json";

const Game3 = () => {
  const navigate = useNavigate();
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [multiRadioValues, setMultiRadioValues] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (round < questions.length) {
      setInputValue("");
      setRadioValue("");
      setMultiRadioValues(
        questions[round].answerType === "multi-radio"
          ? Array(questions[round].radioGroups.length).fill("")
          : []
      );
      timerRef.current = performance.now();
    }
  }, [round]);

  const handleMultiRadioChange = (groupIdx, value) => {
    setMultiRadioValues((prev) => {
      const updated = [...prev];
      updated[groupIdx] = value;
      return updated;
    });
  };

  const handleNext = () => {
    const responseTime = Math.round(performance.now() - timerRef.current);
    const q = questions[round];
    let answer = "";

    if (q.answerType === "textbox") answer = inputValue.trim();
    if (q.answerType === "radio") answer = radioValue;
    if (q.answerType === "multi-radio") {
      answer = q.radioGroups.map((group, idx) => ({
        label: group.label,
        answer: multiRadioValues[idx],
      }));
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionID: q.questionID,
        answer:
          q.answerType === "multi-radio"
            ? multiRadioValues.join("|")
            : q.answerType === "radio"
            ? radioValue
            : inputValue.trim(),
        responseTime,
        questionType: q.answerType
      },
    ]);
    setRound((r) => r + 1);
  };

  useEffect(() => {
    if (round === questions.length && answers.length === questions.length) {
      const child = JSON.parse(localStorage.getItem("childData"));
      window.electronAPI.saveResultsToCSV({
        childName: child.name,
        results: answers.map((a) => ({
          questionID: a.questionID,
          answer: a.answer,
          responseTime: a.responseTime,
          questionType: a.questionType,
        })),
        gameName: "questionnaire",
      });
    }
  }, [round, answers]);

  if (round >= questions.length) {
    return (
      <div className="container">
        <h2>Chestionar finalizat</h2>
        <button
          onClick={() => navigate("/menu")}
          className="block mt-2 bg-green-500 text-white px-3 py-2"
        >
          Înapoi la meniu
        </button>
      </div>
    );
  }

  const q = questions[round];

  return (
    <div className="container">
      <h2>Întrebarea {q.number}</h2>
      {q.textTop && (
        <p style={{ fontWeight: "bold", marginBottom: 12 }}>{q.textTop}</p>
      )}
      {q.asset && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={q.asset}
            alt="Întrebare"
            style={{ maxWidth: 600, maxHeight: 400, objectFit: "contain" }}
          />
        </div>
      )}
      <p style={{ fontSize: "1.2rem", marginBottom: 16 }}>{q.text}</p>
      {q.answerType === "textbox" && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="block border p-2 mb-2"
          style={{ width: "100%", maxWidth: 400 }}
        />
      )}
      {q.answerType === "radio" && (
        <div className="radio-group">
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={
                "radio-label" + (radioValue === opt ? " selected" : "")
              }
            >
              <input
                type="radio"
                name={`q${q.number}`}
                value={opt}
                checked={radioValue === opt}
                onChange={() => setRadioValue(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
      {q.answerType === "multi-radio" && (
        <div>
          {q.radioGroups.map((group, groupIdx) => (
            <div key={groupIdx} style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 6, fontWeight: 500 }}>
                {group.label}
              </div>
              <div className="radio-group">
                {group.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={
                      "radio-label" +
                      (multiRadioValues[groupIdx] === opt ? " selected" : "")
                    }
                  >
                    <input
                      type="radio"
                      name={`q${q.number}-group${groupIdx}`}
                      value={opt}
                      checked={multiRadioValues[groupIdx] === opt}
                      onChange={() => handleMultiRadioChange(groupIdx, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-3 py-1"
        disabled={
          (q.answerType === "textbox" && !inputValue.trim()) ||
          (q.answerType === "radio" && !radioValue) ||
          (q.answerType === "multi-radio" && multiRadioValues.some((v) => !v))
        }
      >
        Următoarea
      </button>
    </div>
  );
};

export default Game3;
