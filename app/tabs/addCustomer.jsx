import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Switch,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useContext, useEffect, useState } from "react";
import { cars } from "../../constants/newCustomer";
import TextField from "../../components/TextField";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getCustomers,
  pickImage,
  QRImage,
  saveImage,
  storeCustomer,
} from "../../utils/customerUtils";
import { useRouter } from "expo-router";
import { DataContext } from "../../DataContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function addCustomer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedQRImage, setSelectedQRImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const { data, setData } = useContext(DataContext);
  const router = useRouter();

  const { width, height } = Dimensions.get("window"); // Get screen width and height

  useEffect(() => {
    const myCar = cars[Math.floor(Math.random() * cars.length)];

    setAvatar(myCar);
    setForm((prevForm) => ({
      ...prevForm,
      avatarImg: myCar,
    }));
  }, []);

  const [form, setForm] = useState({
    customerId: null,
    avatarImg: avatar,
    profile: null,
    name: "",
    phone: "",
    location: "",
    bill: [],
    mkula: false,
    imageUri: null,
  });

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

  const registerForm = async () => {
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
    const customerExists = data.some(
      (customer) => customer.phone === form.phone
    );

    if (customerExists) {
      Alert.alert("Failed", "Customer already exists");
      return null;
    }
    const uniqId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    form.customerId = uniqId;
    const profilePath = await saveImage(form?.profile);
    const imageUriPath = await saveImage(form?.imageUri);
    storeCustomer({
      ...form,
      profile: profilePath,
      imageUri: imageUriPath,
    });
    setData((prevData) => [...prevData, form]);

    setIsEnabled(false);
    setSelectedImage(null);
    setForm({
      avatarImg: avatar,
      profile: null,
      name: "",
      phone: "",
      location: "",
      bill: "",
      mkula: false,
      imageUri: null,
    });
    ToastAndroid.show("Customer Registered Successfully", ToastAndroid.SHORT);
    router.push("/tabs/customers");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View
          style={{
            width: "100%",
            height: height * 0.2, // Adjusted height as a percentage of screen height
            backgroundColor: "#12568a",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: width > 400 ? 32 : 28, // Responsive font size
              color: "white",
              fontFamily: "ABeeZeeRegular",
            }}
          >
            New Customer
          </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: -40 }}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.1,
                borderWidth: 4,
                borderColor: "#12568a",
              }}
              resizeMode="stretch"
            />
          ) : (
            <Image
              source={require("./../../assets/images/imageAvatar.png")}
              style={{
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.1,
                borderWidth: 4,
                borderColor: "#12568a",
                backgroundColor: "#FFD700",
              }}
              resizeMode="stretch"
            />
          )}

          <TouchableOpacity
            style={{
              position: "absolute",
              right: width * 0.1,
              bottom: -5,
            }}
            onPress={() => getAvatar()}
          >
            <MaterialIcons
              name="add-a-photo"
              size={26}
              color="black"
              style={{
                backgroundColor: "#FFD700",
                borderRadius: 50,
                padding: 8,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, marginTop: 20 }}>
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
            <Text style={{ color: "red", fontSize: 16 }}>{error.name}</Text>
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
            <Text style={{ color: "red", fontSize: 16 }}>{error.phone}</Text>
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
            <Text style={{ color: "red", fontSize: 16 }}>{error.location}</Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              backgroundColor: "white",
              shadowColor: "teal",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mkula</Text>
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
            (isEnabled ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#12708a",
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: "#12708a",
                }}
              >
                <Image
                  source={{ uri: selectedQRImage }}
                  style={{ width: 300, height: 300 }}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={() => getQRImage()}>
                <View
                  style={{
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#12708a",
                    backgroundColor: "#12708a",
                    borderRadius: 15,
                    marginBottom: 20,
                  }}
                >
                  <AntDesign name="addfile" size={40} color="white" />
                  <Text
                    style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                  >
                    Upload customer's Mkula QR code
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 20,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity onPress={() => registerForm()}>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFD700",
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 20, color: "#12708a", fontWeight: "bold" }}
            >
              Register
            </Text>
            <FontAwesome name="send" size={24} color="#12708a" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
