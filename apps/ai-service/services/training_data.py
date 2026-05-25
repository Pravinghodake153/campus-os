import pandas as pd
import numpy as np

def generate_synthetic_dataset(n: int = 1000) -> pd.DataFrame:
    """
    Generate realistic synthetic academic records for Random Forest training.
    Produces a DataFrame with features and risk labels.
    """
    np.random.seed(42)
    
    # 1. Attendance: Normal distribution centered at 75, std 15
    attendance_pct = np.clip(np.random.normal(75, 15, n), 20, 100)
    
    # 2. Class Participation: correlated with attendance
    class_participation = np.clip((attendance_pct / 100) * np.random.normal(0.9, 0.2, n), 0, 1)
    
    # 3. Internal Marks (out of 100): correlated with attendance
    avg_internal_marks = np.clip(attendance_pct * 0.8 + np.random.normal(10, 15, n), 0, 100)
    
    # 4. Assignment Score: correlated with internal marks
    avg_assignment_score = np.clip(avg_internal_marks * 0.9 + np.random.normal(15, 10, n), 0, 100)
    
    # 5. Performance Drop: random, biased negative for low performers
    # Calculated as exam_avg - internal_avg, here we simulate the difference directly
    performance_drop = np.random.normal(0, 10, n)
    low_performers = avg_internal_marks < 50
    performance_drop[low_performers] -= np.random.uniform(5, 20, sum(low_performers))
    performance_drop = np.clip(performance_drop, -100, 100)
    
    # 6. CGPA (0-10 scale): strongly correlated with all marks
    base_cgpa = (avg_internal_marks + avg_assignment_score) / 20
    cgpa = np.clip(base_cgpa + np.random.normal(0.5, 1.0, n), 3.0, 10.0)
    
    # 7. Backlogs: inverse correlation with CGPA
    backlogs = np.zeros(n, dtype=int)
    low_cgpa_mask = cgpa < 6.5
    backlogs[low_cgpa_mask] = np.random.poisson(lam=1.5, size=sum(low_cgpa_mask))
    backlogs = np.clip(backlogs, 0, 8)
    
    # Build DataFrame
    df = pd.DataFrame({
        'attendance_pct': attendance_pct,
        'avg_internal_marks': avg_internal_marks,
        'avg_assignment_score': avg_assignment_score,
        'cgpa': cgpa,
        'backlogs': backlogs,
        'performance_drop': performance_drop,
        'class_participation': class_participation
    })
    
    # Compute Risk Level based on realistic ground truth rules
    def determine_risk(row):
        score = 0
        if row['attendance_pct'] < 65: score += 40
        elif row['attendance_pct'] < 75: score += 20
        
        if row['avg_internal_marks'] < 45: score += 30
        if row['cgpa'] < 6.0: score += 25
        if row['backlogs'] > 1: score += 30
        elif row['backlogs'] == 1: score += 15
        if row['performance_drop'] < -15: score += 10
        if row['avg_assignment_score'] < 50: score += 15
        
        if score >= 70:
            return 'HIGH'
        elif score >= 40:
            return 'MEDIUM'
        else:
            return 'LOW'
            
    df['risk_level'] = df.apply(determine_risk, axis=1)
    
    return df
