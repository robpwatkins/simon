const sequence = [];
let sequenceIndex = 0;
const delay = 750;
let playing = false;
const pads = document.querySelectorAll('.pad');
const innerCircle = document.querySelector('.inner-circle');
const fxSwitch = document.querySelector('.fx-switch');
const fx = document.querySelector('#fx');
let fxEnabled = true;
let gameStarted = false;
var context;
var saved;

try {
    context = new (window.AudioContext || window.webkitAudioContext)();
}
catch (e) {
    console.log("Your browser doesn't support Web Audio API");
}

if (saved) {
    playSound(saved);
} else {
    loadSound();
}

//loading sound into the created audio context
function loadSound() {
    //set the audio file's URL
    var audioURL = '/sounds/simon_full.mp3';

    //creating a new request
    var request = new XMLHttpRequest();
    request.open('GET', audioURL, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        //take the audio from http request and decode it in an audio buffer
        context.decodeAudioData(request.response, function (buffer) {
            // save buffer, to not load again
            saved = buffer;
            // play sound
            playSound(buffer);
        });
    };
    request.send();
}

function doIt() {
  console.log(saved);
  playSound(saved);
};

doIt();

//playing the audio file
function playSound(buffer) {
    //creating source node
    var source = context.createBufferSource();
    //passing in data
    source.buffer = buffer;
    //giving the source which sound to play
    source.connect(context.destination);
    //start playing
    source.start(0);
}

pads.forEach(pad => {
  pad.addEventListener('mousedown', handleMouseDown);
  pad.addEventListener('mouseup', handleMouseUp);
  pad.addEventListener('transitionend', handleTransitionEnd);
  fxSwitch.addEventListener('click', handleFXSwitchClick);
});

document.querySelectorAll('.pad-fx').forEach(fx => fx.volume = 0.5);

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

function handleMouseDown() {
  if (playing) return;
  const number = Number(this.dataset.pad_number);
  if (gameStarted && number != sequence[sequenceIndex]) return gameOver();
  if (fxEnabled) {
    fx.currentTime = Number(number);
    fx.play();
    setInterval(() => {
      if (fx.currentTime.toFixed(1) == number + .6) fx.pause();
    }, 100)
  }
  this.classList.add('active');
};

function handleMouseUp() {
  if (playing) return;
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
        // const fx = document.querySelector(`[data-fx_number='${number}']`);
        fx.currentTime = number;
        fx.play();
        setTimeout(() => fx.pause(), 600);
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
  // const fx = document.querySelector('[data-fx_number="5"]');
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
        setInterval(() => {
          if (fx.currentTime.toFixed(1) == 0.6) fx.pause();
        }, 100)
      }
    }, count * 350)
    count++;
  }
}