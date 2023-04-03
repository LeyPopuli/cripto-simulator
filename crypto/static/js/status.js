const statusForm = document.querySelector('#status-form');

function getStatus() {
    fetch('http://127.0.0.1:5000/api/v1/status', {
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
        .then(response => showStatus(response))
        .catch(error => window.alert("An error occurred, try again later."));
};

function showStatus(response) {
    const calculatedInvestment = response.investment;
    const investment = document.querySelector('#investment');
    investment.value = calculatedInvestment.toFixed(2);
};

window.onload = function () {
    getStatus();
};
