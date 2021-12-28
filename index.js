const pads = document.querySelectorAll('.pad');

pads.forEach(pad => pad.addEventListener('click', handlePadClick));

function handlePadClick() {
  const { number } = this.dataset;
  console.log('number: ', number);
};
