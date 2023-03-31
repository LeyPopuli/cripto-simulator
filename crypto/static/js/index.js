let spinner;

function getTransactions() {
    spinner.classList.remove('off');

    fetch('http://127.0.0.1:5000/api/v1/transaction', {
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
        .then(response => showTransaction(response))
        .catch(error => window.alert("An error occurred, try again later."));
};

function showTransaction(response) {

    const transactions = response.results;

    let html = '';
    for (let i = 0; i < transactions.length; i = i + 1) {
        const transaction = transactions[i];

        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

        const formater = new Intl.NumberFormat('es-ES', options);
        const destinationCurrencyFormated = formater.format(transaction.destination_amount);
        const originCurrencyFormated = formater.format(transaction.origin_amount);
        const unitPriceFormated = formater.format(transaction.origin_amount / transaction.destination_amount)


        html = html + `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.time}</td>
                <td>${transaction.origin_currency}</td>
                <td>${originCurrencyFormated}</td>
                <td>${transaction.destination_currency}</td>
                <td>${destinationCurrencyFormated}</td>
                <td>${unitPriceFormated}</td>
            </tr>
            `;
    };

    const table = document.querySelector('#table-body');
    table.innerHTML = html;

    spinner.classList.add('off');

}

window.onload = function () {
    spinner = document.querySelector('#spinner');

    getTransactions();
};