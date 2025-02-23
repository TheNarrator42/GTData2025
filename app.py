from flask import Flask, render_template, redirect, jsonify
import tableGen
import modbusModel as modModel

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

@app.route("/modbusModel")
def modbusModel():
    predictType = ['backdoor', 'injection', 'normal', 'password', 'scanning', 'xss']
    entry = tableGen.generate(20)
    prediction = modModel.predictData(entry)
    entry = entry.assign(time="0")
    entry.rename(columns={
    "FC1_Read_Input_Register": "FC1 Read Input Register",
    "FC2_Read_Discrete_Value": "FC2 Read Discrete Value",
    "FC3_Read_Holding_Register": "FC3 Read Holding Register",
    "FC4_Read_Coil": "FC4 Read Coil"
}, inplace=True)
    entry_json = entry.to_json(orient="records")
    return jsonify({'rawData':entry_json,'type':prediction.tolist(), 'predictType':predictType})