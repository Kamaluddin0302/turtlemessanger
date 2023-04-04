import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {firebase} from "../config/firebase"


export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const source = { uri: result.uri };
    console.log(source);
    setImage(source);
  };

  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    var ref = firebase.storage().ref().child(filename).put(blob);
    try {
      await ref;
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
    Alert.alert("Image uploaded!");
    setImage(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from camera roll</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 300, height: 300 }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#507371",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});
