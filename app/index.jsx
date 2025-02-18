import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Image, View, Animated, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      router.replace("tabs/customers");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./../assets/images/logo.png")}
        style={[styles.img, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Better than using `width` and `height`
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  img: {
    width: 200,
    height: 200,
  },
});
