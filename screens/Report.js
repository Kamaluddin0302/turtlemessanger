import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function ReportScreen() {
  const [selected, setSelected] = React.useState("");
  const navigator = useNavigation();

  const data = [
    { label: "Last week", value: "Last week" },
    { label: "Last month", value: "Last month" },
    { label: "Last year", value: "Last year" },
  ];
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
          Report
        </Text>
      </View>
      <View style={{ padding: 10, backgroundColor: "#d9dbda" }}>
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={data}
          save="value"
        />
        {/* <Text>{selected}</Text>  */}
      </View>
      <View
        style={{
          backgroundColor: "#d9dbda",
          borderBottomColor: "#304544",
          paddingTop: 20,
          borderBottomWidth: 3,
        }}
      ></View>
      <Text
        style={{
          fontSize: 25,
          paddingTop: 20,
          fontWeight: "600",
          color: "#000",
          textAlign: "center",
        }}
      >
        Overview
      </Text>
      <Text style={{ textAlign: "center", padding: 20 }}>
        You reached +100% more accounts compared to {"\n"}
        Jan 26 - Feb 01
      </Text>
      <View>
        <Text style={{ padding: 20 }}>
          Account reached: <Text style={{ fontWeight: "600" }}>2</Text>
        </Text>
        <Text style={{ padding: 20 }}>
          Account engaged: <Text style={{ fontWeight: "600" }}>0</Text>
        </Text>
        <Text style={{ padding: 20 }}>
          Total followers: <Text style={{ fontWeight: "600" }}>50</Text>
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: "#304544",
          paddingTop: 20,
          borderBottomWidth: 3,
        }}
      ></View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}>
          Content You Shared
        </Text>
        <TouchableOpacity onPress={() => {navigator.navigate("ReportContent")}} style={{ paddingTop: 15, paddingLeft: 100 }}>
          <Text style={{ color: "blue" }}>See all</Text>
        </TouchableOpacity>
        
      </View>
        <View>
            <MaterialCommunityIcons style={{textAlign:"center", fontWeight:"bold",fontSize: 30, padding: 20}} name="chart-bar" />
        <Text style={{fontWeight:"bold", textAlign:"center"}}>This will tell you about your content</Text>
        <Text style={{textAlign:"center", padding: 5}}>When you share content, you’ll see more data about the accounts you reach</Text>
        </View>
    </>
  );
}
