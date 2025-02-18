import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "../../DataContext"; // Ensure this file exists!

export default function RootLayout() {
  const [data, setData] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        let customer = await AsyncStorage.getItem("customer");
        if (!customer) {
          await AsyncStorage.setItem("customer", JSON.stringify([]));
          customer = "[]";
        }
        setData(JSON.parse(customer));
      } catch (error) {
        console.error("Error fetching customers:", error);
        setData([]);
      }
    };

    getData();
  }, []);

  // Update pending count when data changes
  useEffect(() => {
    const getPending = () => {
      const pendingCustomers = data.reduce(
        (count, customer) =>
          count +
          (customer.bill
            ? customer.bill.filter((item) => item.status === "pending").length
            : 0),
        0
      );
      setPendingCount(pendingCustomers);
    };

    getPending();
  }, [data]); // Runs whenever `data` changes

  const tabStyle = {
    backgroundColor: "rgba(18, 112, 138, 0.43)",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
  };

  const setIcon = (color, iconName, size = 30, showBadge = false) => (
    <View style={{ position: "relative" }}>
      <Ionicons name={iconName} size={size} color={color} />
      {showBadge && pendingCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -10,
            top: -8,
            borderWidth: 1,
            borderColor: "white",

            backgroundColor: "red",
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
            {pendingCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <DataContext.Provider value={{ data, setData }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: tabStyle,
          tabBarActiveBackgroundColor: "transparent",
          tabBarPressOpacity: 1,
        }}
      >
        <Tabs.Screen
          name="customers"
          options={{
            tabBarIcon: ({ color }) => setIcon(color, "people"),
            tabBarLabel: "Customers",
            tabBarLabelStyle: { fontFamily: "ABeeZee-Regular", fontSize: 12 },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "white",
          }}
        />
        <Tabs.Screen
          name="mkula"
          options={{
            tabBarIcon: ({ color }) => setIcon(color, "card"),
            tabBarLabel: "Mkula",
            tabBarLabelStyle: { fontFamily: "ABeeZee-Regular", fontSize: 12 },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "white",
          }}
        />
        <Tabs.Screen
          name="addCustomer"
          options={{
            tabBarIcon: ({ color }) => setIcon(color, "add-circle", 30),
            tabBarLabel: "",
            tabBarLabelStyle: { fontFamily: "ABeeZee-Regular", fontSize: 12 },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "white",
          }}
        />
        <Tabs.Screen
          name="paid"
          options={{
            tabBarIcon: ({ color }) =>
              setIcon(color, "checkmark-done-circle-sharp"),
            tabBarLabel: "Paid",
            tabBarLabelStyle: { fontFamily: "ABeeZee-Regular", fontSize: 12 },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "white",
          }}
        />
        <Tabs.Screen
          name="pending"
          options={{
            tabBarIcon: ({ color }) =>
              setIcon(color, "hourglass-sharp", 25, true),
            tabBarLabel: "Pending",
            tabBarLabelStyle: { fontFamily: "ABeeZee-Regular", fontSize: 12 },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "white",
          }}
        />
      </Tabs>
    </DataContext.Provider>
  );
}
