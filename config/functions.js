import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

let ImagePickerFUnc = async () => {
  return new Promise(async (resolve, reject) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      try {
        const storage = getStorage();

        // Create a storage reference from our storage service

        let uri = result.assets[0].uri;

        var name = Math.random();
        const storageRef = ref(storage, `Profile/${name}`);

        const response = await fetch(uri);
        const blob = await response.blob(uri);
        var metadata = {
          contentType: "image/jpeg",
        };
        console.log(metadata, "========");
        const uploadTask = await uploadBytes(storageRef, blob, metadata);
        getDownloadURL(storageRef).then((url) => {
          resolve({ url: url, type: result.assets[0].type });
          console.log(url);
        });
      } catch (error) {
        console(error);
      }
    } else {
      resolve(false);
    }
  });
};

let VideoPickerFUnc = async () => {
  return new Promise(async (resolve, reject) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      try {
        const storage = getStorage();

        // Create a storage reference from our storage service

        let uri = result.assets[0].uri;

        var name = Math.random();
        const storageRef = ref(storage, `Profile/${name}`);

        const response = await fetch(uri);
        const blob = await response.blob(uri);
        var metadata = {
          contentType: "video",
        };

        const uploadTask = await uploadBytes(storageRef, blob, metadata);
        getDownloadURL(storageRef).then((url) => {
          resolve({ url: url, type: result.assets[0].type });
          console.log(url);
        });
      } catch (error) {
        console(error);
      }
    } else {
      resolve(false);
    }
  });
};

let CameraImageFUnc = async () => {
  return new Promise(async (resolve, reject) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      try {
        const storage = getStorage();

        // Create a storage reference from our storage service

        let uri = result.assets[0].uri;

        var name = Math.random();
        const storageRef = ref(storage, `Profile/${name}`);

        const response = await fetch(uri);
        const blob = await response.blob(uri);
        var metadata = {
          contentType: "image/jpeg",
        };
        console.log(metadata, "========");
        const uploadTask = await uploadBytes(storageRef, blob, metadata);
        getDownloadURL(storageRef).then((url) => {
          resolve({ url: url, type: result.assets[0].type });
          console.log(url);
        });
      } catch (error) {
        console(error);
      }
    } else {
      resolve(false);
    }
  });
};

let CameraVideoFUnc = async () => {
  return new Promise(async (resolve, reject) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      try {
        const storage = getStorage();

        // Create a storage reference from our storage service

        let uri = result.assets[0].uri;

        var name = Math.random();
        const storageRef = ref(storage, `Profile/${name}`);

        const response = await fetch(uri);
        const blob = await response.blob(uri);
        var metadata = {
          contentType: "video",
        };
        console.log(metadata, "========");
        const uploadTask = await uploadBytes(storageRef, blob, metadata);
        getDownloadURL(storageRef).then((url) => {
          resolve({ url: url, type: result.assets[0].type });
          console.log(url);
        });
      } catch (error) {
        console(error);
      }
    } else {
      resolve(false);
    }
  });
};

let FIlePickerFunc = async () => {
  return new Promise(async (resolve, reject) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/*",
      multiple: false,
    });

    console.log(result);
    if (result.type === "success") {
      try {
        const storage = getStorage();
        // Create a storage reference from our storage service
        let uri = result.uri;
        var name = Math.random();
        const storageRef = ref(storage, `Files/${result.name}`);
        const response = await fetch(uri);
        const blob = await response.blob(uri);
        console.log(blob);
        var metadata = {
          contentType: "application/pdf",
        };
        console.log(result.size, "========");
        const uploadTask = await uploadBytes(storageRef, blob, metadata);
        getDownloadURL(storageRef).then((url) => {
          let data = {
            url: url,
            type: result.mimeType,
            name: result.name,
            file: true,
            size: result.size,
          };
          resolve(data);
        });
      } catch (error) {
        resolve(false);
        console(error);
      }
    } else {
      resolve(false);
    }
  });
};

export {
  ImagePickerFUnc,
  VideoPickerFUnc,
  CameraImageFUnc,
  FIlePickerFunc,
  CameraVideoFUnc,
};
