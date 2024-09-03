import { useState, useEffect, useRef } from "react";
import Soundfont from "soundfont-player";

export function useInstrument(instrumentName, octave = 3) {
  const [instrument, setInstrument] = useState(null);
  const [loadingInstrument, setLoadingInstrument] = useState(false);
  const [droneVolume, setDroneVolume] = useState(-28); // Default volume in dB
  const droneAudioRef = useRef(null);

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
      playNote(note + octave);
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

  const startDrone = (tonic) => {
    if (droneAudioRef.current) {
      droneAudioRef.current.pause();
    }

    const audio = new Audio(`/drones/${tonic}-drone.mp3`);
    audio.loop = true;
    audio.volume = Math.pow(10, droneVolume / 20); // Convert dB to linear scale
    audio.play();
    droneAudioRef.current = audio;
  };

  const stopDrone = () => {
    if (droneAudioRef.current) {
      droneAudioRef.current.pause();
      droneAudioRef.current = null;
    }
  };

  useEffect(() => {
    if (droneAudioRef.current) {
      droneAudioRef.current.volume = Math.pow(10, droneVolume / 20);
    }
  }, [droneVolume]);

  return {
    playChord,
    playNote,
    startDrone,
    stopDrone,
    setDroneVolume,
    loadingInstrument,
    droneVolume,
  };
}
