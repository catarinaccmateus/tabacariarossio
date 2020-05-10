
export default function calculateTotalBasket() {
  const prices = document.getElementsByClassName('price')
  let total = 0;
  for (let element of prices) {
    total += parseFloat(element.innerText).toFixed(2)*1;
  }
  return total;
}