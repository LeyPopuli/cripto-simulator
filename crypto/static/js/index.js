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
        .catch(error => showToast('ERROR', 'An error ocurred, try again later.'));
};

function showTransaction(response) {

    const transactions = response.results;

    let html = '';

    if (transactions.length === 0) {
        html = html + `
            <tr>
                <td id="no-transactions-text" colspan="7">No transactions</td>
            </tr>
            `;
    } else {

        for (let i = 0; i < transactions.length; i = i + 1) {
            const transaction = transactions[i];

            const optionsFixed = {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
            };

            const formater = new Intl.NumberFormat('es-ES', optionsFixed);
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
        }
    };

    const table = document.querySelector('#table-body');
    table.innerHTML = html;

    spinner.classList.add('off');

}

window.addEventListener("load", function () {
    spinner = document.querySelector('#spinner');

    getTransactions();
});