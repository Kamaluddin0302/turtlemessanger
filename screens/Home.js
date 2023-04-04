import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

import { Ionicons } from "@expo/vector-icons";
import Post from "../components/Post";
import Button from "../components/Btn";
import { auth, database } from "../config/firebase";

const HomeScreen = () => {
  const navigation = useNavigation();

  // useEffect(() => {
  //     navigation.setOptions({
  //         headerLeft: () => (
  //             <FontAwesome name="search" size={24} color={colors.gray} style={{marginLeft: 15}}/>
  //         ),
  //         headerRight: () => (
  //             <Image
  //                 source={{ uri: catImageUrl }}
  //                 style={{
  //                     width: 40,
  //                     height: 40,
  //                     marginRight: 15,
  //                 }}
  //             />
  //         ),
  //     });
  // }, [navigation]);

  return (
    // <View style={styles.container}>
    //     <TouchableOpacity
    //         onPress={() => navigation.navigate("Chat")}
    //         style={styles.chatButton}
    //     >
    //         <Entypo name="chat" size={24} color={colors.lightGray} />
    //     </TouchableOpacity>
    // </View>
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
        <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            paddingRight: 180,
            color: "#ffffff",
          }}
        >
          Home
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SearchBar")}>
          <Ionicons name="search" size={30} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("HomeQuestion")}>
          <Ionicons name="help-circle" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.view}>
          {/* <SearchBar /> */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#000",
              paddingTop: 10,
            }}
          >
            Introduction
          </Text>
          <Post />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#000",
              paddingTop: 15,
            }}
          >
            History
          </Text>
          <Post />
          <Button
            title="Log Out"
            style={{ alignSelf: "center" }}
            onClick={() =>
              signOut(auth).catch((error) =>
                console.log("Error logging out: ", error)
              )
            }
          />
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: "100%",
    padding: 25,
    // padding: 10,
  },
});

// import { View, Text, TouchableOpacity } from "react-native";
// import React, { useState } from "react";

// export default function Home() {
//   let [update, setUpdate] = useState(true);
//   let [MyInterests, setMyInterest] = useState([
//     {
//       name: "music",
//       tags: ["papaya"],
//     },
//     {
//       name: "sport",
//       tags: ["papaya1"],
//     },
//   ]);

//   let [allInterests, setAllInterest] = useState([
//     {
//       name: "music",
//       tags: ["papaya"],
//     },
//     {
//       name: "sport",
//       tags: ["papaya1", "papaya2"],
//     },
//     {
//       name: "funny",
//       tags: ["papaya1", "papaya2", "papaya3"],
//     },
//   ]);

//   let ChangeCategory = (value, val) => {
//     let flag = true;
//     const isFound = MyInterests.some((element, ind) => {
//       if (element.name === value.name) {
//         flag = false;
//         console.log(ind);
//         const check = element.tags.indexOf(val);

//         if (check !== -1) {
//           MyInterests[ind].tags.splice(check, 1);
//           console.log(MyInterests[ind], "==========");
//           setMyInterest(MyInterests);
//           setUpdate(!update);
//         } else {
//           MyInterests[ind].tags.push(val);
//           setMyInterest(MyInterests);
//           setUpdate(!update);
//         }
//       }
//     });
//     if (flag) {
//       let interest = {
//         name: value.name,
//         tags: [val],
//       };
//       MyInterests.push(interest);
//       setMyInterest(MyInterests);
//       setUpdate(!update);
//     }
//   };
//   let ChangeColor = (value, val) => {
//     let color = "red";
//     const isFound = MyInterests.some((element) => {
//       if (element.name === value.name) {
//         const check = element.tags.indexOf(val);

//         if (check !== -1) {
//           color = "green";
//         }
//       }
//     });
//     return color;
//   };

//   return (
//     <View>
//       <Text>Home</Text>
//       {allInterests.map((value, ind) => (
//         <>
//           <Text>{value.name}</Text>
//           {value.tags.map((val) => (
//             <TouchableOpacity
//               style={{
//                 backgroundColor: ChangeColor(value, val),
//                 padding: 10,
//                 margin: 10,
//               }}
//               onPress={() => ChangeCategory(value, val)}
//             >
//               <Text>{val}</Text>
//             </TouchableOpacity>
//           ))}
//         </>
//       ))}
//     </View>
// );
// }
