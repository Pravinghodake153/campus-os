import re

# Keyword patterns for Intent Classification
INTENT_PATTERNS = {
    "ATTENDANCE_QUERY": [
        r"\battendance\b", r"\babsent\b", r"\bpresent\b", r"\bshortage\b", r"\bbelow\b"
    ],
    "RISK_QUERY": [
        r"\brisk\b", r"\bat-risk\b", r"\bfailing\b", r"\bhighest risk\b", r"\bdanger\b"
    ],
    "PLACEMENT_QUERY": [
        r"\bplacement\b", r"\bcompany\b", r"\bgoogle\b", r"\beligible\b", r"\beligibility\b", r"\bskill\b", r"\binterview\b"
    ],
    "STUDENT_QUERY": [
        r"\bstudent\b", r"\bclass\b", r"\bmy students\b"
    ],
    "NOTICE_GENERATE": [
        r"\bgenerate\b", r"\bnotice\b", r"\bwrite\b", r"\bemail\b", r"\bannounce\b"
    ],
    "GENERAL_INFO": [
        r"\bhostel\b", r"\btransport\b", r"\bbus\b", r"\boccupancy\b", r"\bfee\b", r"\bevent\b", r"\bclub\b"
    ]
}

# Extraction regexes
PARAM_EXTRACTORS = {
    "threshold": r"(?:below|under|<)\s*(\d+)\s*%",
    "branch": r"\b(CSE|IT|ECE|MECH|CIVIL|EEE)\b",
    "company": r"(?:for|to|at)\s+([A-Z][a-z]+(?:[A-Z][a-z]+)?)\b(?:\s+drive|\s+placement)?",
}

def classify_intent(query: str) -> str:
    query = query.lower()
    scores = {intent: 0 for intent in INTENT_PATTERNS}
    
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, query):
                scores[intent] += 1
                
    # Also some compound logic
    if "risk" in query and "class" in query:
        scores["STUDENT_QUERY"] += 2
        
    best_intent = max(scores, key=scores.get)
    if scores[best_intent] == 0:
        return "UNKNOWN_QUERY"
    return best_intent

def extract_params(query: str) -> dict:
    params = {}
    
    threshold_match = re.search(PARAM_EXTRACTORS["threshold"], query, re.IGNORECASE)
    if threshold_match:
        params["threshold"] = int(threshold_match.group(1))
        
    branch_match = re.search(PARAM_EXTRACTORS["branch"], query, re.IGNORECASE)
    if branch_match:
        params["branch"] = branch_match.group(1).upper()
        
    company_match = re.search(PARAM_EXTRACTORS["company"], query, re.IGNORECASE)
    if company_match:
        params["company"] = company_match.group(1)
        
    return params
