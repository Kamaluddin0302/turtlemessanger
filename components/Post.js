import React from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "./Btn";

export default function Post() {
  const navigator = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: "#d9dbda",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>
          What is Lorem Ipsum?
        </Text>
        <Image
          source={require("../assets/tic.png")}
          style={{ width: "auto", height: 200, resizeMode: "center" }}
        />
        <Text style={{ fontSize: 20, fontWeight: "300", color: "#000" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Text>
        <Button
          title="Learn more"
          style={{ alignSelf: "center" }}
          onClick={() => {navigator.navigate("Survey")}}
        />
      </View>
    </View>
  );
}
