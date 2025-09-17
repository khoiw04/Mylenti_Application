from flask_cors import CORS

from flask import Flask, request, send_file
from vietvoicetts import synthesize, ModelConfig
import os

app = Flask(__name__)
CORS(app)

MODEL_CACHE_DIR = os.path.join(os.path.dirname(__file__), "models")
config = ModelConfig(model_cache_dir=MODEL_CACHE_DIR)

@app.route("/tts", methods=["POST"])
def tts():
    try:
        text = request.json["text"]
        output_path = os.path.join(os.path.dirname(__file__), "output.wav")
        synthesize(text, output_path, gender="male", area="northern", group="interview", emotion="happy", config=config)

        if not os.path.exists(output_path):
            return {"error": "File không được tạo"}, 500

        return send_file(output_path, mimetype="audio/wav")
    except Exception as e:
        print("❌ Lỗi TTS:", e)
        return {"error": str(e)}, 500

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}, 200

app.run(host="127.0.0.1", port=4545, debug=True)