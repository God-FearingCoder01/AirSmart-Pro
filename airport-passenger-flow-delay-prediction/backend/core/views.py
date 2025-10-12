from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os
import pandas as pd
import xgboost as xgb
import numpy as np
from sqlalchemy import create_engine   # Make sure SQLAlchemy is installed
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny

@api_view(["POST"])
def signup_view(request):
    """Create a new user with is_active=False (pending approval)."""
    username = request.data.get("username")
    password = reqest.data.get("password")
    email = request.data.get("email")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.is_active = False # require admin approval
    user.save()

    return Response({"message": "Account create. Awaiting admin approval."}, status=201)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_user_view(request, user_id):
    """Admin approves user (activates account)."""
    try:
        user = User.objects.get(id=user_id, is_active=False)
        user.is_active = True
        user.save()
        return Response({"mesaage": f"User {user.username} approved."})
    except User.DoesNotExit:
        return Response({"error": "User not found or already active"}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def welcome_view(request):
    return Response({"message": "Welcome to AirFlow Pro API"})

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_approved:
            raise AuthenticationFailed("Your account is pending admin appproval.")
        return data

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class DashboardStatsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # Dummy data for now; to be replaced with real DB queries and calculations
        passengerStats = {"count": 1248}
        flightStats = {"count": 42, "onTimePercent": 87}
        waitTime = {"value": 18, "change": "+3 min from avg"}
        delayStats = {"count": 7, "confidence": "High confidence"}

        return Response({
            "passengerStats": passengerStats,
            "flightStats": flightStats,
            "waitTime": waitTime,
            "delayStats": delayStats,
        })

class FlightDelayPredictionView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            # Load preprocessor and model
            preprocessor_path = os.path.join(os.path.dirname(__file__), 'ml', 'flight_preprocessor.joblib')
            model_path = os.path.join(os.path.dirname(__file__), 'ml', 'xgb_delay.json')

            if not os.path.exists(preprocessor_path) or not os.path.exists(model_path):
                return Response({"error": "Model or preprocessor file not found."}, status=500)

            preprocessor = joblib.load(preprocessor_path)
            model = xgb.XGBClassifier()
            model.load_model(model_path)

            # Example: Get input data from query params (customize as needed)
            # You can also use POST and request.data for more complex input
            flight_id = int(request.query_params.get('flight_id', 1))
            airline = request.query_params.get('airline', 'FastJet')
            origin = request.query_params.get('origin', 'BUQ')
            destination = request.query_params.get('destination', 'HR')
            delay_minutes = float(request.query_params.get('delay_minutes', 0))
            status = request.query_params.get('status', 'Scheduled')

            # Define column names (must match what your preprocessor expects)
            columns = ['flight_id', 'airline', 'origin', 'destination', 'delay_minutes', 'status']

            # Create DataFrame
            input_df = pd.DataFrame([[flight_id, airline, origin, destination, delay_minutes, status]], columns=columns)

            # Transform
            input_df_transformed = preprocessor.transform(input_df)

            # Predict
            prediction = model.predict(input_df_transformed)
            probability = model.predict_proba(input_df_transformed)[0][1]

            return Response({
                "is_delayed": int(prediction[0]),
                "delay_probability": float(probability)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)

class PassengerFlowView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            # -------------------
            # Load model & scaler
            # -------------------
            base_dir = os.path.dirname(__file__)
            model_path = os.path.join(base_dir, 'ml', 'passenger_flow_model.joblib')
            scaler_path = os.path.join(base_dir, 'ml', 'passenger_flow_scaler.joblib')

            if not os.path.exists(model_path) or not os.path.exists(scaler_path):
                return Response({"error": "Model or scaler file not found."}, status=500)

            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)

            # -------------------
            # Fetch data from DB
            # -------------------
            engine = create_engine('mysql+pymysql://root:Oneafternoon1*@localhost:3306/airport_db')

            query = """
                SELECT record_id, passenger_count, terminal, timestamp
                FROM passenger_flow
                ORDER BY timestamp DESC
                LIMIT 24
            """
            df = pd.read_sql(query, engine)

            if df.empty:
                return Response([], status=200)  # instead of returning {"error": "..."}    
                
            # Make sure data is ordered oldest → newest
            df = df.sort_values('timestamp')

            # -------------------
            # Preprocess & Predict
            # -------------------
            X = scaler.transform(df[['passenger_count', 'record_id']].values)
            predictions = model.predict(X)

            # -------------------
            # Build response JSON
            # -------------------
            response_data = [
                {
                    "time": row["timestamp"].strftime("%H:%M"),  # or row["timestamp"].isoformat()
                    "passengerCount": int(pred)
                }
                for row, pred in zip(df.to_dict(orient="records"), predictions.tolist())
            ]

            return Response(response_data, status=200)

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
