import requests

from config import API_KEY


api_url = 'https://rest.coinapi.io'
endpoint = '/v1/exchangerate'


class APIError(Exception):
    def __init__(self, message):
        self.message = message


class CryptoModel:

    def __init__(self, origin_currency, destination_currency, amount):
        self.origin_currency = origin_currency
        self.destination_currency = destination_currency
        self.origin_amount = float(amount)
        self.exchange_rate = 0.0

    def consult_exchange_rate(self):

        url = f'{api_url}{endpoint}/{self.origin_currency}/{self.destination_currency}?apikey={API_KEY}'
        response = requests.get(url)

        if response.status_code == 200:
            exchange = response.json()
            self.exchange_rate = exchange.get("rate")
            return self.exchange_rate
        else:
            raise APIError(
                f'Error {response.status_code} {response.reason} during API consult'
            )

    def calculate_final_amount(self):
        return self.origin_amount * self.exchange_rate
