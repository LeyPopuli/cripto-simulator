from flask import render_template

from . import app

from config import *
from crypto.modelsext import CryptoModel

ALL_CURRENCIES = AVAILABLE_CURRENCIES
AVAILABLE_CURRENCIES.append(ACCOUNTING_CURRENCY)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/purchase')
def purchase():
    return render_template('purchase.html', all_currencies=ALL_CURRENCIES)


@app.route('/status')
def status():
    return render_template('status.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/login')
def login():
    return render_template('login.html')
