from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
import os
import io

app = Flask(__name__)
CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "server/client_secrets.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()

@app.route('/')
def index():
    return 'Hello, this is the root endpoint!'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Reads the image file into memory
    content = file.read()
    image = vision.Image(content=content)

    # Performs label detection on the image file
    response = client.label_detection(image=image)
    labels = response.label_annotations

    # Initialize variables to determine the type of recycling
    food = False
    recycling = False

    # Check labels to set food and recycling flags
    for label in labels:
        label_desc = label.description.lower()
        if label_desc in ["food", "fruit", "vegetable", "flower", "human"]:
            food = True
        if label_desc in ["cardboard", "glass", "plastic", "drink", "metal"]:
            recycling = True

    # Determine the type of waste based on flags
    if food:
        predicted_class = "Eco-friendly and compostable – let nature do its thing!"
    elif recycling:
        predicted_class = "Reduce, reuse, recycle – this item is doing its part!"
    else:
        predicted_class = "Not recyclable, but still valuable! Dispose of this item responsibly."

    return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)