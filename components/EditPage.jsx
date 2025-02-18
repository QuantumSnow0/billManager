import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { cars } from "../constants/newCustomer";
import TextField from "../components/TextField";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  pickImage,
  QRImage,
  saveImage,
  updateCustomer,
} from "../utils/customerUtils";
import { useRouter } from "expo-router";
import { DataContext } from "../DataContext";
import { useContext } from "react";

export default function addCustomer({ customer, setEditModal, setShowModal }) {
  const { data, setData } = useContext(DataContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedQRImage, setSelectedQRImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMkula, setIsMkula] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const myCar = cars[Math.floor(Math.random() * cars.length)];

    setAvatar(myCar);
    setForm((prevForm) => ({
      ...prevForm,
      avatarImg: myCar,
    }));
  }, []);
  const [form, setForm] = useState(customer);
  console.log("Form:", form);
  const [error, setErrors] = useState({});
  const Validation = () => {
    let checkErrors = {};
    if (!form.name.trim() || form.name.trim().length < 4) {
      checkErrors = {
        name: "Name cannot be empty and must be greater than 4 characters",
      };
      setErrors(checkErrors);
      return false;
    }
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      checkErrors = {
        phone:
          "Phone number cannot be empty and must be greater than 10 digits",
      };
      setErrors(checkErrors);
      return false;
    }
    if (!form.location.trim() || form.location.trim().length < 4) {
      checkErrors = {
        location:
          "Location cannot be empty and must be greater than 4 characters",
      };
      setErrors(checkErrors);
      return false;
    }

    return Object.keys(checkErrors).length === 0;
  };

  const getAvatar = async () => {
    const results = await pickImage();
    setForm({ ...form, profile: results });
    setSelectedImage(results);
  };
  const getQRImage = async () => {
    const qrResults = await QRImage();
    if (!qrResults) return;
    setSelectedQRImage(qrResults);
    const profilePath = await saveImage(form.profile);
    setIsEnabled(true);
    setForm({ ...form, imageUri: qrResults });
  };
  const toggleMkula = () => {
    setForm({ ...form, mkula: !form.mkula });
    setIsMkula(!isMkula);
  };
  const updateForm = async () => {
    if (!Validation()) {
      Alert.alert("Error", "Ensure All fields are entered correctly");
      return;
    }
    if (form.mkula) {
      if (!form.imageUri) {
        Alert.alert("Error", "Please upload a QR Code");
        return;
      }
    }

    const profilePath = await saveImage(form.profile);
    const imageUriPath = await saveImage(form.imageUri);

    updateCustomer({ ...form, profile: profilePath, imageUri: imageUriPath });
    setData((prevData) =>
      prevData.map((item) =>
        item.customerId === form.customerId ? form : item
      )
    );
    setIsEnabled(false);
    setSelectedImage(null);
    setForm({
      customerId: null,
      avatarImg: avatar,
      profile: null,
      name: "",
      phone: "",
      location: "",
      bill: "",
      mkula: false,
      imageUri: null,
    });
    Alert.alert("Success", "Customer updated Successfully");
    setShowModal(false);
  };
  const deleteUser = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Filter out the customer
              const updatedCustomers = data.filter(
                (item) => item.customerId !== customer.customerId
              );

              // Store the updated list in AsyncStorage
              await AsyncStorage.setItem(
                "customer",
                JSON.stringify(updatedCustomers)
              );

              // Update the state
              setData(updatedCustomers);

              console.log("Customer deleted successfully!");
            } catch (error) {
              console.error("Error deleting customer:", error);
            }
            setShowModal(false);
            setEditModal(false);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="w-full h-[150px] bg-[#12568a]  rounded-b-[30px] flex flex-row items-center justify-around ">
          <TouchableOpacity>
            <View className="flex items-center bg-tealBlue/50 rounded-full">
              <Ionicons
                name="arrow-back-circle-sharp"
                size={40}
                color="#FFD700"
                onPress={() => setEditModal(false)}
              />
            </View>
          </TouchableOpacity>
          <Text className="p-5 text-center text-4xl  font-ABeeZeeRegular text-white">
            Edit Customer
          </Text>
          <TouchableOpacity onPress={() => deleteUser()}>
            <View>
              <MaterialIcons
                name="delete"
                size={30}
                color="#FFD700"
                className="bg-tealBlue/50 p-2 rounded-xl"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex  items-center mt-[50px] w-full">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="size-40 rounded-full relative border-4 border-navyBlue"
              resizeMode="stretch"
            />
          ) : (
            <Image
              source={form.profile ? { uri: form.profile } : form.avatarImg}
              className="size-40 rounded-full relative border-4 border-navyBlue"
              resizeMode="stretch"
            />
          )}

          <TouchableOpacity
            className="absolute right-36 bottom-[-4]"
            onPress={() => getAvatar()}
          >
            <Ionicons
              name="pencil-sharp"
              size={26}
              color="black"
              className="bg-accentGold rounded-full p-3"
            />
          </TouchableOpacity>
        </View>
        <View className="flex p-5 mt-5 gap-5">
          <TextField
            name="Name"
            icon="person-sharp"
            placeholder="Enter customer's name"
            value={form.name}
            onChangeText={(text) => {
              if (error.name) {
                delete error.name;
              }
              setForm({ ...form, name: text });
            }}
          />
          {error.name && (
            <Text className="text-red-500 text-2xl">{error.name}</Text>
          )}
          <TextField
            name="Phone"
            icon="call"
            placeholder="Enter customer's phone number"
            value={form.phone}
            onChangeText={(text) => {
              if (error.phone) {
                delete error.phone;
              }
              setForm({ ...form, phone: text });
            }}
            keyboardType="phone-pad"
          />
          {error.phone && (
            <Text className="text-red-500 text-2xl">{error.phone}</Text>
          )}
          <TextField
            name="Location"
            icon="map"
            placeholder="Enter customer's location"
            onChangeText={(text) => {
              if (error.location) {
                delete error.location;
              }
              setForm({ ...form, location: text });
            }}
            value={form.location}
          />
          {error.location && (
            <Text className="text-red-500 text-2xl">{error.location}</Text>
          )}
          <TextField
            name="Bill (Optional)"
            icon="cash-sharp"
            placeholder="Enter customer's amount"
            value={form.bill}
            onChangeText={(text) => setForm({ ...form, bill: text })}
            keyboardType="numeric"
          />
          <View className="flex flex-row items-center justify-between p-2 pr-5 shadow shadow-tealBlue bg-white">
            <Text className="text-3xl font-InterVariable font-extrabold">
              Mkula
            </Text>
            <Switch
              thumbColor="#FFD700"
              trackColor={{ true: "#12708a", false: "gray" }}
              value={form.mkula}
              onValueChange={() => setForm({ ...form, mkula: !form.mkula })}
              style={{
                transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
              }}
            />
          </View>
          {form.mkula &&
            (form.imageUri ? (
              <View className="flex-1 items-center border-2 border-tealBlue rounded-lg p-1 bg-tealBlue relative">
                <Image
                  source={{ uri: form.imageUri }}
                  className="w-[300px] h-[300px]"
                />
                <TouchableOpacity
                  className="absolute right-1 top-[-5] bg-accentGold p-2 rounded-lg"
                  onPress={() => getQRImage()}
                >
                  <FontAwesome name="edit" size={44} color="#12708a" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => getQRImage()}>
                <View className="flex h-[300px] w-full border border-teal items-center justify-center rounded-xl mb-5 gap-3 bg-tealBlue">
                  <AntDesign name="addfile" size={40} color="white" />
                  <Text className="text-2xl font-bold text-white">
                    Upload customer's Mkula QR code
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full p-5 bg-white ">
        <TouchableOpacity onPress={() => updateForm()}>
          <View className="p-5 flex-row gap-3 items-center justify-center bg-accentGold rounded-lg">
            <Text className="text-2xl text-tealBlue font-extrabold">
              Update
            </Text>
            <FontAwesome name="send" size={24} color="#12708a" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
