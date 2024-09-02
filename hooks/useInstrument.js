import { useState, useEffect } from "react";
import Soundfont from "soundfont-player";
import * as Tone from "tone";

export function useInstrument(instrumentName, octave = 3) {
  const [instrument, setInstrument] = useState(null);
  const [droneInstrument, setDroneInstrument] = useState(null);
  const [droneVolume, setDroneVolume] = useState(-28); // Default volume in dB

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ac = new window.AudioContext();
      Soundfont.instrument(ac, instrumentName).then((loadedInstrument) => {
        setInstrument(loadedInstrument);
      });
    }
  }, [instrumentName]);

  useEffect(() => {
    const volumeNode = new Tone.Volume(droneVolume).toDestination();
    const newDroneInstrument = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 1, decay: 0, sustain: 1, release: 1 },
    }).connect(volumeNode);

    setDroneInstrument(newDroneInstrument);

    return () => {
      if (droneInstrument) {
        droneInstrument.dispose();
      }
    };
  }, [droneVolume]);

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
    if (droneInstrument) {
      droneInstrument.triggerAttack(
        Tone.Frequency(tonic + octave).toFrequency()
      );
    }
  };

  const stopDrone = () => {
    if (droneInstrument) {
      droneInstrument.triggerRelease();
    }
  };

  return { playChord, playNote, startDrone, stopDrone };
}
