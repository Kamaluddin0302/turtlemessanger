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
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function AllUser() {
  const navigation = useNavigation();

  let [user, setUser] = useState([]);
  let [ALlGroup, setAllGroup] = useState([]);
  let [loading, setLoading] = useState(true);
  let [search, setSearch] = useState("");
  let [tab, setTab] = useState("Chats");
  let [update, setUpdate] = useState(true);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let getData = async () => {
        let users = [];
        const q = await query(
          collection(database, "users"),
          where("uid", "!=", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach(async (doc) => {
          let docId =
            auth.currentUser.uid > doc.data().uid
              ? doc.data().uid + "-" + auth.currentUser.uid
              : auth.currentUser.uid + "-" + doc.data().uid;
          const q1 = await query(
            collection(database, "singleChat"),
            where("specialId", "==", docId)
          );

          onSnapshot(q1, (querySnapshot) => {
            console.log(querySnapshot.docs.length, "========length");
            if (querySnapshot.docs.length > 0) {
              console.log(doc.data(), "data=======");
              users.push(doc.data());
            }
          });
        });
        console.log(users, "==========");
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
        setUpdate(!update);
      };

      let GetGroup = async () => {
        let groups = [];
        const q = await query(
          collection(database, "AllGroups"),
          where("participant", "array-contains", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach((doc) => {
          let group = doc.data();
          group.id = doc.id;
          groups.push(group);
        });
        await groups.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        setAllGroup(groups);
        setLoading(false);
      };
      await getData();
      GetGroup();
    });
  }, []);

  let filterGroups = ALlGroup?.filter((val) =>
    val.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Chat</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Search By User Name"
          onChangeText={(text) => setSearch(text)}
          onPressIn={() => {
            if (tab === "Chats") {
              navigation.navigate("SearchUser");
            }
          }}
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
            setTab("circle");
          }}
          style={[
            styles.righttab,
            {
              borderBottomColor: "green",
              borderBottomWidth: tab === "circle" ? 2 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                fontWeight: tab === "circle" ? "bold" : "normal",
                color: tab === "circle" ? "green" : "black",
              },
            ]}
          >
            Circle
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tab === "Chats" ? (
          user.length > 0 ? (
            user.map((val, ind) => (
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
          <View style={{}}>
            <TouchableOpacity
              style={styles.AddGroup}
              onPress={() => navigation.navigate("AddGroup", user)}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={{ color: "white" }}>Add Circle</Text>
            </TouchableOpacity>
            {filterGroups.length > 0 ? (
              filterGroups.map((val, ind) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("GroupChat", { data: val })
                  }
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
            )}
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
    minHeight: "100%",
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
  AddGroup: {
    flex: 1,
    alignSelf: "flex-end",
    backgroundColor: "green",
    padding: 10,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
