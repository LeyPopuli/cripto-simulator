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

        html = html + `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.time}</td>
                <td>${transaction.origin_currency}</td>
                <td>${transaction.origin_amount}</td>
                <td>${transaction.destination_currency}</td>
                <td>${transaction.destination_amount}</td>
                <td>Aquí pondré cálculo</td>
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