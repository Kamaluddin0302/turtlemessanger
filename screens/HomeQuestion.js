import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text } from "react-native";

export default function HomeQuestionScreen() {
  return (
    <>
      <View
        style={{
          padding: 10,
          backgroundColor: "#304544",
          paddingTop: 55,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            paddingRight: 180,
            color: "#ffffff",
          }}
        >
          MT
        </Text>
         {/* <Ionicons
          onPress={() => navigator.navigate("Home")}
          name="return-up-back-outline"
          size={30}
          color="#ffffff"
        /> */}
      </View>
    </>
  );
}
