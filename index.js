const pads = document.querySelectorAll('.pad');
const sequence = [];
let sequenceIdx = 0;

document.querySelector('.inner-circle').addEventListener('click', playSequence);

pads.forEach(pad => {
  pad.addEventListener('click', handlePadClick)
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handlePadClick() {
  console.log('heyoo');
  const { number } = this.dataset;
  this.classList.add('active');
  while (sequenceIdx < sequence.length) {
    console.log('sequence: ', sequence);
    console.log('number: ', number);
    if (number != sequence[sequenceIdx]) return gameOver();
    sequenceIdx++;
    playSequence();
  }
};

function checkSequence(number) {
  if (number == sequence[sequence.length - 1]) return true;
  return false;
};

function handleTransitionEnd() {
  this.classList.remove('active');
};

function playSequence() {
  const randomNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  sequence.push(randomNum);
  sequence.forEach((number, index) => {
    setTimeout(() => {
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
    }, index * 1000)
  })
};

function gameOver() {
  sequence.splice();
  console.log('Game over!');
}