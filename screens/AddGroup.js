import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { auth, database } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function AddGroup({ route }) {
  let navigation = useNavigation();

  let [user, setUser] = useState([]);
  let [loading, setLoading] = useState(true);
  let [update, setUpdate] = useState(true);
  let [name, setName] = useState("");
  let [participant, setParticipant] = useState([auth.currentUser.uid]);
  let [search, setSearch] = useState("");

  useEffect(() => {
    getData();
  }, []);

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

  let add = (uid) => {
    let participantArray = participant;
    participantArray.push(uid);
    setParticipant(participantArray);
    setUpdate(!update);
  };

  let remove = (uid) => {
    console.log(uid, "========");
    let participantArray = participant;
    const index = participantArray.indexOf(uid);

    const x = participantArray.splice(index, 1);

    setParticipant(participantArray);
    setUpdate(!update);
  };

  let creatGroup = async () => {
    console.log(participant);
    if (name === "") {
      alert("please Enter Circle Name");
    } else {
      const collectionRef = collection(database, "AllGroups");
      const q = query(collectionRef, where("name", "==", name));
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs.length, "============");
      if (querySnapshot.docs.length) {
        alert("This Circle Name Is Already Present");
      } else {
        addDoc(collection(database, "AllGroups"), {
          name: name,
          participant: participant,
        }).then(() => {
          alert("Circle Added Successfully");
          navigation.navigate("ChatWith");
        });
      }
    }
  };

  let filterUser = user?.filter((val) =>
    val.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Add Circle Name"
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search Users"
        onChangeText={(text) => setSearch(text)}
      />
      {filterUser.length > 0 ? (
        filterUser.map((val, ind) => (
          <TouchableOpacity style={styles.card} key={ind}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.avtar}>
                <Text style={styles.avtarText}>{val.name.slice(0, 2)}</Text>
              </View>
              <Text style={styles.name}>{val.name}</Text>
            </View>
            {!participant.includes(val.uid) ? (
              <TouchableOpacity style={styles.add} onPress={() => add(val.uid)}>
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.remove}
                onPress={() => remove(val.uid)}
              >
                <Text style={{ color: "white" }}>Added</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))
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

      <TouchableOpacity style={styles.CreateGroup} onPress={() => creatGroup()}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Create Circle
        </Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
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
    backgroundColor: "white",
    height: 30,
    // borderRadius: 50,
    // elevation: 5,
    // paddingLeft: 20,
    borderBottomColor: "green",
    borderBottomWidth: 1,
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    height: 50,
  },
  searchInput: {
    backgroundColor: "white",
    height: 30,
    // borderRadius: 50,
    // elevation: 5,
    // paddingLeft: 20,
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    height: 50,
    borderRadius: 50,
    borderColor: "green",
    borderWidth: 1,
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
  add: {
    backgroundColor: "green",
    padding: 5,
    width: "20%",
    alignItems: "center",
    elevation: 5,
    borderRadius: 5,
  },
  remove: {
    backgroundColor: "red",
    padding: 5,
    width: "20%",
    alignItems: "center",
    elevation: 5,
    borderRadius: 5,
  },
  CreateGroup: {
    alignSelf: "center",
    backgroundColor: "white",
    marginTop: 20,
    padding: 10,
    width: "60%",
    alignItems: "center",
    elevation: 5,
    borderRadius: 10,
  },
});
