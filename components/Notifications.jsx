import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
} from "react-native-reanimated";
import { DataContext } from "../DataContext";

export default function Notifications() {
  const { data, setData } = useContext(DataContext);
  const [numCustomers, setNumCustomers] = useState(0);
  useEffect(() => {
    const getPending = () => {
      const withBill = data.filter((customer) => customer.bill.length > 0);
      const pendingCustomers = withBill.reduce(
        (count, customer) =>
          count +
          customer.bill.filter((item) => item.status === "pending").length,
        0
      );
      setNumCustomers(pendingCustomers);
    };
    getPending();
  }, [data]);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.5, { duration: 800 }), -1, true);
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [1, 1.5], [0.6, 0]),
    };
  });

  return (
    <TouchableOpacity onPress={() => getPendindCustomers()}>
      <View className="relative items-center justify-center">
        {/* Glowing Circle */}
        {numCustomers > 0 && (
          <Animated.View
            style={animatedPulseStyle}
            className="bg-blue-400 absolute w-14 h-14 rounded-full"
          />
        )}

        {/* Bell Icon */}
        <View className="bg-accentGold p-3 rounded-full shadow-lg">
          <FontAwesome name="bell" size={20} color="#12568a" />
        </View>

        {/* Notification Badge */}
        <View className="bg-red-500 items-center justify-center absolute right-[-3px] top-[-3px] w-6 h-6 rounded-full shadow-md border-2 border-white">
          <Text className="text-xs text-white font-bold">{numCustomers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
