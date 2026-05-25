import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from services.training_data import generate_synthetic_dataset
from models.schemas import StudentFeatures, RiskResult
from config import config

class RiskPredictor:
    def __init__(self):
        self.model_dir = config.MODEL_DIR
        self.model_path = os.path.join(self.model_dir, "risk_rf_model.joblib")
        self.model = None
        self.feature_names = [
            'attendance_pct', 'avg_internal_marks', 'avg_assignment_score',
            'cgpa', 'backlogs', 'performance_drop', 'class_participation'
        ]
        
        # Ensure model dir exists
        if not os.path.exists(self.model_dir):
            os.makedirs(self.model_dir)
            
        self._load_or_train()

    def _load_or_train(self):
        if os.path.exists(self.model_path):
            try:
                print(f"Loading existing Risk Prediction model from {self.model_path}")
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Failed to load model: {e}. Retraining...")
                self.train_new_model()
        else:
            print("No saved model found. Training new model on synthetic data...")
            self.train_new_model()

    def train_new_model(self, n_samples=800):
        print(f"Generating {n_samples} synthetic academic records for training...")
        df = generate_synthetic_dataset(n=n_samples)
        
        X = df[self.feature_names]
        y = df['risk_level']
        
        print("Training Random Forest Classifier...")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=8)
        self.model.fit(X, y)
        
        joblib.dump(self.model, self.model_path)
        print(f"Model trained and saved to {self.model_path}")

    def get_feature_importance(self):
        if not self.model:
            return {}
        importances = self.model.feature_importances_
        # Normalize and round
        norm_importances = {name: round(float(imp), 3) for name, imp in zip(self.feature_names, importances)}
        # Sort by importance
        return dict(sorted(norm_importances.items(), key=lambda item: item[1], reverse=True))

    def _generate_reasons(self, features: dict) -> list[str]:
        reasons = []
        if features.get('attendance_pct', 100) < 75:
            reasons.append(f"Attendance at {features['attendance_pct']}% — below 75% minimum threshold.")
        if features.get('avg_internal_marks', 100) < 45:
            reasons.append(f"Internal marks average {features['avg_internal_marks']}% — significantly below passing.")
        if features.get('backlogs', 0) > 0:
            reasons.append(f"{features['backlogs']} active backlog(s) indicate accumulated academic debt.")
        if features.get('performance_drop', 0) < -10:
            reasons.append(f"Recent performance drop of {abs(features['performance_drop'])}% observed.")
        if features.get('cgpa', 10) < 6.0:
            reasons.append(f"CGPA is {features['cgpa']}, which is below the safe margin.")
            
        if not reasons:
            reasons.append("Overall academic profile is stable.")
            
        return reasons

    def _generate_recommendations(self, risk_level: str, reasons: list[str]) -> list[str]:
        recommendations = []
        if risk_level == 'HIGH':
            recommendations.append("Immediate faculty mentoring required — assign academic advisor.")
            if any('backlog' in r for r in reasons):
                recommendations.append("Prioritize backlog clearance: schedule remedial classes.")
            if any('Attendance' in r for r in reasons):
                recommendations.append("Enable strict attendance alerts: notify HOD on next absence.")
        elif risk_level == 'MEDIUM':
            recommendations.append("Schedule a counseling session to understand challenges.")
            if any('Attendance' in r for r in reasons):
                recommendations.append("Monitor attendance closely over the next 2 weeks.")
            if any('marks' in r for r in reasons):
                recommendations.append("Recommend peer study groups or tutoring.")
        else:
            recommendations.append("Continue current academic trajectory.")
            recommendations.append("Consider taking up advanced electives or projects.")
            
        return recommendations

    def predict(self, student_feat: StudentFeatures) -> RiskResult:
        if not self.model:
            raise RuntimeError("Model not loaded or trained.")
            
        # Extract features in correct order
        feat_dict = student_feat.model_dump()
        x_input = [feat_dict[fname] for fname in self.feature_names]
        
        # Predict probability and class
        proba = self.model.predict_proba([x_input])[0]
        pred_class = self.model.predict([x_input])[0]
        
        # Compute confidence based on the predicted class probability
        class_idx = list(self.model.classes_).index(pred_class)
        confidence = round(float(proba[class_idx]), 2)
        
        # Calculate risk score (0-100) based on HIGH probability mainly
        # This gives a smoother gradient than just the class
        high_prob = float(proba[list(self.model.classes_).index('HIGH')]) if 'HIGH' in self.model.classes_ else 0
        med_prob = float(proba[list(self.model.classes_).index('MEDIUM')]) if 'MEDIUM' in self.model.classes_ else 0
        
        risk_score = round((high_prob * 100) + (med_prob * 50))
        
        reasons = self._generate_reasons(feat_dict)
        recommendations = self._generate_recommendations(pred_class, reasons)
        global_importance = self.get_feature_importance()
        
        return RiskResult(
            studentId=student_feat.studentId,
            riskScore=risk_score,
            riskLevel=pred_class,
            confidence=confidence,
            globalFeatureImportance=global_importance,
            studentReasons=reasons,
            recommendations=recommendations
        )

    def predict_batch(self, students: list[StudentFeatures]) -> list[RiskResult]:
        return [self.predict(s) for s in students]

# Singleton instance
predictor = RiskPredictor()
