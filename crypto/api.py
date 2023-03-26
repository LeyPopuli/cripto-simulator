from datetime import datetime
from flask import jsonify, request

from . import app

from crypto.modelsext import CryptoModel, APIError
from crypto.models import DBManager


@app.route('/api/v1/exchange', methods=['POST'])
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
        except Exception as ex:
            print(ex)
            status_code = 400
            result = {
                'status': 'error',
                'message': 'There is some incorrectly formatted data.'
            }
    except Exception as ex:
        print(ex)
        status_code = 500
        result = {
            'status': 'error',
            'message': 'Unknown server error.'
        }

    return jsonify(result), status_code


@app.route('/api/v1/transaction', methods=['POST'])
def add_transaction():
    try:
        json = request.get_json()
        db = DBManager()
        query = "INSERT INTO 'transaction' (date, time, origin_currency, origin_amount, destination_currency, destination_amount) VALUES (?, ?, ?, ?, ?, ?)"
        date_time = datetime.now()
        date = date_time.strftime('%d-%m-%Y')
        time = date_time.strftime('%H:%M:%S')
        int_amount = float(json.get(
            'amount'))
        int_target_amount = float(json.get('targetAmount'))

        params = (date, time, json.get('originCurrency'), int_amount, json.get(
            'destinationCurrency'), int_target_amount)
        try:
            run = db.run_query_with_params(query, params)
            if run:
                status_code = 201
                result = {
                    'status': 'success',
                }
            else:
                status_code = 500
                result = {
                    'status': 'error',
                    'message': 'Failed to insert transaction.'
                }
        except Exception as ex:
            print(ex)
            status_code = 500
            result = {
                'status': 'error',
                'message': 'Failed to connect to database.'
            }

    except Exception as ex:
        print(ex)
        status_code = 500
        result = {
            'status': 'error',
            'message': 'Unknown server error.'
        }
    return jsonify(result), status_code
