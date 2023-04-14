function showToast(type, message) {
    const toastEl = document.getElementById('toast');
    const titleEl = toastEl.querySelector('.toast-header strong');
    const messageEl = toastEl.querySelector('.toast-body');

    titleEl.textContent = type;
    messageEl.textContent = message;
    toastEl.classList.remove('ok');
    toastEl.classList.remove('fail');


    if (type === "SUCCESS") {
        toastEl.classList.add('ok');

    } else {
        toastEl.classList.add('fail');
    }

    toastEl.classList.add('show');

    setTimeout(() => {
        toastEl.classList.remove('show');

    }, 5000);
}

function closeToast() {
    const toastEl = document.getElementById('toast');
    toastEl.classList.remove('show');
}

const walletContent = document.querySelector('#wallet-content');

function getContent() {
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
        .then(response => showWallet(response))
        .catch(error => showToast('ERROR', 'An error ocurred loading the wallet, try again later.'));
};

function showWallet(response) {
    const totals = response.totals;
    let html = '';

    const optionsFixed = {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
    };

    const formater = new Intl.NumberFormat('es-ES', optionsFixed);

    for (let currency in totals) {
        if (currency != response.accountingCurrency) {
            currencyFormated = formater.format(totals[currency])
            const purchaseUrl = `http://127.0.0.1:5000/purchase?originCurrency=${currency}&amount=${totals[currency]}`;
            html = html + `<a href="${purchaseUrl}"><strong>${currency}</strong> ${currencyFormated}</a>`
        }
    }

    walletContent.innerHTML = html;
};

window.addEventListener("load", function () {
    getContent();
});