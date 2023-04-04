import React from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Post from "../components/Post";

export default function UserPostScreen() {
  const navigator = useNavigation();
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
          Posts
        </Text>
      </View>
      <Post/>
    </>
  );
}
