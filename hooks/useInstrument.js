import { useState, useEffect } from "react";
import Soundfont from "soundfont-player";

export function useInstrument(instrumentName) {
  const [instrument, setInstrument] = useState(null);
  const [loadingInstrument, setLoadingInstrument] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ac = new window.AudioContext();
      setLoadingInstrument(true);
      Soundfont.instrument(ac, instrumentName).then((loadedInstrument) => {
        setLoadingInstrument(false);
        setInstrument(loadedInstrument);
      });
    }
  }, [instrumentName]);

  const playChord = (notes) => {
    notes.forEach((note) => {
      playNote(note);
    });
  };

  const playNote = (note, duration = 1.0, release = 1.0) => {
    if (instrument) {
      instrument.play(note, 0, {
        duration: duration,
        release: release,
      });
    }
  };

  return {
    playChord,
    playNote,
    loadingInstrument,
  };
}
