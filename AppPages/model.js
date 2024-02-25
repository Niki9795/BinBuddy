import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
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
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.buttonIcon, styles.buttonSelect]} onPress={handleImageChange}>
        <Ionicons name="image-outline" size={24} color="white" />
      </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonIcon, styles.buttonCamera]} onPress={openCamera}>
          <Ionicons name="camera-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonIcon: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 15,
    // Adjust margins as needed for alignment
    marginLeft: 10,
    marginHorizontal: 55,
  },
  imageContainer: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginBottom: 15,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 20,
  },
});


export default ImageUploader;
