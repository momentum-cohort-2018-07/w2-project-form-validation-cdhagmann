document
    .getElementById("parking-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        for (var errorMessage of document.querySelectorAll(".input-hint")) {
            errorMessage.remove();
        }
        var inputDivs = document.getElementsByClassName("input-field");
        for (var inputDiv of inputDivs) {
            inputDiv.classList.remove("input-invalid");
            inputDiv.classList.remove("input-valid");

            var invalidInputs = [];
            for (var input of inputDiv.getElementsByTagName("input")) {
                if (!validateInput(input)) {
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
            return validateParkingDate();
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


function validateCarYear(date) {
    var year = parseInt(date);

    if (isNaN(year)) {
        return false;
    }

    return year > 1900;
}

function validateCVV(number) {
    var reg = /^\d{3}$/;
    return reg.test(number);
}

function validateDays(number) {
    var year = parseInt(number);

    if (isNaN(number)) {
        return false;
    }

    return 1 <= number && number <= 30;
}

function getParkingDate() {
    var startDate = document.getElementById('start-date').value.trim();
    var year = parseInt(startDate.split("-")[0]);
    var month = parseInt(startDate.split("-")[1]);
    var day = parseInt(startDate.split("-")[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return;
    }

    return new Date(year, month - 1, day);
}


function validateParkingDate() {
    var parkingDate = getParkingDate();
    var currentDate = new Date();

    if (parkingDate === undefined) {
        return false;
    }

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
    if (cardDate.getFullYear() < currentDate.getFullYear()) {
        return false;
    } else if (cardDate.getFullYear() > currentDate.getFullYear()) {
        return true;
    } else if (cardDate.getMonth() >= currentDate.getMonth() ){
        return true;
    } else {
        return false;
    }
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

function parkingPrice() {
    var parkingDate = getParkingDate();
    if (!parkingDate) {
        return;
    }

    var numDays = parseInt(document.getElementById('days').value.trim());

    if (isNaN(numDays)) {
        return;
    }

    var Cost = 0;
    for (var idx = 0; idx < numDays; idx++) {
        var isWeekEnd = (parkingDate.getDay() % 6 === 0);
        if (isWeekEnd) {
            Cost += 7;
        } else {
            Cost += 5;
        }
        parkingDate.setHours(24);
    }

    var costDiv = document.getElementById('total');
    costDiv.innerText = '$' + Cost;
    return Cost;
}

document
    .getElementById("days")
    .addEventListener("change", function (event) {
        if (validateParkingDate()) {
            parkingPrice();
        }
    });

document
    .getElementById("start-date")
    .addEventListener("change", function (event) {
        if (validateParkingDate()) {
            parkingPrice();
        }
    });