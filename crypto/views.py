from flask import render_template

from . import app


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/purchase')
def purchase():
    return render_template('purchase.html')


@app.route('/status')
def status():
    return render_template('status.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/login')
def login():
    return render_template('login.html')
