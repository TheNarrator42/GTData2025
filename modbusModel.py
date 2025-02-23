import joblib

# Load the model from the .joblib file
clf_loaded = joblib.load('model/modbus.joblib')
print("Model loaded!")

# Now you can use the loaded model to make predictions
# Assuming you have new data 'new_data' in the same format as the training data
#Takes in dataframe, outputs number
def predictData(newData):
    predictions = clf_loaded.predict(newData)
    return predictions