import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null); // State to hold the predicted class

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If an image is selected, set it, else show an alert
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setPredictedClass(null); // Reset predicted class when a new image is selected
    } else {
      Alert.alert('Error', 'No image selected or image selection cancelled.');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'No image selected.');
      return;
    }

    // Prepare the formData for sending image to server
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    // Attempt to upload the image to the server
    try {
      const response = await fetch('http://144.118.77.134:5000/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      // Set the predicted class state to the result from the server
      if (result.predicted_class) {
        setPredictedClass(result.predicted_class);
      } else {
        Alert.alert('Prediction Error', result.error || 'Server error occurred while predicting.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', 'An error occurred while uploading the image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Classification</Text>
      <Button title="Select Image" onPress={handleImageChange} />
      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Button title="Upload Image" onPress={uploadImage} />
        </>
      )}
      {/* Display the predicted class below the image */}
      {predictedClass && <Text style={styles.predictionText}>Predicted Class: {predictedClass}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  predictionText: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default ImageUploader;







// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Platform, Text } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function ImagePickerExample() {
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Snap & Corp</Text>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//     </View>
//   );
// }
