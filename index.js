const sequence = [];
let sequenceIndex = 0;
let playing = false;
const innerCircle = document.querySelector('.inner-circle');

innerCircle.addEventListener('click', playSequence);

document.querySelectorAll('.pad').forEach(pad => {
  pad.addEventListener('mousedown', handleMouseDown);
  pad.addEventListener('mouseup', handleMouseUp);
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handleMouseDown() {
  this.classList.add('active');
};

function handleMouseUp() {
  this.classList.remove('active');
  if (sequence.length == 0) return;
  const { number } = this.dataset;
  if (number != sequence[sequenceIndex]) return gameOver();
  if (sequenceIndex == sequence.length - 1) {
    setTimeout(() => playSequence(), 1000);
    innerCircle.innerHTML = `${sequence.length}`;
  };
  sequenceIndex++;
};

function handleTransitionEnd() {
  if (playing) this.classList.remove('active');
};

function playSequence() {
  playing = true;
  if (sequence.length == 0) {
    innerCircle.innerHTML = '';
    innerCircle.removeEventListener('click', playSequence);
  };
  const randomNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  sequence.push(randomNum);
  sequence.forEach((number, index) => {
    setTimeout(() => {
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
      if (index == sequence.length - 1) setTimeout(() => playing = false, 275);
    }, (index + 1) * 750)
  })
  sequenceIndex = 0;
};

function gameOver() {
  innerCircle.innerHTML = 'GAME OVER';
  innerCircle.removeEventListener('click', playSequence);
  setTimeout(() => {
    innerCircle.innerHTML = 'START';
    innerCircle.addEventListener('click', playSequence);
  }, 1500)
  sequence.splice(0);
  sequenceIndex = 0;
};