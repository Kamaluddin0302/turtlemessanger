import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Image,
  Button,
  StyleSheet,
  Modal,
  SafeAreaView,
  TextInput,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import {
  Actions,
  Bubble,
  GiftedChat,
  Send,
  Time,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";
import {
  CameraImageFUnc,
  FIlePickerFunc,
  ImagePickerFUnc,
  VideoPickerFUnc,
} from "../config/functions";
import { Video, AVPlaybackStatus } from "expo-av";
import Poll from "../components/Poll";

const images = [
  {
    uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
  },
  {
    uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
  },
  {
    uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
  },
];

export default function ChatScreen({ route }) {
  const [messages, setMessages] = useState([{}]);
  const [image, setImage] = useState();
  const navigation = useNavigation();
  const [visible, setIsVisible] = useState(false);
  const [showImage, setShowImage] = useState({});
  const [PollPopup, setPollPopup] = useState(false);
  const [pollQ, setPollQ] = useState("");
  const [pollOption1, setPollOption1] = useState("");
  const [pollOption2, setPollOption2] = useState("");
  const [pollOption3, setPollOption3] = useState("");

  const video = React.useRef(null);
  const [status, setStatus] = React.useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={() => auth.signOut().then(navigation.navigate("Login"))}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    try {
      const collectionRef = collection(database, "chats");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let allMessages = [];
        querySnapshot.docs.map((doc) =>
          allMessages.push({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text && doc.data().text,
            image: doc.data().image && doc.data().image,
            video: doc.data().video && doc.data().video,
            user: doc.data().user,
            file: doc.data().file ? doc.data().file : "",
            Data: doc.data().Data ? doc.data().Data : "",
            poll: doc.data().poll ? doc.data().poll : "",
            uid: doc.id,
          })
        );

        setMessages(allMessages);
      });

      return unsubscribe;
    } catch (error) {
      console.log("error", error, "================");
    }
  }, []);

  const renderMessageImage = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setImage([{ uri: props.currentMessage.image }]);
          setIsVisible(true);
        }}
      >
        <Image
          source={{ uri: props.currentMessage.image }}
          style={{ width: 200, height: 200 }}
        />
      </TouchableOpacity>
    );
  };

  const renderMessageVideo = (props) => {
    return (
      <Video
        ref={video}
        style={{ width: 200, height: 200 }}
        source={{
          uri: props.currentMessage.video,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    );
  };
  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        options={{
          ["Create Poll"]: async (props) => {
            setPollPopup(true);
          },
          ["Cancel"]: (props) => {
            console.log("Cancel", "===========================");
          },
        }}
        // icon={() => (
        //   <Image
        //     source={require("../assets/chatbackground.png")}
        //     height={500}
        //     width={500}
        //   />
        // )}
        onSend={(args) => (
          <Image
            source={require("../assets/chatbackground.png")}
            height={500}
            width={500}
          />
        )}
      />
    );
  };

  let FileDownload = async (url) => {
    await Linking.openURL(url);
  };

  const onSend = useCallback((messages = []) => {
    console.log(messages, "=============messafe");
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    // setMessages([...messages, ...messages]);
    const { _id, createdAt, text, user, image, video, file, Data, poll } =
      messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text: text ? text : "",
      video: video ? video : "",
      image: image ? image : "",
      user,
      file: file ? file : "",
      Data: Data ? Data : "",
      poll: poll ? poll : "",
    });
  }, []);

  let UpdatePoll = (Data, option, totalVote, uid) => {
    if (option === "pollOption1") {
      if (Data.pollOption1.voterUids.includes(auth.currentUser.uid)) {
        let index = Data.pollOption1.voterUids.indexOf(auth.currentUser.uid);
        Data.pollOption1.voterUids.splice(index, 1);
        Data.pollOption1.count = Data.pollOption1.count - 1;
        Data.totalVote = Data.totalVote - 1;
      } else {
        if (Data.pollOption2.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption2.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption2.voterUids.splice(index, 1);
          Data.pollOption2.count = Data.pollOption2.count - 1;
          Data.totalVote = Data.totalVote - 1;
        } else if (Data.pollOption3.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption3.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption3.voterUids.splice(index, 1);
          Data.pollOption3.count = Data.pollOption3.count - 1;
          Data.totalVote = Data.totalVote - 1;
        }
        Data.pollOption1.voterUids.push(auth.currentUser.uid);
        Data.pollOption1.count = Data.pollOption1.count + 1;
        Data.totalVote = Data.totalVote + 1;
      }
    }

    if (option === "pollOption2") {
      if (Data.pollOption2.voterUids.includes(auth.currentUser.uid)) {
        let index = Data.pollOption2.voterUids.indexOf(auth.currentUser.uid);
        Data.pollOption2.voterUids.splice(index, 1);
        Data.pollOption2.count = Data.pollOption2.count - 1;
        Data.totalVote = Data.totalVote - 1;
      } else {
        if (Data.pollOption1.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption1.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption1.voterUids.splice(index, 1);
          Data.pollOption1.count = Data.pollOption1.count - 1;
          Data.totalVote = Data.totalVote - 1;
        } else if (Data.pollOption3.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption3.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption3.voterUids.splice(index, 1);
          Data.pollOption3.count = Data.pollOption3.count - 1;
          Data.totalVote = Data.totalVote - 1;
        }
        Data.pollOption2.voterUids.push(auth.currentUser.uid);
        Data.pollOption2.count = Data.pollOption2.count + 1;
        Data.totalVote = Data.totalVote + 1;
      }
    }

    if (option === "pollOption3") {
      if (Data.pollOption3.voterUids.includes(auth.currentUser.uid)) {
        let index = Data.pollOption3.voterUids.indexOf(auth.currentUser.uid);
        Data.pollOption3.voterUids.splice(index, 1);
        Data.pollOption3.count = Data.pollOption3.count - 1;
        Data.totalVote = Data.totalVote - 1;
      } else {
        if (Data.pollOption1.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption1.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption1.voterUids.splice(index, 1);
          Data.pollOption1.count = Data.pollOption1.count - 1;
          Data.totalVote = Data.totalVote - 1;
        } else if (Data.pollOption2.voterUids.includes(auth.currentUser.uid)) {
          let index = Data.pollOption2.voterUids.indexOf(auth.currentUser.uid);
          Data.pollOption2.voterUids.splice(index, 1);
          Data.pollOption2.count = Data.pollOption2.count - 1;
          Data.totalVote = Data.totalVote - 1;
        }
        Data.pollOption3.voterUids.push(auth.currentUser.uid);
        Data.pollOption3.count = Data.pollOption3.count + 1;
        Data.totalVote = Data.totalVote + 1;
      }
    }

    const docRef = doc(database, "chats", uid);
    updateDoc(docRef, { Data });
  };

  let AddPoll = async () => {
    if (
      pollQ === "" ||
      (pollOption1 === "") | (pollOption2 === "") ||
      pollOption3 === ""
    ) {
      alert("Please Fill All All Data");
    } else {
      let message = [
        {
          _id: Math.random().toString(36),
          createdAt: new Date(),
          user: {
            _id: auth?.currentUser?.email,
            avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
          },
          poll: "Poll",
          Data: {
            pollQ: pollQ,
            pollOption1: { option: pollOption1, count: 0, voterUids: [] },
            pollOption2: { option: pollOption2, count: 0, voterUids: [] },
            pollOption3: { option: pollOption3, count: 0, voterUids: [] },
            totalVote: 0,
            voterALlUids: [],
          },
        },
      ];
      onSend(message);
      setPollPopup(false);
    }
  };

  return (
    <>
      <View style={{ flex: 1, padding: 0 }}>
        <Modal transparent visible={PollPopup}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "white",
              opacity: 0.9,
              // position: "relative"
            }}
          >
            <View style={styles.poll}>
              <TouchableOpacity
                onPress={() => setPollPopup(false)}
                style={{ alignSelf: "flex-end" }}
              >
                <Entypo name="cross" size={34} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter Question"
                onChangeText={(text) => setPollQ(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Option 1"
                onChangeText={(text) => setPollOption1(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Option 2"
                onChangeText={(text) => setPollOption2(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Option 3"
                onChangeText={(text) => setPollOption3(text)}
              />
              <TouchableOpacity
                style={styles.addpoll}
                onPress={() => AddPoll()}
              >
                <Text style={{ color: "white", fontSize: 20 }}>ADD POLL</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        <ImageBackground
          style={{ flex: 1 }}
          source={require("../assets/chatbackground.png")}
        >
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={false}
            renderActions={renderActions}
            renderAvatarOnTop={true}
            showUserAvatar={false}
            imageProps
            // renderMessageImage={renderMessageImage}
            renderMessageVideo={renderMessageVideo}
            onSend={(messages) => onSend(messages)}
            renderTime={(timeProps) => {
              return (
                <Time
                  {...timeProps}
                  timeTextStyle={{
                    left: {
                      color: "white",
                      fontSize: 10,
                      fontFamily: "Rubik",
                      textAlign: "right", // or position: 'right'
                    },
                    right: {
                      color: "#3c3c434d",
                      fontSize: 10,
                      fontFamily: "Rubik",
                    },
                  }}
                />
              );
            }}
            // renderMessage={renderMessage}
            textInputStyle={{
              backgroundColor: "#fff",
              borderRadius: 20,
            }}
            user={{
              _id: auth?.currentUser?.email,
              avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
            }}
            renderBubble={(props) => {
              let { text, video, image, file, user, Data, poll, uid } =
                props.currentMessage;
              if (file) {
                return (
                  <View
                    style={
                      auth.currentUser.email === user._id
                        ? styles.right
                        : styles.left
                    }
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onPress={() => FileDownload(file)}
                    >
                      <View>
                        <Text
                          style={{
                            color:
                              auth.currentUser.email === user._id
                                ? "black"
                                : "white",
                          }}
                        >
                          {Data.name}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name="download"
                        size={24}
                        color={
                          auth.currentUser.email === user._id
                            ? "black"
                            : "white"
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color:
                          auth.currentUser.email === user._id
                            ? "black"
                            : "white",
                        alignSelf: "flex-end",
                        fontSize: 12,
                      }}
                    >
                      {props.currentMessage?.createdAt?.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </Text>
                  </View>
                );
              } else if (poll) {
                console.log(poll);
                return (
                  <View
                    style={
                      auth.currentUser.email === user._id
                        ? styles.rightpoll
                        : styles.leftpoll
                    }
                  >
                    <Poll
                      Data={Data}
                      UpdatePoll={(Data, option, totalVote, uid) =>
                        UpdatePoll(Data, option, totalVote, uid)
                      }
                      uid={uid}
                    />
                    <Text
                      style={{
                        color:
                          auth.currentUser.email === user._id
                            ? "black"
                            : "white",
                        alignSelf: "flex-end",
                        fontSize: 12,
                      }}
                    >
                      {props.currentMessage?.createdAt?.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <Bubble
                    {...props}
                    textStyle={{
                      right: {
                        color: "black",
                      },
                      left: {
                        color: "white",
                      },
                    }}
                    wrapperStyle={{
                      left: {
                        backgroundColor: "black",
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                      },
                      right: {
                        backgroundColor: "#d9fdd3",
                        borderBottomLeftRadius: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 0,
                      },
                    }}
                    bottomContainerStyle={{
                      color: "black",
                    }}
                  />
                );
              }
            }}
          />
        </ImageBackground>

        <ImageView
          images={image}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  left: {
    backgroundColor: "black",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    width: "60%",
    marginVertical: 5,
  },
  right: {
    backgroundColor: "#d9fdd3",
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
    padding: 10,
    marginVertical: 5,

    width: "60%",
  },

  leftpoll: {
    backgroundColor: "white",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    width: "80%",
    borderColor: "lightgray",
    borderWidth: 1,
    marginVertical: 5,
  },
  rightpoll: {
    backgroundColor: "white",
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
    padding: 10,
    marginVertical: 5,
    width: "80%",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  timeContainer: {
    // alignSelf: "flex-end",
    // marginRight: 10,
    // marginBottom: 5,
  },
  timeText: {
    // fontSize: 12,
    // fontFamily: "Helvetica Neue",
    // fontWeight: "bold",
  },
  poll: {
    // flex: 1,
    borderRadius: 10,
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "lightgray",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    // justifyContent: "center",
    // alignContent: "center",
    marginTop: 100,
  },
  input: {
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 10,
    marginVertical: 15,
    height: 50,
    paddingLeft: 20,
  },
  addpoll: {
    backgroundColor: "black",
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
    height: 50,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
