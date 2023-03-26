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
        .catch(error => window.alert("An error occurred, try again later."));
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
            window.alert("Transaction saved.");
            location.reload();
        })
        .catch(error => window.alert("An error occurred, try again later."));
});

function getFormPurchaseData() {
    const formData = new FormData(purchaseForm);
    const originCurrency = formData.get('origin_currency');
    const destinationCurrency = formData.get('destination_currency');
    const amount = formData.get('amount');
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

}

