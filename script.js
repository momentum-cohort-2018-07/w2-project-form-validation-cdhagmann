document
  .getElementById("parking-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    removeErrorMessages();
    var inputDivs = document.getElementsByClassName("input-field");
    for (var inputDiv of inputDivs) {
      inputDiv.classList.remove("input-invalid");
      inputDiv.classList.remove("input-valid");
      isValid = true;
      var invalidInputs = [];
      for (var input of inputDiv.getElementsByTagName("input")) {
        isValid = validateInput(input);
        console.log(input.id, isValid);
        if (!isValid) {
          invalidInputs.push(input);
        }
      }
      if (invalidInputs.length > 0) {
        addErrorMessage(inputDiv, invalidInputs);
      } else {
        inputDiv.classList.add("input-valid");
      }
    }
  });

function addErrorMessage(inputDiv, invalidInputs) {
  inputDiv.classList.add("input-invalid");
  var errorMsgs = [];
  for (var input of invalidInputs) {
    if (input.value.trim() === "") {
      errorMsgs.push(getInputName(input) + " is required");
    } else {
      errorMsgs.push("Invalid " + getInputName(input));
    }
  }

  var errorMsg = document.createElement("div");
  errorMsg.classList.add("input-hint");
  errorMsg.innerText = errorMsgs.join("; ");
  inputDiv.appendChild(errorMsg);
}
function validateInput(input) {
  var inputValue = input.value.trim();
  console.log(input.id, inputValue);
  if (inputValue === "") {
    return false;
  }
  switch (input.id) {
    case "name":
      return true;
    case "car-year":
      return validateCarYear(inputValue);
    case "car-make":
      return true;
    case "car-model":
      return true;
    case "start-date":
      return validateParkingDate(inputValue);
    case "days":
      return validateDays(inputValue);
    case "credit-card":
      return validateCardNumber(inputValue);
    case "cvv":
      return validateCVV(inputValue);
    case "expiration":
      return validateCardDate(inputValue);
    default:
      return true;
  }
}

function getInputName(input) {
  switch (input.id) {
    case "name":
      return "Name";
    case "car-year":
      return "Year";
    case "car-make":
      return "Make";
    case "car-model":
      return "Model";
    case "start-date":
      return "Parking Date";
    case "days":
      return "Number of Days";
    case "credit-card":
      return "Credit Card Number";
    case "cvv":
      return "CVV";
    case "expiration":
      return "Expiration Date";
    default:
      return "";
  }
}

function removeErrorMessages() {
  var errorMsgs = document.querySelectorAll(".input-hint");
  for (var errorMessage of errorMsgs) {
    errorMessage.remove();
  }
}

//     clearError()

//     var name = document.getElementById('name-field').value.trim()

//     // check and make sure name is not empty
//     if (name === '') {
//         showEmptyNameError()
//     } else {
//         document.getElementById('output').innerText = 'Hello, ' + name + '!'
//     }
// })

// function clearError() {
//     var field = document.getElementById('name-field')
//     field.classList.remove('error')
//     // same as: field.parentElement.getElementsByClassName('.error-msg')[0]
//     var errorMsg = field.parentElement.querySelector('.error-msg')
//     if (errorMsg) {
//         errorMsg.remove()
//     }
// }

// function showEmptyNameError() {

// }

function validateCarYear(date) {
  var year = parseInt(date);

  if (isNaN(year)) {
    return false;
  }

  return year > 1900;
}

function validateCVV(number) {
  var reg = /\d{3}/;
  return reg.test(number);
}

function validateDays(number) {
  var reg = /^([1-9]|[12]\d|30)$/;
  return reg.test(number);
}

function validateParkingDate(date) {
  var year = parseInt(date.split("-")[0]);
  var month = parseInt(date.split("-")[1]);
  var day = parseInt(date.split("-")[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }

  var parkingDate = new Date(year, month - 1, day);
  var currentDate = new Date();
  return parkingDate > currentDate;
}

function validateCardDate(date) {
  var year = parseInt("20" + date.split("/")[1]);
  var month = parseInt(date.split("/")[0]);

  if (isNaN(year) || isNaN(month)) {
    return false;
  }

  var cardDate = new Date(year, month - 1);
  var currentDate = new Date();
  return (
    cardDate.getFullYear() >= currentDate.getFullYear() &&
    cardDate.getMonth() >= currentDate.getMonth()
  );
}

function validateCardNumber(number) {
  var regex = new RegExp("^[0-9]{16}$");
  if (!regex.test(number)) return false;

  return luhnCheck(number);
}

function luhnCheck(val) {
  var sum = 0;
  for (var i = 0; i < val.length; i++) {
    var intVal = parseInt(val.substr(i, 1));
    if (i % 2 == 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 == 0;
}
