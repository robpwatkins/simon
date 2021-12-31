const sequence = [];
let sequenceIndex = 0;
let playing = false;
const pads = document.querySelectorAll('.pad');
const innerCircle = document.querySelector('.inner-circle');
// const fx = document.querySelector('.fx');
// let fxEnabled = true;

pads.forEach(pad => {
  pad.addEventListener('mousedown', handleMouseDown);
  pad.addEventListener('mouseup', handleMouseUp);
  pad.addEventListener('transitionend', handleTransitionEnd);
  // fx.addEventListener('click', handleFXClick);
});

innerCircle.addEventListener('click', startGame);

function startGame() {
  innerCircle.removeEventListener('click', startGame);
  innerCircle.innerHTML = '';
  setTimeout(() => playSequence(), 750);
};

// function handleFXClick() {
//   fxEnabled = !fxEnabled;
//   fx.innerHTML = fxEnabled ? 'volume_up' : 'volume_off';
// }

function handleMouseDown() {
  this.classList.add('active');
};

function handleMouseUp() {
  this.classList.remove('active');
  if (sequence.length == 0) return;
  const { number } = this.dataset;
  if (number != sequence[sequenceIndex]) {
    this.style.transition = 'none';
    return gameOver();
  };
  if (sequenceIndex == sequence.length - 1) {
    setTimeout(() => playSequence(), 750);
    innerCircle.innerHTML = `${sequence.length}`;
  };
  sequenceIndex++;
};

function handleTransitionEnd() {
  if (playing) this.classList.remove('active');
};

function playSequence() {
  playing = true;
  const randomNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  sequence.push(randomNum);
  sequence.forEach((number, index) => {
    setTimeout(() => {
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
      if (index == sequence.length - 1) setTimeout(() => playing = false, 275);
    }, index * 750)
  })
  sequenceIndex = 0;
};

function gameOver() {
  innerCircle.innerHTML = 'GAME OVER';
  flashAll();
  setTimeout(() => {
    innerCircle.innerHTML = 'START';
    innerCircle.addEventListener('click', playSequence);
  }, 2000)
  sequence.splice(0);
  sequenceIndex = 0;
};

function flashAll() {
  playing = true;
  let count = 0;
  while (count < 3) {
    setTimeout(() => {
      pads.forEach(pad => {
        pad.style.transition = 'all .25s';
        pad.classList.add('active');
      });
      if (count == 3) {
        setTimeout(() => playing = false, count * 350);
      }
    }, count * 350)
    count++;
  }
}