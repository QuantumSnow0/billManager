import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
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
import * as Linking from "expo-linking";

const { width } = Dimensions.get("window");

export default function Customers() {
  const [filtered, setFiltered] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const router = useRouter();
  const { data } = useContext(DataContext);
  const [topCustomer, setTopCustomer] = useState([]);
  useEffect(() => {
    const filterData = () => {
      const add = data.filter(
        (customer) =>
          Array.isArray(customer.bill) &&
          customer.bill.reduce((acc, curr) => acc + curr.amount, 0) > 2000
      );
      const results = add.sort((a, b) => b.bill.length - a.bill.length);
      setTopCustomer(results);
    };
    filterData();
  }, [data]);
  const results = useMemo(() => {
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filtered.toLowerCase()) ||
        item.phone?.includes(filtered)
    );
  }, [filtered, data]);
const organise = results.sort((a, b) => a.name.localeCompare(b.name))
  const renderItem = ({ item }) => (
    <View style={styles.customerContainer} key={item.customerId}>
      <View style={styles.profileContainer}>
        <Image
          source={item.profile ? { uri: item.profile } : item.avatarImg}
          style={styles.profileImage}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.customerInfo}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCustomer(item);
            setShowModal(true);
          }}
        >
          <Text style={styles.customerName}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.customerPhone}>{item.phone}</Text>
        <Text style={styles.customerLocation}>{item.location}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedCustomer(item);
          setShowBill(true);
        }}
      >
        <View style={styles.addBillButton}>
          <FontAwesome6 name="add" size={24} color="blue" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#12568a", "#12728a"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="people" size={40} color="#FFD700" />
            <Text style={styles.title}>All Customers</Text>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={30} color="black" />
          <TextInput
            style={styles.searchInput}
            placeholder="Name or phone"
            value={filtered}
            onChangeText={setFiltered}
          />
        </View>
      </LinearGradient>
      {topCustomer.length > 0 && (
        <View className="p-5">
          <View>
            <Text style={{ fontSize: width * 0.05, fontWeight: "800" }}>
              Top Customers
            </Text>
          </View>
          <FlatList
            data={topCustomer}
            horizontal
            showsHorizontalScrollIndicator={false} // Optional, for cleaner UI
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-1 flex-row justify-between gap-4 m-2 p-2 shadow shadow-black bg-white rounded-lg"
                onPress={() => Linking.openURL(`tel: ${item.phone}`)}
              >
                <View>
                  <Image
                    source={
                      item.profileImg
                        ? { uri: item.profileImg }
                        : item.avatarImg
                    }
                    resizeMode="stretch"
                    style={{ width: width * 0.2, height: width * 0.2 }}
                  />
                </View>
                <View className="flex-1 flex-col gap-1">
                  <Text style={{ fontSize: width * 0.05, color: "#12728a" }}>
                    {item.name}
                  </Text>
                  <TouchableOpacity>
                    <Text>{item.phone}</Text>
                  </TouchableOpacity>
                  <Text>{item.location}</Text>
                  <Text>Orders : {item.bill.length}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View style={styles.listContainer}>
        <FlatList
          data={organise}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: width * 0.06,
    paddingLeft: 10,
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  searchInput: { flex: 1, fontSize: width * 0.05 },
  listContainer: { padding: 16, flex: 1 },
  customerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  profileContainer: {
    borderWidth: 2,
    borderColor: "#12728a",
    padding: 4,
    borderRadius: 50,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  customerInfo: { marginLeft: 10, flex: 1 },
  customerName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#12728a",
  },
  customerPhone: { fontSize: width * 0.05 },
  customerLocation: { fontSize: width * 0.04, color: "gray" },
  addBillButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
