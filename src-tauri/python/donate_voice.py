from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from vietvoicetts import synthesize, ModelConfig
import os
import glob
import atexit
import tempfile
import shutil

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
MODEL_CACHE_DIR = os.path.join(BASE_DIR, "models")
OUTPUT_PATH = os.path.join(BASE_DIR, "output.wav")

config = ModelConfig(model_cache_dir=MODEL_CACHE_DIR)

def cleanup_temp_files():
    temp_patterns = ["*.tmp", "*.log", "*.wav"]
    for pattern in temp_patterns:
        for file_path in glob.glob(os.path.join(MODEL_CACHE_DIR, pattern)):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"❌ Không thể xóa file tạm: {file_path} → {e}")
                

def cleanup_mei_folders():
    temp_dir = tempfile.gettempdir()
    for name in os.listdir(temp_dir):
        if name.startswith("_MEI"):
            folder_path = os.path.join(temp_dir, name)
            try:
                shutil.rmtree(folder_path)
                print(f"✅ Đã xóa: {folder_path}")
            except Exception as e:
                print(f"❌ Không thể xóa {folder_path}: {e}")

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Thiếu dữ liệu 'text'"}), 400

        text = data["text"]

        synthesize(
            text,
            OUTPUT_PATH,
            gender="male",
            area="northern",
            group="interview",
            emotion="happy",
            config=config
        )

        if not os.path.exists(OUTPUT_PATH):
            return jsonify({"error": "Không tạo được file âm thanh"}), 500

        cleanup_temp_files()

        return send_file(OUTPUT_PATH, mimetype="audio/wav")

    except Exception as e:
        print("❌ Lỗi TTS:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=4545, debug=True)
    
atexit.register(cleanup_mei_folders)