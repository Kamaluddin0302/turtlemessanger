import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPass() {
  let [email, setEmail] = useState("");
  let [send, setSend] = useState("");
  let [error, setError] = useState("");

  let forgetPass = () => {
    setError("");
    setSend("");
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSend("Email Sent Successfully Please check you email");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setError(errorCode);
        // ..
      });
  };
  return (
    <View style={styles.conatiner}>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity
        style={styles.button}
        disabled={email === "" ? true : false}
        onPress={() => forgetPass()}
      >
        <Text style={{ color: "white" }}>Forgot Password</Text>
      </TouchableOpacity>

      {send !== "" && <Text style={styles.sentSucc}>{send}</Text>}
      {error !== "" && <Text style={styles.sentSucc}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    height: 30,
    // borderRadius: 50,
    // elevation: 5,
    // paddingLeft: 20,
    borderBottomColor: "green",
    borderBottomWidth: 1,
    width: "80%",
    // flex: 1,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    height: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "black",
    width: "70%",
    alignSelf: "center",
    marginVertical: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 50,
  },
  sentSucc: {
    textAlign: "center",
    color: "green",
  },
});
