from flask import jsonify, request

from . import app
from config import RUTA_BBDD
from crypto.modelsext import CryptoModel, APIError


@app.route('/api/v1/exchanges', methods=['POST'])
def calculate_exchange():
    try:
        json = request.get_json()
        origin_currency = json.get('originCurrency')
        destination_currency = json.get('destinationCurrency')
        amount = json.get('amount')
        try:
            new_exchange = CryptoModel(
                origin_currency, destination_currency, amount)
            try:
                new_rate = new_exchange.consult_exchange_rate()
                new_final_amount = new_exchange.calculate_final_amount()
                status_code = 200
                result = {
                    'status': 'success',
                    'newrate': new_rate,
                    'newfinalamount': new_final_amount,
                }
            except APIError as inst:
                status_code = 400
                result = {
                    'status': 'error',
                    'message': inst.message
                }
        except:
            status_code = 400
            result = {
                'status': 'error',
                'message': 'There is some incorrectly formatted data.'
            }
    except:
        status_code = 500
        result = {
            'status': 'error',
            'message': 'Unknown server error.'
        }

    return jsonify(result), status_code


def add_transaction():
    pass
