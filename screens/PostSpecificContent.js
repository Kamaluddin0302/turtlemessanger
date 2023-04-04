import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";



export default function PostSpecificContentScreen() {
    const navigator = useNavigation();
    return (
  <View style={styles.container}>
    <ImageBackground source={require("../assets/tic.png")} resizeMode="contain" style={styles.image}>
      <TouchableOpacity onPress={() => {navigator.navigate("Home")}}><Text  style={styles.text1} >Home</Text></TouchableOpacity>
      {/* <Text style={styles.text2}>Text2</Text> */}

    </ImageBackground>
  </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    height:"100%",
    width:"100%"
  },
  text1: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 1,
    paddingTop: 20
  },
});
