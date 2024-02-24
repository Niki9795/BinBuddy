from flask import Flask, request, jsonify
from torchvision import models, transforms
from PIL import Image
import json
import torch
import torch.nn as nn
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  

# Load pre-trained ResNet50 model
model = models.resnet50(pretrained=True)
num_classes = 3
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.eval()

# Image preprocessing transform
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load custom labels from JSON file
with open('server/label.json') as f:
    label_data = json.load(f)
    custom_labels = label_data['labels']

@app.route('/')
def index():
    return 'Hello, this is the root endpoint!'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Preprocess image
    image = Image.open(file)
    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0)

    # Make prediction
    with torch.no_grad():
        output = model(input_batch)

    # Interpret prediction
    _, predicted_idx = torch.max(output, 1)
    predicted_label = predicted_idx.item()

    # Verify if the predicted label is within the valid range
    if 0 <= predicted_label < len(custom_labels):
        # Get the predicted label
        predicted_class = custom_labels[predicted_label]
        return jsonify({'predicted_class': predicted_class})
    else:
        return jsonify({'error': 'Predicted label index is out of range'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
