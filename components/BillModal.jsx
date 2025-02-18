import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import TextField from "./TextField";
import DateTimePicker from "@react-native-community/datetimepicker";
import { v4 as uuidv4 } from "uuid";
import Entypo from "@expo/vector-icons/Entypo";
import { updateCustomer } from "../utils/customerUtils";
import "react-native-get-random-values";

export default function BillModal({ onClick, customer }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const { data, setData } = useContext(DataContext);
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);

  const { width, height } = useWindowDimensions();

  const generateBillId = () => uuidv4();

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      mode === "date" ? setDate(selectedDate) : setTime(selectedDate);
    }
    setShow(false);
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const addBill = async () => {
    try {
      const newBill = {
        billId: generateBillId(),
        date: date.toISOString().split("T")[0],
        time: time.toTimeString().split(" ")[0],
        amount,
        status: "pending",
      };

      const updatedCustomer = {
        ...customer,
        bill: [...(customer.bill || []), newBill],
      };

      updateCustomer(updatedCustomer);

      setData((prevData) =>
        prevData.map((item) =>
          item.customerId === customer.customerId ? updatedCustomer : item
        )
      );

      onClick(false);
    } catch (error) {
      console.error("Error adding bill:", error);
    }
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={() => onClick(false)}>
        <View className="w-full h-full bg-black/30 flex justify-center items-center">
          <View
            style={{
              width: width * 0.85,
              maxWidth: 400,
              height: height * 0.5,
              maxHeight: 500,
              borderRadius: 20,
              backgroundColor: "white",
              padding: 20,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <TextField
              name="Date"
              icon="calendar"
              placeholder={date.toISOString().split("T")[0]}
              onPress={() => showMode("date")}
              value={date.toISOString().split("T")[0]}
            />
            <TextField
              name="Time"
              icon="time"
              placeholder={time.toTimeString().split(" ")[0]}
              onPress={() => showMode("time")}
              value={time.toTimeString().split(" ")[0]}
            />

            {/* Amount Section */}
            <View className="flex">
              <Text className="text-2xl font-bold py-2">Amount</Text>
              <View className="flex flex-row items-center justify-around">
                <TouchableOpacity
                  onPress={() => setAmount((prev) => Math.max(0, prev - 100))}
                >
                  <Entypo
                    name="circle-with-minus"
                    size={24}
                    color="white"
                    className="bg-[#12568a] p-2 rounded-full"
                  />
                </TouchableOpacity>
                <TextInput
                  className="border-2 border-navyBlue flex-1 mx-5 rounded-lg text-2xl text-center p-2"
                  keyboardType="numeric"
                  placeholder="0"
                  value={amount.toString()}
                  onChangeText={(text) =>
                    setAmount(text ? parseInt(text, 10) || 0 : 0)
                  }
                />
                <TouchableOpacity
                  onPress={() => setAmount((prev) => prev + 100)}
                  onLongPress={() => setAmount((prev) => prev + 1000)}
                >
                  <Entypo
                    name="circle-with-plus"
                    size={24}
                    color="white"
                    className="bg-[#12568a] p-2 rounded-full"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="w-full bg-accentGold py-3 mt-5 flex items-center rounded-lg"
              disabled={amount === 0}
              onPress={addBill}
            >
              <Text className="text-2xl font-bold text-tealBlue">Submit</Text>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={mode === "date" ? date : time}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
