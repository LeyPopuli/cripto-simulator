const statusForm = document.querySelector('#status-form');

function getStatus() {
    fetch('http://127.0.0.1:5000/api/v1/status?type=status', {
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
            showStatus(response);
            showChart(response);
        })
        .catch(error => showToast('ERROR', 'An error ocurred during status calculation, try again later.'));
};

function showStatus(response) {
    const calculatedInvestment = response.investment;
    const investment = document.querySelector('#investment');
    investment.value = calculatedInvestment.toFixed(6);

    const calculatedCurrentValue = response.currentValue;
    const currentValue = document.querySelector('#currentvalue');
    currentValue.value = calculatedCurrentValue.toFixed(6);
};

function showChart(response) {

    const cryptoBalance = response.cryptoBalance;

    const accountingCurrency = response.accountingCurrency;

    const cryptoData = Object.keys(cryptoBalance).map((currency) => {
        return {
            name: currency,
            y: cryptoBalance[currency]
        };
    });

    Highcharts.chart('chart', {
        chart: {
            type: 'pie'
        },
        credits: {
            enabled: false
        },
        title: {
            text: `Value in ${accountingCurrency} of cryptocurrencies`,
            style: {
                fontFamily: 'Raleway, sans-serif',
                fontSize: '25px',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: Object.keys(cryptoBalance),
            labels: {
                style: {
                    fontFamily: 'Open Sans, sans-serif',
                    color: '#444444'
                }
            }
        },
        yAxis: {
            title: {
                text: `Value in ${accountingCurrency}`,
                style: {
                    fontFamily: 'Open Sans, sans-serif',
                    color: '#444444'
                }
            }
        },
        series: [{
            name: `Value in ${accountingCurrency}`,
            data: cryptoData,
            color: '#5f7ae7'
        }]
    });

};


window.addEventListener("load", function () {
    getStatus();
});
