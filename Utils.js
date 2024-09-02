import { notes, scaleMajorIntervals, scaleMinorIntervals } from "./Constants";

// calculate the scale notes from the tonic and the mode
export const getScaleNotes = (tonic, mode) => {
  const scale = mode === "Major" ? scaleMajorIntervals : scaleMinorIntervals;
  const tonicIndex = notes.indexOf(tonic);
  const scaleNotes = scale.map((interval) => {
    const noteIndex = (tonicIndex + interval) % notes.length;
    return notes[noteIndex];
  });

  return scaleNotes;
};

// get a random chord from the current scale notes
export const getRandomChord = (currentScaleNotes, mode) => {
  const randomIndex = Math.floor(Math.random() * currentScaleNotes.length);
  const chordNotes = [
    currentScaleNotes[randomIndex],
    currentScaleNotes[(randomIndex + 2) % currentScaleNotes.length],
    currentScaleNotes[(randomIndex + 4) % currentScaleNotes.length],
  ];

  const chordDegree = randomIndex + 1;
  const chordQuality = getChordQuality(chordDegree, mode);

  return {
    chordNotes,
    chordDegree,
    chordQuality,
  };
};

// get the quality of a chord from its degree
export const getChordQuality = (chordDegree, mode) => {
  if (mode === "Major") {
    return [1, 4, 5].includes(chordDegree)
      ? "Major"
      : [2, 3, 6].includes(chordDegree)
      ? "Minor"
      : "Diminished";
  } else {
    // Minor mode
    return [3, 6, 7].includes(chordDegree)
      ? "Major"
      : [1, 4, 5].includes(chordDegree)
      ? "Minor"
      : "Diminished";
  }
};
