const pads = document.querySelectorAll('.pad');
const sequence = [];

window.onload = function() {
  startGame();
};

pads.forEach(pad => {
  pad.addEventListener('click', handlePadClick)
  pad.addEventListener('transitionend', handleTransitionEnd);
});

function handlePadClick() {
  const { number } = this.dataset;
  console.log('number: ', number);
};

function handleTransitionEnd() {
  console.log('heyoo');
}

function startGame() {
  sequence.push(1);
  sequence.forEach(number => {
    const pad = document.querySelector(`[data-number='${number}']`);
    pad.classList.add('active');
    setTimeout(() => pad.classList.remove('active'), 250);
  })
};