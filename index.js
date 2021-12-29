const pads = document.querySelectorAll('.pad');
const simonSequence = [];
const playerSequence = [];

document.querySelector('.inner-circle').addEventListener('click', playSequence);

pads.forEach(pad => {
  pad.addEventListener('click', handlePadClick)
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handlePadClick() {
  const { number } = this.dataset;
  this.classList.add('active');
  playerSequence.push(number);
  if (checkSequence()) return playSequence();
  console.log('Game over!');
};

function checkSequence() {
  let i = 0;
  while (i < simonSequence.length) {
    if (playerSequence[i] == simonSequence[i]) i++;
    else return false;
  }
  return true;
};

function handleTransitionEnd() {
  this.classList.remove('active');
};

function playSequence() {
  const randomNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  simonSequence.push(randomNum);
  simonSequence.forEach((number, index) => {
    setTimeout(() => {
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
    }, index * 1000)
  })
};