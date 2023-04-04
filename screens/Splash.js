import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
export default function SplashScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#507371",
      }}
    >
      <Image
        source={require("../assets/tic.png")}
        style={{ width: 350, height: 400, resizeMode: "center" }}
      />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "white",
          fontStyle: "italic",
        }}
      >
        Moccasin Telegraph
      </Text>
    </View>
  );
}
