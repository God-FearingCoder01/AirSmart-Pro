def load_model(model_path):
    import joblib
    return joblib.load(model_path)

def preprocess_data(data):
    import pandas as pd
    # Assuming data is a DataFrame
    # Perform necessary preprocessing steps
    return data

def inverse_transform(scaler, data):
    return scaler.inverse_transform(data)

def calculate_metrics(y_true, y_pred):
    from sklearn.metrics import mean_squared_error, r2_score
    mse = mean_squared_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    return mse, r2