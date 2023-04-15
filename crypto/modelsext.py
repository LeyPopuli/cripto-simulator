import requests
from .models import DBManager

from config import API_KEY, ACCOUNTING_CURRENCY


api_url = 'https://rest.coinapi.io'
endpoint = '/v1/exchangerate'


class APIError(Exception):
    def __init__(self, message):
        self.message = message


class ValidationError(Exception):
    pass


class CryptoModel:

    def __init__(self, origin_currency: str, destination_currency: str, amount: float):
        if not isinstance(origin_currency, str) or not origin_currency.strip():
            raise ValueError('Origin currency must be a non-empty string')
        if not isinstance(destination_currency, str) or not destination_currency.strip():
            raise ValueError('Destination currency must be a non-empty string')
        amount = float(amount)
        if not isinstance(amount, (float)) or amount <= 0:
            raise ValueError('Amount must be a positive number')
        self.amount = amount
        self.origin_currency = origin_currency
        self.destination_currency = destination_currency
        self.origin_amount = float(amount)
        self.exchange_rate = 0.0

    def get_available_amount(self):
        query = f'SELECT * FROM `transaction` WHERE origin_currency = "{self.origin_currency}" OR destination_currency = "{self.origin_currency}"'
        db = DBManager()
        transactions = db.run_query(query)
        available_amount = 0.0
        for transaction in transactions:
            if transaction['origin_currency'] == self.origin_currency:
                available_amount -= transaction['origin_amount']
            elif transaction['destination_currency'] == self.origin_currency:
                available_amount += transaction['destination_amount']
        return available_amount

    def validate_input(self):
        if self.origin_currency == self.destination_currency:
            raise ValidationError(
                'Source currency and target currency cannot be the same')

        if not isinstance(self.origin_amount, (int, float)) or self.origin_amount <= 0:
            raise ValidationError('Amount must be a positive number')

        available_amount = self.get_available_amount()
        if self.origin_amount > available_amount and self.origin_currency != ACCOUNTING_CURRENCY:
            raise ValidationError(
                'The amount entered is greater than the available amount')

    def consult_exchange_rate(self) -> float:
        self.validate_input()

        url = f'{api_url}{endpoint}/{self.origin_currency}/{self.destination_currency}?apikey={API_KEY}'

        try:
            response = requests.get(url)
            if response.status_code == 200:
                exchange = response.json()
                self.exchange_rate = exchange.get("rate")
                return self.exchange_rate
        except:
            raise APIError(
                f'Error {response.status_code} {response.reason} during API consult'
            )

    def calculate_final_amount(self) -> float:
        return self.origin_amount * self.exchange_rate
