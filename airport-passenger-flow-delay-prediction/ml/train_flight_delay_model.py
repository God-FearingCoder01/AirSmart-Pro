import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import xgboost as xgb
import joblib
import numpy as np

# 1. Connect and load data
engine = create_engine('mysql+pymysql://root:Oneafternoon1*@localhost:3306/airport_db')
df = pd.read_sql('SELECT * FROM flights', engine)  # Adjust table name as needed

# 2. Preprocess data
# columns in flights: ['flight_id', 'airline', 'origin', 'destination', 'scheduled_time', 'actual_time', 'status']
df['actual_time_minutes'] = pd.to_datetime(df['actual_time'], errors='coerce').dt.hour * 60 + pd.to_datetime(df['actual_time'], errors='coerce').dt.minute
df['scheduled_time_minutes'] = pd.to_datetime(df['scheduled_time'], errors='coerce').dt.hour * 60 + pd.to_datetime(df['scheduled_time'], errors='coerce').dt.minute
df['delay_minutes'] = np.where(
    df['actual_time_minutes'].notnull() & df['scheduled_time_minutes'].notnull(),
    df['actual_time_minutes'] - df['scheduled_time_minutes'],
    0
)
df['is_delayed'] = (df['delay_minutes'] >= 15).astype(int) # Define delay as >= 15 min

target = 'is_delayed'
features = ['flight_id', 'airline', 'origin', 'destination', 'delay_minutes', 'status']

X = df[features]
y = df[target]


categorical = ['airline', 'origin', 'destination', 'status']
numerical = ['delay_minutes', 'flight_id']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numerical),
    ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical)
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

X_train_proc = preprocessor.fit_transform(X_train)
X_test_proc = preprocessor.transform(X_test)

# 3. Train XGBoost classifier
xgb_clf = xgb.XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1, use_label_encoder=False, eval_metric='logloss')
xgb_clf.fit(X_train_proc, y_train)

# 4. Evaluate
preds = xgb_clf.predict(X_test_proc)
acc = accuracy_score(y_test, preds)
print(f"XGBoost Delay Classifier Accuracy: {acc:.3f}")

# 5. Save model and preprocessor
joblib.dump(preprocessor, '../backend/core/ml/flight_preprocessor.joblib')
xgb_clf.save_model('../backend/core/ml/xgb_delay.json')