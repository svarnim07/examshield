print("THIS IS MY MAIN.PY LOADED")
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///events.db")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class EventLog(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String)
    event = Column(String)
    risk = Column(String)

Base.metadata.create_all(bind=engine)
from fastapi import FastAPI, UploadFile, File, Request
import cv2
import numpy as np
import mediapipe as mp

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== RISK FUNCTION ==================
def calculate_risk(events):
    score = 0

    for e in events:
        if e["event"] == "MULTIPLE_FACES":
            score += 5
        elif e["event"] == "NO_FACE":
            score += 4
        elif e["event"] == "LOOKING_AWAY":
            score += 2
        elif e["event"] == "HEAD_TURNED":
            score += 2
        elif e["event"] == "SPEAKING":
            score += 2
        elif e["event"] == "TAB_SWITCHED":
            score += 3
        elif e["event"] == "WINDOW_BLUR":
            score += 2

    if score < 3:
        return "LOW"
    elif score < 7:
        return "MEDIUM"
    else:
        return "HIGH"

print("CHECKPOINT: Starting Imports...")
import mediapipe as mp
print(f"CHECKPOINT: MediaPipe base imported from {mp.__path__}")

# ================== MEDIAPIPE SOLUTIONS ==================
# Try multiple ways to find solutions
mp_face_detection = None
mp_face_mesh = None

try:
    import mediapipe.solutions.face_detection as fd
    import mediapipe.solutions.face_mesh as fm
    mp_face_detection = fd
    mp_face_mesh = fm
    print("CHECKPOINT: Solutions imported via direct submodule")
except:
    try:
        mp_face_detection = mp.solutions.face_detection
        mp_face_mesh = mp.solutions.face_mesh
        print("CHECKPOINT: Solutions imported via mp.solutions attribute")
    except:
        print("CRITICAL: Failed to load MediaPipe solutions through standard paths")
        raise

face_detector = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.5
)
print("CHECKPOINT: Face detector initialized")

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
print("CHECKPOINT: Face mesh initialized")

@app.get("/")
def home():
    return {"status": "AI service running"}

# ================== AI DETECTION ==================
@app.post("/detect-face")
async def detect_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Invalid image file"}

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        results = face_detector.process(rgb)
        face_count = len(results.detections) if results.detections else 0

        mesh_results = face_mesh.process(rgb)

        looking_away = False
        speaking = False
        head_turned = False

        if mesh_results.multi_face_landmarks:
            for face_landmarks in mesh_results.multi_face_landmarks:

                # EYE
                left_outer = face_landmarks.landmark[33]
                left_inner = face_landmarks.landmark[133]
                right_outer = face_landmarks.landmark[362]
                right_inner = face_landmarks.landmark[263]

                gaze_x = (
                    (left_outer.x + left_inner.x) / 2 +
                    (right_outer.x + right_inner.x) / 2
                ) / 2

                if gaze_x < 0.42 or gaze_x > 0.58:
                    looking_away = True

                # MOUTH
                upper_lip = face_landmarks.landmark[13]
                lower_lip = face_landmarks.landmark[14]
                if abs(upper_lip.y - lower_lip.y) > 0.02:
                    speaking = True

                # HEAD TURN
                nose = face_landmarks.landmark[1]
                left_face = face_landmarks.landmark[234]
                right_face = face_landmarks.landmark[454]

                left_dist = abs(nose.x - left_face.x)
                right_dist = abs(nose.x - right_face.x)

                if abs(left_dist - right_dist) > 0.08:
                    head_turned = True

        events = []

        if face_count == 0:
            events.append({"event": "NO_FACE", "confidence": 0.9})
        elif face_count > 1:
            events.append({"event": "MULTIPLE_FACES", "confidence": 0.95})
        else:
            events.append({"event": "NORMAL", "confidence": 0.98})

        if looking_away:
            events.append({"event": "LOOKING_AWAY", "confidence": 0.85})

        if speaking:
            events.append({"event": "SPEAKING", "confidence": 0.8})

        if head_turned:
            events.append({"event": "HEAD_TURNED", "confidence": 0.85})

        print("DETECTED EVENTS:", events)

        return {"events": events}

    except Exception as e:
        return {"error": str(e)}
# ================== LOG + RISK ==================
from fastapi import Request

@app.post("/log-events")
async def log_events(request: Request):
    try:
        data = await request.json()

        student_id = data["student_id"]
        events = data["events"]

        risk = calculate_risk(events)

        db = SessionLocal()

        for e in events:
            db.add(EventLog(
                student_id=student_id,
                event=e["event"],
                risk=risk
            ))

        db.commit()
        db.close()

        return {
            "status": "saved",
            "risk": risk
        }

    except Exception as e:
        print("ERROR:", str(e))   # IMPORTANT DEBUG
        return {"error": str(e)}
@app.get("/get-logs")
def get_logs():
    db = SessionLocal()

    logs = db.query(EventLog).order_by(EventLog.id.desc()).all()

    db.close()

    latest = {}

    for log in logs:
        if log.student_id not in latest:
            latest[log.student_id] = log.risk

    return [
        {"student_id": k, "risk": v}
        for k, v in latest.items()
    ]
