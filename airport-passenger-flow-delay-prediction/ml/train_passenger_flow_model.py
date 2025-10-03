import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Connect and load data
engine = create_engine('mysql+pymysql://root:Oneafternoon1*@localhost:3306/airport_db')
df = pd.read_sql('SELECT * FROM passenger_flow', engine)

# 2. Preprocess data
df = df.sort_values('timestamp')
df['target'] = df['passenger_count'].shift(-1)
df = df.dropna()
features = ['passenger_count', 'record_id']
X = df[features]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 3. Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# 4. Save model and scaler
joblib.dump(model, '../backend/core/ml/passenger_flow_model.joblib')
joblib.dump(scaler, '../backend/core/ml/passenger_flow_scaler.joblib')