const pads = document.querySelectorAll('.pad');
const sequence = [];
let sequenceIdx = 0;

document.querySelector('.inner-circle').addEventListener('click', playSequence);

pads.forEach(pad => {
  pad.addEventListener('click', handlePadClick)
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handlePadClick() {
  const { number } = this.dataset;
  this.classList.add('active');
  if (number != sequence[sequenceIdx]) return gameOver();
  if (sequenceIdx == sequence.length - 1) setTimeout(() => playSequence(), 1000);
  sequenceIdx++;
};

function handleTransitionEnd() {
  this.classList.remove('active');
};

function playSequence() {
  const randomNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  sequence.push(randomNum);
  console.log('sequence: ', sequence)
  sequence.forEach((number, index) => {
    setTimeout(() => {
      console.log('number: ', number);
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
    }, index * 1000)
  })
  sequenceIdx = 0;
};

function gameOver() {
  sequence.splice();
  sequenceIdx = 0;
  console.log('Game over!');
}