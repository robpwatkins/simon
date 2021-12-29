const pads = document.querySelectorAll('.pad');
const sequence = [];

document.querySelector('.inner-circle').addEventListener('click', playSequence);

pads.forEach(pad => {
  pad.addEventListener('click', handlePadClick)
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handlePadClick() {
  const { number } = this.dataset;
  this.classList.add('active');
  if (checkSequence(number)) return playSequence();
  console.log('Game over!');
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
  console.log('sequence: ', sequence);
  sequence.forEach((number, index) => {
    setTimeout(() => {
      const pad = document.querySelector(`[data-number='${number}']`);
      pad.classList.add('active');
    }, index * 1000)
  })
};