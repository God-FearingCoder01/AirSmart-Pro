from sklearn.linear_model import LinearRegression
import pandas as pd
import numpy as np
import joblib

class PassengerFlowModel:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, X, y):
        self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)

    def save_model(self, file_path):
        joblib.dump(self.model, file_path)

    def load_model(self, file_path):
        self.model = joblib.load(file_path)

    def preprocess_data(self, data):
        # Example preprocessing steps
        data = data.dropna()
        return data

    def fit_and_predict(self, data):
        processed_data = self.preprocess_data(data)
        X = processed_data.drop('target', axis=1)
        y = processed_data['target']
        self.train(X, y)
        predictions = self.predict(X)
        return predictions