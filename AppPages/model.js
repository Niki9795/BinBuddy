import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'No image selected or image selection cancelled.');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.error('No image URI to upload');
      Alert.alert('Error', 'There was an error obtaining the image URI.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      type: 'image/jpeg', // or your image type
      name: 'image.jpg',
    });

    try {
      const response = await fetch('http://localhost:5000/predict', {
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Classification</Text>
      <Button title="Select Image" onPress={handleImageChange} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      {predictedClass && <Text>Predicted Class: {predictedClass}</Text>}
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
