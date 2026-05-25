import os
import csv
import random
import numpy as np

def generate_synthetic_data(num_samples=1000):
    data = []
    
    for _ in range(num_samples):
        # Determine the inherent student profile to make correlations realistic
        profile = random.choices(
            ['EXCELLENT', 'GOOD', 'AVERAGE', 'STRUGGLING'], 
            weights=[0.2, 0.4, 0.3, 0.1]
        )[0]
        
        if profile == 'EXCELLENT':
            attendance = random.uniform(85, 100)
            internal_marks = random.uniform(80, 100)
            assignment_score = random.uniform(85, 100)
            previous_cgpa = random.uniform(8.5, 10.0)
            backlogs = 0
            participation = random.uniform(70, 100)
        elif profile == 'GOOD':
            attendance = random.uniform(75, 90)
            internal_marks = random.uniform(65, 85)
            assignment_score = random.uniform(70, 90)
            previous_cgpa = random.uniform(7.0, 8.5)
            backlogs = random.choices([0, 1], weights=[0.9, 0.1])[0]
            participation = random.uniform(50, 80)
        elif profile == 'AVERAGE':
            attendance = random.uniform(60, 80)
            internal_marks = random.uniform(50, 70)
            assignment_score = random.uniform(55, 75)
            previous_cgpa = random.uniform(6.0, 7.5)
            backlogs = random.choices([0, 1, 2], weights=[0.6, 0.3, 0.1])[0]
            participation = random.uniform(40, 65)
        else: # STRUGGLING
            attendance = random.uniform(40, 65)
            internal_marks = random.uniform(30, 55)
            assignment_score = random.uniform(40, 60)
            previous_cgpa = random.uniform(4.5, 6.5)
            backlogs = random.randint(1, 4)
            participation = random.uniform(20, 50)
            
        # Add some random noise to make the dataset robust
        attendance = min(100, max(0, attendance + random.uniform(-5, 5)))
        internal_marks = min(100, max(0, internal_marks + random.uniform(-5, 5)))
        assignment_score = min(100, max(0, assignment_score + random.uniform(-5, 5)))
        previous_cgpa = min(10.0, max(0.0, previous_cgpa + random.uniform(-0.5, 0.5)))
        participation = min(100, max(0, participation + random.uniform(-10, 10)))

        # Calculate a deterministic continuous risk score (0 to 100)
        # Higher score = higher risk
        score = 0
        score += (100 - attendance) * 0.35 # Attendance drop heavily impacts risk
        score += (100 - internal_marks) * 0.25
        score += (100 - assignment_score) * 0.15
        score += (10.0 - previous_cgpa) * 4 # Up to 40 pts
        score += backlogs * 10
        score += (100 - participation) * 0.05
        
        # Normalize score to 0-100 range loosely
        risk_score = min(100, max(0, int(score * 0.85)))
        
        # Determine categorical Risk Level based on thresholds
        if risk_score > 70:
            risk_level = "HIGH"
        elif risk_score > 45:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        data.append({
            'attendance_percentage': round(attendance, 2),
            'internal_marks': round(internal_marks, 2),
            'assignment_score': round(assignment_score, 2),
            'previous_cgpa': round(previous_cgpa, 2),
            'backlogs': backlogs,
            'class_participation': round(participation, 2),
            'risk_score': risk_score,
            'risk_level': risk_level
        })
        
    return data

if __name__ == "__main__":
    dataset = generate_synthetic_data(1000)
    
    # Save to CSV
    csv_path = os.path.join(os.path.dirname(__file__), 'training_data.csv')
    
    keys = dataset[0].keys()
    with open(csv_path, 'w', newline='') as f:
        dict_writer = csv.DictWriter(f, keys)
        dict_writer.writeheader()
        dict_writer.writerows(dataset)
        
    print(f"✅ Generated {len(dataset)} rows of synthetic training data at {csv_path}")
