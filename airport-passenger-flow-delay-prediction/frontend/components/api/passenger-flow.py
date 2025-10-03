from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os
import pandas as pd
import xgboost as xgb
import numpy as np

class PassengerFlowView(APIView):
    def get(self, request):
        try:
            import os
            import joblib
            import pandas as pd

            model_path = os.path.join(os.path.dirname(__file__), 'ml', 'passenger_flow_model.joblib')
            scaler_path = os.path.join(os.path.dirname(__file__), 'ml', 'passenger_flow_scaler.joblib')

            if not os.path.exists(model_path) or not os.path.exists(scaler_path):
                return Response({"error": "Model or scaler file not found."}, status=500)

            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)

            # Example: Use synthetic data (4 rows)
            df = pd.DataFrame([{
                "passenger_count": 210, "record_id": i
            } for i in range(4)])

            X = scaler.transform(df.values)
            pred = model.predict(X)
            prediction = pred.tolist()

            return Response({"prediction": prediction})
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)