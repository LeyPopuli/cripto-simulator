const purchaseForm = document.querySelector('#purchase-form');

purchaseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = getFormPurchaseData();
    fetch('http://127.0.0.1:5000/api/v1/exchange', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        })
        .then(data => showCalculation(data))
        .catch(error => showToast('ERROR', 'An error ocurred, try again later.'));
});

const hiddenForm = document.querySelector('#hidden-form');

hiddenForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = getFormPurchaseData();
    data.targetAmount = document.querySelector('#newamount').value;
    fetch('http://127.0.0.1:5000/api/v1/transaction', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        })
        .then(data => {
            showToast('Success', 'Transaction saved.');
        })
        .catch(error => showToast('ERROR', 'An error ocurred, try again later.'));
});

const destinationCurrencySelect = document.getElementById('destination_currency');
const originCurrencySelect = document.getElementById('origin_currency');

function validateCurrencies() {
    const originCurrencyValue = originCurrencySelect.value;
    const destinationCurrencyValue = destinationCurrencySelect.value;

    if (originCurrencyValue === destinationCurrencyValue) {
        destinationCurrencySelect.classList.add('error');
        originCurrencySelect.classList.add('error');
        showToast('WARNING', 'Please select different currencies for origin and destination.');
    } else {
        destinationCurrencySelect.classList.remove('error');
        originCurrencySelect.classList.remove('error');
    }
}

const checkButton = document.getElementById('check-button');
let formErrors = document.querySelectorAll('.error');

function validateForm() {
    formErrors = document.querySelectorAll('.error');
    if (formErrors.length > 0) {
        checkButton.disabled = true;
    } else {
        checkButton.disabled = false;
    }
}

purchaseForm.addEventListener('change', validateForm);

originCurrencySelect.addEventListener('change', function () {
    validateForm();
    validateCurrencies();
});

destinationCurrencySelect.addEventListener('change', function () {
    validateForm();
    validateCurrencies();
});

function getFormPurchaseData() {
    const originCurrency = document.querySelector('#origin_currency').value;
    const destinationCurrency = document.querySelector('#destination_currency').value;
    const amount = document.querySelector('#amount').value;
    const data = {
        originCurrency,
        destinationCurrency,
        amount
    };
    return data;
}

function showCalculation(data) {
    const hiddenform = document.querySelector('#hidden-form');
    hiddenform.style.display = 'block';

    const hiddenNewrate = document.querySelector('#newrate');
    const hiddenNewamount = document.querySelector('#newamount');
    const rateFormated = data.newrate.toFixed(6);
    const finalAmountFormated = data.newfinalamount.toFixed(6);
    hiddenNewrate.value = rateFormated;
    hiddenNewamount.value = finalAmountFormated;

    disablePurchaseForm();
}

function disablePurchaseForm() {
    const originCurrency = document.querySelector('#origin_currency');
    const destinationCurrency = document.querySelector('#destination_currency');
    const amount = document.querySelector('#amount');

    originCurrency.setAttribute("disabled", "true");
    destinationCurrency.setAttribute("disabled", "true");
    amount.setAttribute("disabled", "true");
}

function reloadPage(event) {
    event.preventDefault();
    location.reload();
}