# Bin Buddy – Your Trashy Bestie!

Bin Buddy is an innovative mobile application designed to simplify waste management and promote sustainability. With its ability to classify different types of trash, including recyclable, compostable, and non-recyclable items, Bin Buddy makes it easier for everyone to contribute to a healthier planet.

## Features

- **Trash Classification**: Quickly identify and categorize waste into recyclable, compostable, and non-recyclable items.
- **Image Recognition**: Uses advanced image recognition technology to analyze images of trash and provide accurate classification results.
- **User-Friendly Interface**: A simple and intuitive interface that allows users to classify trash items with just a few taps.

## Installation

### Prerequisites

- Git
- npm (Node.js package manager)
- Python (for the server)
- Flask (for the server)
- Google Cloud API credentials

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/np873/BinBuddy.git
   ```
2. Set up the server:
   - Navigate to the server directory:
     ```bash
     cd BinBuddy/server
     ```
   - Install dependencies using pip:
     ```bash
     pip install -r requirements.txt
     ```
   - Place your Google Cloud API credentials in `client_secrets.json`.
   - Run the Flask server:
     ```bash
     flask run
     ```

3. Set up the client:
   - Navigate to the client directory:
     ```bash
     cd ../client
     ```
   - Install client dependencies:
     ```bash
     npm install
     ```
   - Start the application:
     ```bash
     npx expo start
     ```
   - Install the Expo Go app on your mobile device and scan the QR code to run the app.

## Usage

1. Open the Bin Buddy app on your mobile device.
2. Snap a photo of the trash item you wish to classify.
3. Wait for the app to analyze the image and provide the classification results.

## Contact

For support or inquiries, please contact us at support@binbuddy.com.

## Acknowledgements

We would like to express our gratitude to Femme Hacks for their support and for providing a platform to showcase our skills through this hackathon.
