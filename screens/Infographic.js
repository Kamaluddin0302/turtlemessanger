import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text } from "react-native";
import Button from "../components/Btn";
import ReportScreen from "./Report";
import SurveyScreen from "./Survey";

export default function InfographicScreen() {
  const navigator = useNavigation()
  return (
    <>
      {/* <View
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
          Infographic
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          padding: 10,
          paddingTop: "75%",
          justifyContent: "space-between",
        }}
      > */}
        <SurveyScreen/>
      {/* </View> */}
      
    </>
  );
}
