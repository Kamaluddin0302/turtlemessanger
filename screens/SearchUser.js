import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase";

export default function SearchUser() {
  let [Search, setSearch] = useState("");
  let [user, setUser] = useState([]);
  let [loading, setLoading] = useState(false);
  let navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (event) => setSearch(event.nativeEvent.text),
        placeholder: "Search User",
        autoFocus: true,
      },
    });
    getData();
  }, [navigation]);

  let getData = async () => {
    setLoading(true);
    let users = [];
    const q = await query(
      collection(database, "users"),
      where("uid", "!=", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach(async (doc) => {
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

  let filterUser = user?.filter((val) =>
    val.name.toLowerCase().includes(Search.toLowerCase())
  );
  return (
    <View>
      {filterUser.length > 0 ? (
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
      )}
    </View>
  );
}

let styles = StyleSheet.create({
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
