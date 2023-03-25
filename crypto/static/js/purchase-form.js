const form = document.querySelector('#purchase-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const originCurrency = formData.get('origin_currency');
    const destinationCurrency = formData.get('destination_currency');
    const amount = formData.get('amount');
    const data = {
        originCurrency,
        destinationCurrency,
        amount
    };
    fetch('http://127.0.0.1:5000/api/v1/exchanges', {
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

function showCalculation(data) {
    const hiddenform = document.querySelector('#hidden-form');
    hiddenform.style.display = 'block';

    const hiddenNewrate = document.querySelector('#newrate');
    const hiddenNewamount = document.querySelector('#newamount');
    const rateFormated = data.newrate.toFixed(2);
    const finalAmountFormated = data.newfinalamount.toFixed(2);
    hiddenNewrate.value = rateFormated;
    hiddenNewamount.value = finalAmountFormated;

}

document.getElementById("rejectbtn").addEventListener("click", function () {
    location.reload();
});
