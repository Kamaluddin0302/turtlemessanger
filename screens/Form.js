import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { useNavigation } from "@react-navigation/native";

export default function FormScreen() {
  const { register, handleSubmit, setValue } = useForm();
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const onChangeField = useCallback(
    (name) => (text) => {
      setValue(name, text);
    },
    []
  );

  useEffect(() => {
    register("date");
    register("name");
    register("taskAccomplished");
    register("totalNoOfHours");
  }, [register]);

  const onSubmit = useCallback(async (formData) => {
    console.log(formData);
    const docRef = await addDoc(collection(database, "forms"), {
      createdAt: new Date(),
      date: formData.date,
      name: formData.name,
      taskAccomplished: formData.taskAccomplished,
      totalNoOfHours: formData.totalNoOfHours,
    });
    console.log("Document written with ID: ", docRef.id);
  }, []);

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
          Form
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Enter Data</Text>
          <TextInput
            style={styles.input}
            autoCompleteType="date"
            keyboardType="date"
            textContentType="date"
            placeholder="Date"
            onChangeText={onChangeField("date")}
          />
          {/* <DatePicker
            style={styles.input}
            date={date.toString()} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            maxDate="01-01-2050"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(date) => {
              setDate(date);
            }}
          /> */}
          <TextInput
            style={styles.input}
            autoCompleteType="name"
            keyboardType="name"
            textContentType="name"
            placeholder="Name"
            onChangeText={onChangeField("name")}
          />
          <TextInput
            style={styles.input}
            autoCompleteType="taskAccomplished"
            keyboardType="taskAccomplished"
            textContentType="taskAccomplished"
            placeholder="Task Accomplished"
            onChangeText={onChangeField("taskAccomplished")}
          />

          <TextInput
            style={styles.input}
            autoCompleteType="totalNoOfHours"
            keyboardType="totalNoOfHours"
            textContentType="totalNoOfHours"
            placeholder="Total No. of Hours"
            onChangeText={onChangeField("totalNoOfHours")}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Upload")}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
              {" "}
              Upload Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
              {" "}
              Submit
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        <StatusBar barStyle="light-content" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#507371",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: "100%",
    height: "78%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#507371",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
