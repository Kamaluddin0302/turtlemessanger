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
} from "react-native";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  view: {
    width: "auto",
    height: "auto",
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    fontWeight: "bold",
    fontSize: 25,
    // padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default function SurveyScreen() {
  const [text, onChangeText] = React.useState("");
  const navigator = useNavigation();

  return (
    <View>
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
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Survey
        </Text>
      </View>
      <Text style={styles.view}>1.Lorem Ipsum?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Text style={styles.view}>2.Lorem Ipsum?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Text style={styles.view}>3.Lorem Ipsum?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Text style={styles.view}>4.Lorem Ipsum?</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
       <Btn
          title="Submit"
          style={{ alignSelf: "center" }}
            onClick={() => {navigator.navigate("Home")}}
          />
    </View>
  );
}
