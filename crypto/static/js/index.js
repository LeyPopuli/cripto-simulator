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
        .catch(error => showToast('ERROR', 'An error ocurred in retrieving or displaying transactions, try again later.'));
};

function showTransaction(response) {

    const transactions = response.results;
    const table = document.querySelector('#table-body');

    let html = '';

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


        html += `
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

    if (transactions.length === 0) {
        html += `
            <tr>
                <td id="no-transactions-text" colspan="7">
                No transactions &#10132; <strong><a href="http://127.0.0.1:5000/purchase">New purchase</a></strong>
            </td>
            </tr>
            `;
        table.innerHTML = html;
    } else {
        table.innerHTML = html;
        pagination();
    };

    spinner.classList.add('off');

};

function pagination() {
    $('#transactions-table').dataTable({
        "pageLength": 10,
        "pagingType": "simple_numbers",
        "language": {
            "lengthMenu": "Show _MENU_ transactions per page",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoFiltered": "(filtered from _MAX_ total transactions)",
            "search": "Search: ",
            "paginate": {
                "first": "First",
                "last": "Last",
                "next": "Next",
                "previous": "Previous"
            }
        }
    });
};

window.addEventListener("load", function () {
    spinner = document.querySelector('#spinner');

    getTransactions();
});