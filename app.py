from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route("/")
def landingPage():
    return redirect('/dashboard')

@app.route("/dashboard")
def dashboard():
    print("dashboard")
    return render_template('dashboard.html')

@app.route("/model")
def model():
    return render_template('model.html')

@app.route("/report")
def report():
    return render_template('report.html')

@app.route("/analytics")
def analytics():
    return render_template('device.html')
