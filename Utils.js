import { tonics, notes } from "./Constants";

export const getRandomChord = (tonic, mode) => {
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10];

  // construct the scale based on tonic and mode
  const scale = mode === "Major" ? majorIntervals : minorIntervals;
  const scaleNotes = scale.map((interval) => {
    const noteIndex = (tonics.indexOf(tonic) + interval) % notes.length;
    return notes[noteIndex];
  });

  // randomly select a chord root from the scale
  const randomRootIndex = Math.floor(Math.random() * scaleNotes.length);
  const chordRoot = scaleNotes[randomRootIndex];

  // construct a triad chord
  let chordNotes = [
    chordRoot,
    scaleNotes[(randomRootIndex + 2) % scaleNotes.length],
    scaleNotes[(randomRootIndex + 4) % scaleNotes.length],
  ];

  // determine the chord degree number
  const chordDegree = randomRootIndex + 1;

  // determine if the chord should be inverted (33% chance)
  const inversion = Math.floor(Math.random() * 3); // 0: root position, 1: first inversion, 2: second inversion

  // determine the octave numbers of the chord notes
  let octaves = [3, 3, 3];

  if (chordDegree >= 6) octaves[1] = 4;
  if (chordDegree >= 4) octaves[2] = 4;

  if (inversion === 1) {
    octaves[1] -= 1;
    octaves[2] -= 1;
  }

  if (inversion === 2) {
    octaves[2] -= 1;
  }

  // combine notes with octave numbers
  chordNotes = chordNotes.map((note, index) => `${note}${octaves[index]}`);

  return {
    chordNotes,
    chordDegree,
  };
};
