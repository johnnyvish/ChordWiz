"use client";

import { useState, useEffect, useRef } from "react";
import { instruments, tonics, modes } from "@/Constants";
import { getRandomChord } from "@/Utils";
import { useInstrument } from "@/hooks/useInstrument";
import DropdownSelection from "@/components/DropdownSelection";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosMusicalNotes } from "react-icons/io";
import { gsap } from "gsap";

export default function Home() {
  const [mode, setMode] = useState("Major");
  const [tonic, setTonic] = useState("C");
  const [currentChord, setCurrentChord] = useState({
    notes: ["C4", "E4", "G4"],
    degree: 1,
  });

  const [round, setRound] = useState(0);
  const [instrumentName, setInstrumentName] = useState("acoustic_grand_piano");
  const [buttonColors, setButtonColors] = useState(Array(8).fill(""));
  const [storedPreferencesLoaded, setStoredPreferencesLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const loadingBarRef = useRef(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const { playChord, loadingInstrument } = useInstrument(instrumentName);

  useEffect(() => {
    if (showLoading && loadingBarRef.current) {
      gsap.to(loadingBarRef.current, {
        width: "100%",
        duration: 3,
        ease: "power4.inOut",
        onComplete: () => setShowLoading(false),
      });
    }
  }, [showLoading]);

  // Load preferences from localStorage on initial client-side render
  useEffect(() => {
    const savedInstrument = localStorage.getItem("instrumentName");
    const savedTonic = localStorage.getItem("tonic");
    const savedMode = localStorage.getItem("mode");

    if (savedInstrument) setInstrumentName(savedInstrument);
    if (savedTonic) setTonic(savedTonic);
    if (savedMode) setMode(savedMode);

    setStoredPreferencesLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (storedPreferencesLoaded) {
      localStorage.setItem("instrumentName", instrumentName);
      localStorage.setItem("tonic", tonic);
      localStorage.setItem("mode", mode);
    }
  }, [storedPreferencesLoaded, instrumentName, tonic, mode]);

  useEffect(() => {
    if (round > 0) {
      const { chordNotes, chordDegree } = getRandomChord(tonic, mode);

      setCurrentChord({
        notes: chordNotes,
        degree: chordDegree,
      });

      playChord(chordNotes);
      setButtonColors(Array(8).fill(""));
    }
  }, [round, mode, tonic]);

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

  const handleYoutubeUrlSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(youtubeUrl);
    if (videoId) {
      setVideoId(videoId);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen">
      {showLoading ? (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 text-center">
            Loading
          </h1>
          <div className="flex justify-center items-center gap-4 md:gap-8 w-full">
            <div className="w-[50%] md:w-[35%] h-4 md:h-12 bg-gray-200 rounded-md overflow-hidden relative">
              <div
                ref={loadingBarRef}
                className="h-full bg-gray-800 rounded-md"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full h-screen">
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
                  disabled={loadingInstrument}
                  className="w-full bg-gray-800 flex justify-center items-center pb-4 pt-2 rounded-xl"
                >
                  <p className="text-4xl text-white">Begin</p>
                </button>
                {loadingInstrument && (
                  <h2 className="text-md">Loading instrument...</h2>
                )}
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
                      key={index}
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

                <form
                  onSubmit={handleYoutubeUrlSubmit}
                  className="w-full mt-10 md:mt-16"
                >
                  <label
                    htmlFor="youtube-url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    YouTube URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-sm"
                      placeholder="Paste url here"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    >
                      Load
                    </button>
                  </div>
                </form>
                {videoId && (
                  <div className="w-full mt-4">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
