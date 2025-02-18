import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { DataContext } from "../../DataContext";
import { getCustomers, updateCustomer } from "../../utils/customerUtils";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const { width, height } = Dimensions.get("window");

export default function Pending() {
  const [filtered, setFiltered] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allBills, setAllBills] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [date, setDate] = useState(new Date());
  const isoDate = date.toISOString().split("T")[0];
  const router = useRouter();
  const { data, setData } = useContext(DataContext);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (Platform.OS === "android") {
      setShow(false);
    }
  };

  useEffect(() => {
    const customerBill = data
      .map((customer) => ({
        ...customer,
        bill: (customer.bill || []).filter(
          (trans) => trans.status === "pending" && trans.date === isoDate
        ),
      }))
      .filter((customer) => customer.bill.length > 0);

    setAllBills(customerBill);
  }, [data, isoDate]);

  const results = useMemo(() => {
    return allBills.filter(
      (item) =>
        item.name?.toLowerCase().includes(filtered.toLowerCase()) ||
        item.phone?.includes(filtered)
    );
  }, [filtered, allBills]);

  const customerByBill = useMemo(() => {
    return results.flatMap((customer) =>
      customer.bill.map((bills) => ({
        name: customer.name,
        billId: customer.billId,
        location: customer.location,
        avatarImg: customer.avatarImg,
        amount: customer.amount,
        time: customer.time,
        profile: customer.profile,
        ...bills,
      }))
    );
  }, [filtered, allBills]);

  const updateStatus = async (customerId) => {
    try {
      const fetchCustomers = await getCustomers();

      const updatedCustomers = fetchCustomers.map((customer) => {
        if (customer.bill) {
          return {
            ...customer,
            bill: customer.bill.map((bill) =>
              bill.billId === customerId ? { ...bill, status: "paid" } : bill
            ),
          };
        }
        return customer;
      });

      const updatedCustomer = updatedCustomers.find((customer) =>
        customer.bill.some((bill) => bill.billId === customerId)
      );

      if (updatedCustomer) {
        await updateCustomer(updatedCustomer);
      }

      setData((prevData) =>
        prevData.map((item) =>
          item.customerId === updatedCustomer?.customerId
            ? updatedCustomer
            : item
        )
      );
    } catch (error) {
      console.error("Error updating bill status:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#12568a", "#12728a"]}
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingHorizontal: width * 0.05,
          paddingTop: height * 0.03,
          paddingBottom: height * 0.02,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <FontAwesome5 name="user-check" size={width * 0.1} color="#FFD700" />
          <Text
            style={{
              fontSize: width * 0.07,
              fontFamily: "ABeeZeeRegular",
              color: "white",
            }}
          >
            Pending Customers
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 15,
            padding: 10,
            marginTop: height * 0.02,
          }}
        >
          <Ionicons name="search" size={width * 0.07} color="black" />
          <TextInput
            style={{ flex: 1, fontSize: width * 0.05 }}
            placeholder="Name or phone"
            value={filtered}
            onChangeText={setFiltered}
          />
        </View>
      </LinearGradient>

      <View
        style={{
          flex: 1,
          paddingHorizontal: width * 0.05,
          paddingTop: height * 0.02,
        }}
      >
        <TouchableOpacity onPress={() => setShow(true)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFD700",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              marginBottom: height * 0.02,
            }}
          >
            <Entypo name="calendar" size={width * 0.07} color="#12708a" />
            <Text
              style={{
                fontSize: width * 0.05,
                color: "#12708a",
                fontWeight: "bold",
              }}
            >
              {isoDate}
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={customerByBill}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: height * 0.015,
                shadowColor: "black",
                shadowOpacity: 0.2,
                elevation: 3,
              }}
            >
              <Image
                source={item.profile ? { uri: item.profile } : item.avatarImg}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: 10,
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  flex: 1,
                  paddingLeft: 20,
                }}
              >
                <View className="flex flex-row gap-2 items-center mb-1">
                  <FontAwesome6
                    name="user-large"
                    size={width * 0.05}
                    color="#12708a"
                  />
                  <Text
                    style={{
                      fontSize: width * 0.05,
                      fontWeight: "bold",
                      color: "#12708a",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center mb-1">
                  <FontAwesome5
                    name="money-bill"
                    size={width * 0.04}
                    color="#12708a"
                  />
                  <Text style={{ fontSize: width * 0.04 }}>
                    ksh: {item.amount}
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center mb-1">
                  <FontAwesome5
                    name="location-arrow"
                    size={width * 0.04}
                    color="#12708a"
                  />
                  <Text style={{ fontSize: width * 0.04, color: "gray" }}>
                    {item.location}
                  </Text>
                </View>
                <View className="flex flex-row gap-2 items-center mb-1">
                  <FontAwesome5
                    name="clock"
                    size={width * 0.04}
                    color="#12708a"
                  />
                  <Text style={{ fontSize: width * 0.04, color: "gray" }}>
                    {item.time}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => updateStatus(item.billId)}>
                <Text
                  style={{
                    backgroundColor: "#FFD700",
                    padding: 8,
                    borderRadius: 10,
                    color: "green",
                    fontSize: width * 0.05,
                  }}
                >
                  Paid
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
