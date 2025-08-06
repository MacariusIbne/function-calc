document.getElementById('calculateBtn').addEventListener('click', () => {
  const age = parseInt(document.getElementById('age').value);
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const result = document.getElementById('result');

  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  result.innerText = `Your BMI is ${bmi} (${category})\nAge: ${age}`;
});

