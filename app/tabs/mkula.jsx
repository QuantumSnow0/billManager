import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import React, { useState, useMemo, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ShowCustomerDetails from "../../components/ShowCustomerDetails";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { DataContext } from "../../DataContext";
import BillModal from "../../components/BillModal";

const { width } = Dimensions.get("window");

export default function Mkula() {
  const [filtered, setFiltered] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const router = useRouter();
  const { data, setData } = useContext(DataContext);

  useEffect(() => {
    console.log("Data from context:", data);
  }, [data]);

  const isMkula = useMemo(() => {
    return data.filter((item) => item.mkula === true);
  }, [filtered, data]);

  const results = useMemo(() => {
    return isMkula.filter(
      (item) =>
        item.name?.toLowerCase().includes(filtered.toLowerCase()) ||
        item.phone?.includes(filtered)
    );
  }, [filtered, isMkula]);

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: width * 0.9,
        alignSelf: "center",
      }}
      key={item.customerId}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor: "#12728a",
          padding: 8,
          borderRadius: 50,
        }}
      >
        <Image
          source={item.profile ? { uri: item.profile } : item.avatarImg}
          style={{ width: 40, height: 40, borderRadius: 50 }}
          resizeMode="stretch"
        />
      </View>
      <View style={{ marginLeft: 16, flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCustomer(item);
            setShowModal(true);
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#12728a",
              textDecorationLine: "underline",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16 }}>{item.phone}</Text>
        <Text style={{ fontSize: 14, color: "#555" }}>{item.location}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedCustomer(item);
          setShowBill(true);
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#FFD700",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="add" size={24} color="blue" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#12568a", "#12728a"]}
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
        }}
      >
        <View style={{ width: "100%", height: 160 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
          >
            <Ionicons name="people" size={40} color="#FFD700" />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginLeft: 10,
              }}
            >
              Mkula Customers
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              marginHorizontal: 16,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 5,
            }}
          >
            <Ionicons name="search" size={24} color="black" />
            <TextInput
              style={{ flex: 1, fontSize: 18, marginLeft: 8 }}
              placeholder="Name or phone"
              value={filtered}
              onChangeText={setFiltered}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={results}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#12728a",
                  marginBottom: 20,
                }}
              >
                No Customers Found
              </Text>
              <TouchableOpacity onPress={() => router.push("tabs/addCustomer")}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <Entypo name="add-user" size={24} color="#12708a" />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#12728a",
                    }}
                  >
                    Add Customer
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.customerId.toString()}
        />
        {showModal && (
          <ShowCustomerDetails
            customer={selectedCustomer}
            setShowModal={setShowModal}
          />
        )}
        {showBill && (
          <BillModal
            customer={selectedCustomer}
            onClick={(value) => setShowBill(value)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
