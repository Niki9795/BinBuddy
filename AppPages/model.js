import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const ImageUploader = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setPredictedClass(null);
    } else {
      Alert.alert('Error', 'No image selected or image selection cancelled.');
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setPredictedClass(null);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'No image selected.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      const response = await fetch('http://10.250.92.138:5000/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.predicted_class) {
        setPredictedClass(result.predicted_class);
      } else {
        Alert.alert('Prediction Error', result.error || 'Server error occurred while predicting.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', 'An error occurred while uploading the image.');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Classification</Text>
      <TouchableOpacity style={styles.button} onPress={handleImageChange}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonIcon} onPress={openCamera}>
        <Ionicons name="camera-outline" size={24} color="white" />
      </TouchableOpacity>
      {selectedImage && (
        <>
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={uploadImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {predictedClass && <Text style={styles.predictionText}>Predicted Class: {predictedClass}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark text for better contrast
  },
  button: {
    backgroundColor: '#4CAF50', // A green color for the button
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontWeight: '500',
  },
  imageContainer: {
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginBottom: 15,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10, // Rounded corners for the image
  },
  predictionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 20,
  },

  buttonIcon: {
    backgroundColor: '#4CAF50', // You can adjust the color as needed
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Adjust based on your UI needs
    width: 50, // Adjust based on your UI needs
  },
});

export default ImageUploader;
