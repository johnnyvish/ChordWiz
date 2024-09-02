"use client";

import { useState, useEffect } from "react";
import { instruments, tonics, modes } from "@/Constants";
import { getScaleNotes, getRandomChord } from "@/Utils";
import { useInstrument } from "@/hooks/useInstrument";
import DropdownSelection from "@/components/DropdownSelection";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosMusicalNotes } from "react-icons/io";

export default function Home() {
  const [mode, setMode] = useState("Major");
  const [tonic, setTonic] = useState("C");
  const [currentChord, setCurrentChord] = useState({
    notes: ["C", "E", "G"],
    degree: 1,
    quality: "Major",
  });

  const [round, setRound] = useState(0);
  const [instrumentName, setInstrumentName] = useState("bright_acoustic_piano");
  const [buttonColors, setButtonColors] = useState(Array(8).fill(""));
  const [dronePlaying, setDronePlaying] = useState(false);

  const { playChord, startDrone, stopDrone, droneVolume, setDroneVolume } =
    useInstrument(instrumentName);

  useEffect(() => {
    if (round > 0) {
      const scaleNotes = getScaleNotes(tonic, mode);
      const { chordNotes, chordDegree, chordQuality } = getRandomChord(
        scaleNotes,
        mode
      );

      setCurrentChord({
        notes: chordNotes,
        degree: chordDegree,
        quality: chordQuality,
      });

      playChord(chordNotes);
      setButtonColors(Array(8).fill(""));
    }
  }, [round, mode, tonic]);

  useEffect(() => {
    if (dronePlaying && round > 0) {
      startDrone(tonic);
    } else {
      stopDrone();
      setDronePlaying(false);
    }
  }, [dronePlaying, tonic, round]);

  const handleGuess = (guess) => {
    const newColors = [...buttonColors];
    if (guess === currentChord.degree) {
      newColors[guess - 1] = "bg-green-500 text-white";
      setButtonColors(newColors);
      setTimeout(() => {
        setRound(round + 1);
      }, 1000);
    } else {
      newColors[guess - 1] = "bg-red-500 text-white";
      setButtonColors(newColors);
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen">
      <a href="/">
        <button className="text-5xl md:text-6xl font-bold mt-8 text-gray-800">
          Chord Wiz
        </button>
      </a>

      {round === 0 && (
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/c3392827878799.5636c23e95ef9.gif"
          className="w-[240px]"
        />
      )}

      <div className="flex flex-col justify-center items-center w-full">
        {round === 0 && (
          <div className="flex flex-col justify-center items-center gap-8 w-[80%] md:w-[40%]">
            <DropdownSelection
              options={instruments.map((inst) => ({
                value: inst,
                label: inst,
              }))}
              value={instrumentName}
              onChange={setInstrumentName}
              title="Select an instrument"
            />

            <DropdownSelection
              options={tonics.map((t) => ({ value: t, label: t }))}
              value={tonic}
              onChange={setTonic}
              title="Select a tonic"
            />

            <DropdownSelection
              options={modes.map((m) => ({ value: m, label: m }))}
              value={mode}
              onChange={setMode}
              title="Select a mode"
            />

            <button
              onClick={() => setRound(round + 1)}
              className="w-full bg-gray-800 flex justify-center items-center pb-4 pt-2 rounded-xl"
            >
              <p className="text-4xl text-white">Begin</p>
            </button>
          </div>
        )}

        {round > 0 && (
          <div className="flex flex-col justify-center items-center mt-12 w-[80%] md:w-[40%]">
            <div className="flex justify-between items-center w-full">
              <button onClick={() => setRound(0)}>
                <FaArrowLeft />
              </button>
              <h2>
                {tonic} {mode}
              </h2>
              <h2>Round: {round}</h2>
            </div>

            <button
              onClick={() => playChord(currentChord.notes)}
              className="mt-8 rounded-2xl w-full py-2 bg-white shadow-sm shadow-gray-400 flex justify-center items-center gap-4"
            >
              <IoIosMusicalNotes />
              <p>Hear again</p>
            </button>

            <div className="grid grid-cols-4 gap-4 mt-8 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 1].map((degree, index) => (
                <button
                  key={degree}
                  className={`rounded-2xl py-2 px-4 shadow-sm shadow-gray-400 ${
                    buttonColors[index] || "bg-white hover:shadow-gray-800"
                  }`}
                  onClick={() => handleGuess(degree)}
                  style={{ transition: "background-color 0.3s" }}
                >
                  <h1>{degree}</h1>
                </button>
              ))}
            </div>

            <div className="flex flex-col justify-start items-center w-full h-24 mt-12 gap-8">
              <button onClick={() => setDronePlaying(!dronePlaying)}>
                {dronePlaying ? "Pause Drone" : "Play Drone"}
              </button>

              {!dronePlaying && (
                <div className="w-full pb-16">
                  <label
                    htmlFor="drone-volume"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Drone Volume
                  </label>
                  <input
                    type="range"
                    id="drone-volume"
                    min="-60"
                    max="5"
                    step="1"
                    value={droneVolume}
                    onChange={(e) => {
                      setDroneVolume(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {droneVolume} dB
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
