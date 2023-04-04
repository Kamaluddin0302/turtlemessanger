import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function AllGroup() {
  const navigation = useNavigation();

  let [user, setUser] = useState([]);
  let [loading, setLoading] = useState(true);
  let [search, setSearch] = useState("");
  let [tab, setTab] = useState("Chats");
  useEffect(() => {
    console.log(auth.currentUser.uid);
    let getData = async () => {
      let users = [];
      const q = await query(
        collection(database, "users")
        // where("uid", "!=", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users);
      await users.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      setUser(users);
      setLoading(false);
    };
    getData();
  }, []);

  let filterUser = user?.filter((val) =>
    val.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log(filterUser, "======");
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Chat</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Search By User Name"
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <View style={styles.tabView}>
        <TouchableOpacity
          onPress={() => {
            setTab("Chats");
          }}
          style={[
            styles.lefttab,
            {
              borderBottomColor: "green",
              borderBottomWidth: tab === "Chats" ? 2 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                fontWeight: tab === "Chats" ? "bold" : "normal",
                color: tab === "Chats" ? "green" : "black",
              },
            ]}
          >
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTab("Groups");
          }}
          style={[
            styles.righttab,
            {
              borderBottomColor: "green",
              borderBottomWidth: tab === "Groups" ? 2 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                fontWeight: tab === "Groups" ? "bold" : "normal",
                color: tab === "Groups" ? "green" : "black",
              },
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tab === "Chats" ? (
          filterUser.length > 0 ? (
            filterUser.map((val, ind) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("SingleChat", { data: val })}
                key={ind}
              >
                <View style={styles.avtar}>
                  <Text style={styles.avtarText}>{val.name.slice(0, 2)}</Text>
                </View>
                <Text style={styles.name}>{val.name}</Text>
              </TouchableOpacity>
            ))
          ) : loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 25,
                marginTop: 20,
              }}
            >
              Chat Not Found
            </Text>
          )
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddGroup", user)}
            >
              <Text>Add Group</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

let styles = StyleSheet.create({
  header: {
    // borderBottomWidth: 2,
    borderBottomColor: "gray",
    padding: 10,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "white",
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    marginTop: 10,
    height: 60,
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    // elevation: 5,
    // backgroundColor: "white",
    borderRadius: 5,
    borderBottomColo: "gray",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
  },
  avtar: {
    borderRadius: 50,
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  avtarText: {
    textTransform: "uppercase",
    color: "white",
  },
  name: {
    marginLeft: 20,
  },
  textInput: {
    // backgroundColor: "white",
    height: 30,
    borderRadius: 50,
    // elevation: 5,
    // paddingLeft: 20,
    borderColor: "green",
    // borderBottomWidth: 1,
    borderWidth: 1,
    width: "60%",
    textAlign: "center",
  },
  tabView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    elevation: 5,
    // paddingHorizontal: 10,
    paddingTop: 20,
  },
  lefttab: {
    width: "50%",
    textAlign: "center",
  },
  righttab: {
    width: "50%",
  },
  tabText: {
    textAlign: "center",
    fontSize: 16,
  },
});
