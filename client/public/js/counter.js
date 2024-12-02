
const counters = document.querySelectorAll('[quantity_counter]');
var inputs = document.querySelectorAll(".counter_input input");
var prices = document.querySelectorAll(".product_price");
var sum_input = document.querySelector(".sum input");
var number_input = document.querySelector(".number input");
var frm = document.getElementById('frm');
var sum = 0;
var number = 0;
for (var i = 0; i <inputs.length; i++) {
  number += Number(inputs[i].value);
}
for (var i = 0; i <prices.length; i++) {
  sum += Number(inputs[i].value) * Number(prices[i].innerText.substring(6, prices[i].innerText.length-1));
}
if(!isNaN(sum))
{
  sum_input.value = sum + "₽";
}
if(!isNaN(number))
{
  number_input.value = number + " шт.";
}
if (counters)
{
    counters.forEach(counter => {
        counter.addEventListener('click', e =>{
            const target = e.target;
            if(target.closest(".plus_button")){
                let value = parseInt(target.closest('.counter').querySelector('input').value);
                value++;
                if(value >= 10)
                {
                    value = 10;
                }
                target.closest('.counter').querySelector('input').value = value;
            }
            else if(target.closest(".minus_button")){
                let value = parseInt(target.closest('.counter').querySelector('input').value);
                value--;
                if(value <= 0)
                {
                    value = 0;
                }
                console.log(number);
                target.closest('.counter').querySelector('input').value = value;
            }
            number = 0;
            for (var i = 0; i <inputs.length; i++) {
              number += Number(inputs[i].value);
            }

            sum = 0;
            for (var i = 0; i <prices.length; i++) {
              sum += Number(inputs[i].value) * Number(prices[i].innerText.substring(6, prices[i].innerText.length-1));
            }

            if(!isNaN(sum))
            {
              sum_input.value = sum + "₽";
            }
            if(!isNaN(number))
            {
              number_input.value = number + " шт.";
            }
            const productDivs = document.querySelectorAll('.products .product');
            productDivs.forEach(productDiv => {
                const input = productDiv.querySelector('.counter input');
                input.style.background = (parseInt(input.value) > 0) ? 'rgb(214, 255, 149)' : 'white';
                productDiv.style.background = (parseInt(input.value) > 0) ? 'rgb(214, 255, 149)' : 'white';
            });
        })
    })
}
frm.addEventListener('submit', function(event) {
  event.preventDefault();
  const value = create_response_string();
  const hiddenInput = document.getElementById('hidden_input');
  hiddenInput.value = value;
  const er = document.getElementById('order_error');
  if (number != 0)
  {
    frm.submit();
  }
  else
  {
    console.log("flex");
    er.style.display = "flex";
  }

});


function create_response_string() {
  let result = '';

  const counterInputs = document.querySelectorAll('.counter_input input');

  counterInputs.forEach(input => {
      const quantity = parseInt(input.value);
      if (quantity > 0) {
          const productName = input.closest('.product').querySelector('.product_name').innerText;
          result += productName + "_" + quantity + "шт., ";
      }
  });
  if(result.length > 2)
  {
      result = result.substring(0, result.length - 2);
  }
  return result;
}