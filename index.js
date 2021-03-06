const sequence = [];
let sequenceIndex = 0;
const delay = 750;
let playing = false;
const pads = document.querySelectorAll('.pad');
const innerCircle = document.querySelector('#inner-circle');
const fxSwitch = document.querySelector('.fx-switch');
let fxEnabled = true;
let gameStarted = false;
let savedBuffer;
let source;

const context = new (window.AudioContext || window.webkitAudioContext)();

function loadSound() {
  var request = new XMLHttpRequest();
  request.open('GET', '/sounds/simon_full.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    context.decodeAudioData(request.response, function (buffer) {
      savedBuffer = buffer;
    });
  };
  request.send();
};

context.resume();
loadSound();

function playSound(startTime) {
  source = context.createBufferSource();
  source.buffer = savedBuffer;
  source.connect(context.destination);
  source.start(0, startTime, 1);
};


pads.forEach(pad => {
  pad.addEventListener('pointerdown', handlePointerDown);
  pad.addEventListener('pointerup', handlePointerUp);
  pad.addEventListener('transitionend', handleTransitionEnd);
  fxSwitch.addEventListener('click', handleFXSwitchClick);
});

innerCircle.addEventListener('click', startGame);

function startGame() {
  gameStarted = true;
  innerCircle.removeEventListener('click', startGame);
  innerCircle.innerHTML = '';
  setTimeout(() => playSequence(), delay);
};

function handleFXSwitchClick() {
  fxEnabled = !fxEnabled;
  fxSwitch.innerHTML = fxEnabled ? 'volume_up' : 'volume_off';
}

function handlePointerDown() {
  if (playing) return;
  const number = Number(this.dataset.pad_number);
  if (gameStarted && number != sequence[sequenceIndex]) return gameOver();
  if (fxEnabled) playSound(number);
  this.classList.add('active');
};

function handlePointerUp() {
  console.log('heyoo');
  if (playing) return;
  this.classList.remove('active');
  if (sequence.length == 0) return;
  const { pad_number } = this.dataset;
  if (pad_number != sequence[sequenceIndex]) {
    // this.style.transition = 'none';
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
        playSound(number);
      }
      pad.classList.add('active');
      if (index == sequence.length - 1) setTimeout(() => playing = false, 275);
    }, index * delay)
  })
  sequenceIndex = 0;
};

function gameOver() {
  gameStarted = false;
  innerCircle.innerHTML = 'GAME OVER';
  flashAll();
  setTimeout(() => {
    innerCircle.innerHTML = 'START';
    innerCircle.addEventListener('click', startGame);
  }, 2000)
  sequence.splice(0);
  sequenceIndex = 0;
};

function flashAll() {
  playing = true;
  let count = 0;
  while (count < 3) {
    setTimeout(() => {
      if (fxEnabled) playSound(0);
      pads.forEach(pad => {
        pad.style.transition = `all .${delay / 6}s`;
        pad.classList.add('active');
      });
      if (count == 3) setTimeout(() => playing = false, count * (delay / 3));
    }, count * (delay / 3))
    count++;
  }
}