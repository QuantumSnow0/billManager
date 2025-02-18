import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export default function TextField({
  onPress = () => {},
  name,
  icon,
  placeholder,
  keyboardType = "default",
  setValue,
  ...props
}) {
  const { width, height } = useWindowDimensions(); // Get the screen dimensions

  // Define font size and padding based on screen width for responsiveness
  const textInputStyle = {
    flex: 1,
    fontSize: width < 350 ? 14 : 16, // Adjust font size for smaller screens
    paddingHorizontal: width < 350 ? 10 : 15,
  };

  const labelStyle = {
    fontSize: width < 350 ? 16 : 18, // Adjust label size
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
      <Text style={[labelStyle, { marginBottom: 8 }]}>{name}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 2,
          borderRadius: width < 350 ? 20 : 24,
          padding: 0,
          borderColor: "#12568a",
        }}
      >
        <TouchableWithoutFeedback onPress={onPress}>
          <Ionicons
            name={icon}
            size={width < 350 ? 20 : 24} // Adjust icon size based on screen width
            color="white"
            style={{
              backgroundColor: "#12568a",
              padding: width < 350 ? 8 : 10,
              borderRadius: 50,
            }}
          />
        </TouchableWithoutFeedback>
        <TextInput
          placeholder={placeholder}
          style={textInputStyle}
          keyboardType={keyboardType}
          {...props}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
