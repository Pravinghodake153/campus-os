// ============================================================
// CampusOS AI — System Constants
// ============================================================

// ---- Attendance Confidence Score Thresholds ----

export const ATTENDANCE_CONFIDENCE = {
  /** BLE proximity detected: 40 points */
  BLE_PROXIMITY: 40,
  /** Location inside campus/classroom: 25 points */
  LOCATION_VERIFIED: 25,
  /** Registered device matched: 20 points */
  DEVICE_VERIFIED: 20,
  /** Correct class/session: 10 points */
  CORRECT_SESSION: 10,
  /** Submitted within time window: 5 points */
  TIME_WINDOW: 5,
  /** Maximum total score */
  MAX_SCORE: 100,
} as const;

export const ATTENDANCE_THRESHOLDS = {
  /** Score >= 75: Present */
  PRESENT_MIN: 75,
  /** Score 50–74: Pending faculty review */
  PENDING_MIN: 50,
  /** Score < 50: Rejected */
  REJECTED_BELOW: 50,
} as const;

/** Default attendance session duration in minutes */
export const ATTENDANCE_SESSION_DURATION_MINUTES = 5;

// ---- Academic Risk Thresholds ----

export const RISK_THRESHOLDS = {
  /** Risk score >= 70: High risk */
  HIGH_MIN: 70,
  /** Risk score 40–69: Medium risk */
  MEDIUM_MIN: 40,
  /** Risk score < 40: Low risk */
  LOW_BELOW: 40,
} as const;

/** Minimum attendance percentage to be considered "safe" */
export const MIN_ATTENDANCE_PERCENTAGE = 75;

/** Minimum CGPA for general placement eligibility */
export const MIN_PLACEMENT_CGPA = 6.0;

// ---- Pagination ----

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ---- Academic Constants ----

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const SECTIONS = ['A', 'B', 'C'] as const;

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

// ---- Verification Methods ----

export const VERIFICATION_METHODS = {
  SMART: 'SMART',         // BLE + Location + Device
  MANUAL: 'MANUAL',       // Faculty manual mark
  BIOMETRIC: 'BIOMETRIC', // Optional phone biometric
} as const;

// ---- JWT ----

export const JWT_DEFAULTS = {
  EXPIRES_IN: '7d',
} as const;

// ---- Timetable ----

export const TIMETABLE = {
  MAX_CLASSES_PER_DAY: 6,
  SLOT_DURATION_MINUTES: 60,
  BREAK_DURATION_MINUTES: 15,
  LUNCH_BREAK_MINUTES: 60,
  DAY_START: '09:00',
  DAY_END: '17:00',
  LUNCH_START: '13:00',
} as const;
