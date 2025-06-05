export const handleReproduirClick = (partitura, button) => {
  let delay = 0;
  const duracio = partitura.notes.length * 1000;
  let tempsFaltant = duracio / 1000;
  console.log(partitura.notes);

  button.textContent = `${tempsFaltant}s`;
  button.disabled = true;

  const interval = setInterval(() => {
    tempsFaltant -= 0.1;
    button.textContent = `${tempsFaltant.toFixed(2)}s`;
  }, 100);

  partitura.notes.forEach((nota) => {
    setTimeout(() => {
      const audio = document.getElementById(`audio-${nota.nom}`);
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    }, delay);
    delay += 1000;
  });

  setTimeout(() => {
    clearInterval(interval);
    button.textContent = "Reproduir cançó";
    button.disabled = false;
  }, duracio);
};
