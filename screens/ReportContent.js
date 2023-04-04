import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function ReportContentScreen() {
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
      padding: 25,
      // padding: 10,
    },
  });
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
          Content
        </Text>
      </View>
      <View style={{flexDirection:"row", justifyContent:"space-evenly",paddingTop: 10}}>
        <Text style={{fontSize: 20, backgroundColor:"#d9dbda", fontWeight:"600", padding:5}}>All</Text>
        <Text style={{fontSize: 20, backgroundColor:"#d9dbda", fontWeight:"600", padding: 5}}>Last 30 days</Text>
        <MaterialCommunityIcons style={{fontSize: 20, fontWeight:"600", padding: 5}} name="filter"></MaterialCommunityIcons>
      </View>
      <View
        style={{
          borderBottomColor: "#304544",
          paddingTop: 20,
          borderBottomWidth: 3,
        }}/>
      <Text style={{paddingLeft: 10, paddingTop:10, fontSize: 20, fontWeight: "bold"}}>Accounts Reached</Text>
      <View
        style={{
          borderBottomColor: "#304544",
          paddingTop: 10,
          borderBottomWidth: 3,
        }}/>
        <Text style={{textAlign:"center", fontWeight: "bold", fontSize: 20, padding: 30}}>No Post Available</Text>
    </>
  );
}
