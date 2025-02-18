import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Correct import
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";

export const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Error:", "Must allow permissions to get Image");
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    aspect: [4, 3],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const QRImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Error:", "Must allow permissions to get Image");
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    aspect: [1, 1],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  
};

export const storeCustomer = async (user) => {
  try {
    const customer = await AsyncStorage.getItem("customer");
    const users = customer ? JSON.parse(customer) : []; // Initialize as empty array if null
    users.push(user);
    await AsyncStorage.setItem("customer", JSON.stringify(users));
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Failed to register user");
  }
};

export const getCustomers = async () => {
  try {
    const customer = await AsyncStorage.getItem("customer");
    return customer ? JSON.parse(customer) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
 export const updateCustomer = async (customer) => {
  try {
    const customers = await getCustomers();
    const updatedCustomers = customers.map((c) =>
      c.customerId === customer.customerId ? customer : c
    );
    await AsyncStorage.setItem("customer", JSON.stringify(updatedCustomers));
  } catch (error) {
    console.log(error);
  }
};

export const saveImage = async (uri) => {
  try {
    if (!uri) {
      
      return null;
    }

    console.log("Saving image:", uri);

    const fileName = uri.split("/").pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });
    
    console.log("Image saved successfully:", newPath);
    return newPath;
  } catch (error) {
      console.warn('Move error occurred but file might still be moved:', error);
    return null; // Ensure a failed save doesn't break the registration process
  }
};
