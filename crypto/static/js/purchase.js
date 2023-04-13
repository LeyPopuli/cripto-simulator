const originCurrencies = document.querySelector('#origin_currency');
const destinationCurrencies = document.querySelector('#destination_currency');
let availableBalance = {};

function getCurrencies() {
    fetch('http://127.0.0.1:5000/api/v1/status?type=wallet', {
        method: 'GET',
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
        .then(response => {
            availableBalance = response.totals;
            accountingCurrency = response.accountingCurrency;
            showOriginCurrencies(response);
            showDestinationCurrencies(response);
        }).catch(error => showToast('ERROR', 'An error ocurred loading currencies, try again later.'));
};

function showOriginCurrencies(response) {
    let currencies = [];
    let html = '';

    for (let currency in response.totals) {
        currencies.push(currency)
    }
    if (currencies.indexOf(response.accountingCurrency) == -1) {
        html += `<option value="${response.accountingCurrency}">${response.accountingCurrency}</option>`;
    }
    for (let currency in currencies) {
        html += `<option value="${currencies[currency]}">${currencies[currency]}</option>`;
    }

    originCurrencies.innerHTML = html;
};

function showDestinationCurrencies(response) {
    let html = '';
    const currencies = response.allCurrencies;

    for (let currency in response.allCurrencies) {
        html += `<option value="${currencies[currency]}">${currencies[currency]}</option>`;
    }

    destinationCurrencies.innerHTML = html;
};


const purchaseForm = document.querySelector('#purchase-form');

purchaseForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm()) {
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
    }
});

purchaseForm.addEventListener('change', function (event) {
    destinationCurrencySelect.classList.remove('error');
    originCurrencySelect.classList.remove('error');
    amount.classList.remove('error');
    checkButton.disabled = false;
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
            showToast('SUCCESS', 'Transaction saved.');
        })
        .then(() => {
            defaultPurchaseForm();
            getContent();
            getCurrencies();
        }).catch(error => showToast('ERROR', 'An error ocurred, try again later.'));
});

const destinationCurrencySelect = document.getElementById('destination_currency');
const originCurrencySelect = document.getElementById('origin_currency');
const amount = document.querySelector('#amount');
const checkButton = document.getElementById('check-button');


function validateData() {
    const originCurrencyValue = originCurrencySelect.value;
    const destinationCurrencyValue = destinationCurrencySelect.value;
    const amountValue = Number(amount.value);

    if (originCurrencyValue === destinationCurrencyValue) {
        destinationCurrencySelect.classList.add('error');
        originCurrencySelect.classList.add('error');
        showToast('WARNING', 'Please select different currencies for origin and destination.');
        return false;
    } else {
        destinationCurrencySelect.classList.remove('error');
        originCurrencySelect.classList.remove('error');
        if (amountValue <= 0) {
            amount.classList.add('error');
            showToast('WARNING', 'Please select a positive amount > 0.');
            return false;
        } else if (amountValue > availableBalance[originCurrencyValue] && originCurrencyValue != accountingCurrency) {
            amount.classList.add('error');
            showToast('WARNING', 'Amount is greater than available balance.');
            return false;
        } else {
            amount.classList.remove('error');
            return true;
        }
    }
}

function validateForm() {

    isValid = validateData();
    if (isValid) {
        checkButton.disabled = false;
    } else {
        checkButton.disabled = true;
    }
    return isValid;
}

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

function defaultPurchaseForm() {
    const originCurrency = document.querySelector('#origin_currency');
    const destinationCurrency = document.querySelector('#destination_currency');
    const amount = document.querySelector('#amount');

    originCurrency.removeAttribute("disabled");
    destinationCurrency.removeAttribute("disabled");
    amount.removeAttribute("disabled");

    amount.value = 0;

    const hiddenform = document.querySelector('#hidden-form');
    hiddenform.style.display = 'none';
}

function reloadPage(event) {
    event.preventDefault();
    defaultPurchaseForm();
}

window.addEventListener("load", function () {
    getCurrencies();
    defaultPurchaseForm();
});