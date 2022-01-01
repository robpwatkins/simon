const sequence = [];
let sequenceIndex = 0;
const delay = 750;
let playing = false;
const pads = document.querySelectorAll('.pad');
const innerCircle = document.querySelector('.inner-circle');
const fxSwitch = document.querySelector('.fx-switch');
let fxEnabled = true;

pads.forEach(pad => {
  pad.addEventListener('mousedown', handleMouseDown);
  pad.addEventListener('mouseup', handleMouseUp);
  pad.addEventListener('transitionend', handleTransitionEnd);
  fxSwitch.addEventListener('click', handleFXClick);
});

document.querySelectorAll('.pad-fx').forEach(fx => fx.volume = 0.5);

innerCircle.addEventListener('click', startGame);

function startGame() {
  innerCircle.removeEventListener('click', startGame);
  innerCircle.innerHTML = '';
  setTimeout(() => playSequence(), delay);
};

function handleFXClick() {
  fxEnabled = !fxEnabled;
  fxSwitch.innerHTML = fxEnabled ? 'volume_up' : 'volume_off';
}

function handleMouseDown() {
  const { pad_number } = this.dataset;
  if (fxEnabled && pad_number == sequence[sequenceIndex]) {
    const fx = document.querySelector(`[data-fx_number='${pad_number}'`);
    fx.currentTime = 0;
    fx.play();
  }
  this.classList.add('active');
};

function handleMouseUp() {
  this.classList.remove('active');
  if (sequence.length == 0) return;
  const { pad_number } = this.dataset;
  if (pad_number != sequence[sequenceIndex]) {
    this.style.transition = 'none';
    return gameOver();
  };
  if (sequenceIndex == sequence.length - 1) {
    setTimeout(() => playSequence(), delay);
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
      const pad = document.querySelector(`[data-pad_number='${number}']`);
      if (fxEnabled) {
        const fx = document.querySelector(`[data-fx_number='${number}']`);
        fx.currentTime = 0;
        fx.play();
      }
      pad.classList.add('active');
      if (index == sequence.length - 1) setTimeout(() => playing = false, 275);
    }, index * delay)
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
  const fx = document.querySelector('[data-fx_number="5"]');
  while (count < 3) {
    setTimeout(() => {
      if (fxEnabled) {
        fx.currentTime = 0;
        fx.play();
      }
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