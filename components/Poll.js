import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { auth } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function Poll({ Data, UpdatePoll, uid }) {
  return (
    <View style={styles.container}>
      <Text style={styles.Question}>{Data.pollQ}</Text>
      <View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            padding: 5,
            borderRadius: 10,
            paddingBottom: 10,
            borderColor: "lightgray",
            marginVertical: 2,
          }}
          onPress={() => UpdatePoll(Data, "pollOption1", Data.totalVote, uid)}
        >
          <View style={styles.options}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Data.pollOption1.voterUids.includes(auth.currentUser.uid) ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="lightgray"
                 />
              )}
              <Text style={styles.optionsText}>{Data.pollOption1.option}</Text>
            </View>
            <Text>
              {Data.totalVote === 0
                ? 0
                : (Data.pollOption1.count / Data.totalVote) * 100}
              %
            </Text>
          </View>
          <View style={styles.mainBar}>
            <View
              style={[
                styles.bar,
                {
                  width: `${
                    Data.totalVote === 0
                      ? 0
                      : (Data.pollOption1.count / Data.totalVote) * 100
                  }%`,
                },
              ]}
            >
              <View style={styles.selectBar}></View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            padding: 5,
            borderRadius: 10,
            paddingBottom: 10,
            borderColor: "lightgray",
            marginVertical: 2,
          }}
          onPress={() => UpdatePoll(Data, "pollOption2", Data.totalVote, uid)}
        >
          <View style={styles.options}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Data.pollOption2.voterUids.includes(auth.currentUser.uid) ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="lightgray"
                />
              )}
              <Text style={styles.optionsText}>{Data.pollOption2.option}</Text>
            </View>
            <Text>
              {Data.totalVote === 0
                ? 0
                : (Data.pollOption2.count / Data.totalVote) * 100}
              %
            </Text>
          </View>
          <View style={styles.mainBar}>
            <View
              style={[
                styles.bar,
                {
                  width: `${
                    Data.totalVote === 0
                      ? 0
                      : (Data.pollOption2.count / Data.totalVote) * 100
                  }%`,
                },
              ]}
            >
              <View style={styles.selectBar}></View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            padding: 5,
            borderRadius: 10,
            paddingBottom: 10,
            borderColor: "lightgray",
            marginVertical: 2,
          }}
          onPress={() => UpdatePoll(Data, "pollOption3", Data.totalVote, uid)}
        >
          <View style={styles.options}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Data.pollOption3.voterUids.includes(auth.currentUser.uid) ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="lightgray"
                />
              )}
              <Text style={styles.optionsText}>{Data.pollOption3.option}</Text>
            </View>
            <Text>
              {" "}
              {Data.totalVote === 0
                ? 0
                : (Data.pollOption3.count / Data.totalVote) * 100}{" "}
              %
            </Text>
          </View>
          <View style={styles.mainBar}>
            <View
              style={[
                styles.bar,
                {
                  width: `${
                    Data.totalVote === 0
                      ? 0
                      : (Data.pollOption3.count / Data.totalVote) * 100
                  }%`,
                },
              ]}
            >
              <View style={styles.selectBar}></View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  container: {},
  Question: {
    fontWeight: "bold",
  },
  options: {
    marginVertical: 5,
    padding: 6,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  optionsText: {
    color: "black",
  },
  mainBar: {
    height: 7,
    backgroundColor: "#dddee4",
    borderRadius: 10,
  },
  bar: {
    height: 7,
    backgroundColor: "#127fe5",
    borderRadius: 10,
  },
});
