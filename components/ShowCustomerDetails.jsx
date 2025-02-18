import {
  View,
  Text,
  Modal,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import EditPage from "./EditPage";
import { DataContext } from "../DataContext";
const { width, height } = Dimensions.get("window");

export default function ShowCustomerDetails({ customer, setShowModal }) {
  const { data, setData } = useContext(DataContext);
  const [localData, setLocalData] = useState({});
  const [editModal, setEditModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const foundCustomer = data.find(
      (item) => item.customerId === customer.customerId
    );
    if (foundCustomer) {
      setLocalData(foundCustomer);
    }
  }, [data, customer]);

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View className="w-full h-full bg-black/30">
        <View
          style={{
            flex: 1,
            width,
            height: height * (3 / 4),
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          }}
        >
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity>
                <View className="flex items-center bg-tealBlue/50 rounded-full">
                  <Ionicons
                    name="arrow-back-circle-sharp"
                    size={40}
                    color="#FFD700"
                    onPress={() => setShowModal(false)}
                  />
                </View>
              </TouchableOpacity>
              <Text className="text-3xl  font-extrabold">{localData.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditModal(true)}>
              <View>
                <FontAwesome5
                  name="user-edit"
                  size={24}
                  color="#FFD700"
                  className="bg-tealBlue/50 p-2 rounded-xl"
                />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="flex w-full items-center mt-10">
              {localData.profile ? (
                <Image
                  source={{
                    uri: localData.profile,
                  }}
                  className="size-[200px] rounded-3xl object-cover"
                  resizeMode="stretch"
                />
              ) : (
                <Image
                  source={localData.avatarImg}
                  className="size-[200px] rounded-3xl object-cover"
                  resizeMode="stretch"
                />
              )}
            </View>
            <View className="flex flex-row items-center gap-6 p-2 mt-5">
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${localData.phone}`)}
              >
                <FontAwesome5 name="phone-alt" size={24} color="#1e23bd" />
              </TouchableOpacity>
              <Text className="text-[30px] font-ABeeZeeRegular font-extrabold">
                {localData.phone}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-6 p-2">
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color="#12568a"
              />
              <Text className="text-[30px] font-ABeeZeeRegular font-extrabold">
                {localData.location}
              </Text>
            </View>
            {localData.mkula && (
              <View>
                <View className="flex flex-row items-center gap-6 p-2">
                  <Entypo name="v-card" size={40} color="#12568a" />
                  <Text className="text-[30px] font-ABeeZeeRegular font-extrabold">
                    Mkula
                  </Text>
                </View>
                <View className="flex items-center">
                  <Image
                    source={{ uri: localData.imageUri }}
                    className="size-[300px] border-2 border-tealBlue"
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      {editModal && (
        <Modal visible={true} animationType="slide">
          <View className="w-full h-full white">
            <EditPage
              customer={localData}
              setEditModal={(value) => setEditModal(value)}
              setShowModal={(value) => setShowModal(value)}
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
}
