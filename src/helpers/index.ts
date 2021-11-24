export const totesRando: (min: number, max: number) => number = (min, max) => {
  // to generate random function
  return Math.random() * (max - min) + min
}
