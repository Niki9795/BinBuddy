import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);

  const handleImageChange = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (!response.didCancel && !response.error) {
        setSelectedImage(response.uri);
      }
    });
  };

  const uploadImage = () => {
    // Perform image upload logic using the selectedImage URI
    // ...

    // For demonstration, set a dummy predicted class
    setPredictedClass('ExampleClass');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Classification</Text>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <Button title="Select Image" onPress={handleImageChange} />
      <Button title="Upload Image" onPress={uploadImage} />
      {predictedClass && (
        <View>
          <Text>Predicted Class: {predictedClass}</Text>
        </View>
      )}
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
