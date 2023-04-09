from datetime import datetime
from flask import jsonify, request

from . import app

from config import *
from crypto.modelsext import CryptoModel, APIError
from crypto.models import DBManager


@app.route('/api/v1/exchange', methods=['POST'])
def calculate_exchange():
    try:
        json = request.get_json()
        origin_currency = json.get('originCurrency')
        destination_currency = json.get('destinationCurrency')
        amount = json.get('amount')
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
            print(inst)
            status_code = 400
            result = {
                'status': 'error',
                'message': inst.message
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
        run = db.exec_with_params(query, params)
        if run:
            status_code = 201
            result = {
                'status': 'success',
            }
        else:
            status_code = 500
            result = {
                'status': 'error',
                'message': 'Failed to register the transaction.'
            }

    except Exception as ex:
        print(ex)
        status_code = 500
        result = {
            'status': 'error',
            'message': 'Unknown server error.'
        }
    return jsonify(result), status_code


@app.route('/api/v1/transaction', methods=['GET'])
def show_transaction():
    try:
        db = DBManager()
        query = "SELECT * FROM 'transaction'"
        transactions = db.run_query(query)
        result = {
            "status": "success",
            "results": transactions
        }
        status_code = 200

    except Exception as ex:
        print(ex)
        result = {
            "status": "error",
            "message": 'Unknown server error.'
        }
        status_code = 500

    return jsonify(result), status_code


@app.route('/api/v1/status', methods=['GET'])
def check_status():
    args = request.args
    request_type = args.get("type", default="wallet", type=str)
    try:
        db = DBManager()
        query = "SELECT * FROM 'transaction'"
        transactions = db.run_query(query)

        destination_amounts = {}
        origin_amounts = {}

        for transaction in transactions:
            dest_currency = transaction.get('destination_currency')
            dest_amount = transaction.get('destination_amount')
            if dest_currency not in destination_amounts:
                destination_amounts[dest_currency] = 0
            destination_amounts[dest_currency] += dest_amount

            orig_currency = transaction.get('origin_currency')
            orig_amount = transaction.get('origin_amount')
            if orig_currency not in origin_amounts:
                origin_amounts[orig_currency] = 0
            origin_amounts[orig_currency] += orig_amount

        totals = {}

        result = {
            "status": "success",
        }

        status_code = 200

        for currency in destination_amounts:
            totals[currency] = destination_amounts.get(currency, 0) - \
                origin_amounts.get(currency, 0)
            for currency in origin_amounts:
                if currency not in totals:
                    totals[currency] = destination_amounts.get(currency, 0) - \
                        origin_amounts.get(currency, 0)

        result["totals"] = totals

        if request_type != "wallet":
            investment = origin_amounts.get(ACCOUNTING_CURRENCY, 0)
            currency_acc_balance = totals.get(ACCOUNTING_CURRENCY, 0)
            crypto_balance = 0
            try:
                for currency in totals:
                    if currency != ACCOUNTING_CURRENCY:
                        new_exchange = CryptoModel(
                            currency, ACCOUNTING_CURRENCY, totals.get(currency))
                        new_rate = new_exchange.consult_exchange_rate()
                        new_final_amount = new_exchange.calculate_final_amount()
                        print(new_final_amount)
                        crypto_balance += new_final_amount

                current_value = investment + currency_acc_balance + crypto_balance

                result["investment"] = investment
                result["currentValue"] = current_value

            except APIError as inst:
                print(inst)
                status_code = 400
                result = {
                    'status': 'error',
                    'message': inst.message
                }

    except Exception as ex:
        print(ex)
        result = {
            "status": "error",
            "message": 'Unknown server error.'
        }
        status_code = 500

    return jsonify(result), status_code
