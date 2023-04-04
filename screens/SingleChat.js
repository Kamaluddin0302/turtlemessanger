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
} from "react-native";
import ImageView from "react-native-image-viewing";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import {
  Actions,
  Bubble,
  GiftedChat,
  Send,
  Time,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { Audio } from "expo-av";

import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";
import {
  CameraImageFUnc,
  CameraVideoFUnc,
  FIlePickerFunc,
  ImagePickerFUnc,
  VideoPickerFUnc,
} from "../config/functions";
import { Video, AVPlaybackStatus } from "expo-av";
import Audioplay from "../components/Audioplay";

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
  let { data } = route.params;
  const [messages, setMessages] = useState([{}]);
  const [image, setImage] = useState();
  const navigation = useNavigation();
  const [visible, setIsVisible] = useState(false);
  const [showImage, setShowImage] = useState({});
  const [ShowRecord, setShowrecord] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [recording, setRecording] = useState(null);

  const video = React.useRef(null);
  const [status, setStatus] = React.useState();

  // return Time
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          // onPress={onSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
      title: data.name,
    });
  }, [navigation]);

  useEffect(() => {
    try {
      let docId =
        auth.currentUser.uid > data.uid
          ? data.uid + "-" + auth.currentUser.uid
          : auth.currentUser.uid + "-" + data.uid;
      console.log(docId, "UIdddds");
      const collectionRef = collection(database, "singleChat");
      const q = query(collectionRef, where("specialId", "==", docId));
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
            audio: doc.data().audio ? doc.data().audio : "",
          })
        );

        const messagesSort = allMessages.sort(
          (dateA, dateB) => dateB.createdAt - dateA.createdAt
        );

        setMessages(messagesSort);
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

  const renderMessageText = (props) => {
    let { _id } = props.currentMessage.user;

    return (
      <View style={_id !== auth.currentUser.email ? styles.left : styles.right}>
        <Text
          style={
            _id !== auth.currentUser.email ? styles.leftText : styles.rightText
          }
        >
          {props.currentMessage.text}
        </Text>
        <Text
          style={
            _id !== auth.currentUser.email ? styles.lefttime : styles.righttime
          }
        ></Text>
      </View>
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
          ["Image"]: async (props) => {
            let image = await ImagePickerFUnc();
            if (image) {
              let message = [
                {
                  _id: Math.random().toString(36),
                  createdAt: new Date(),
                  [image.type]: image.url,
                  user: {
                    _id: auth?.currentUser?.email,
                    avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
                  },
                },
              ];
              onSend(message);
            }
          },
          ["Video"]: async (props) => {
            let video = await VideoPickerFUnc();
            if (video) {
              let message = [
                {
                  _id: Math.random().toString(36),
                  createdAt: new Date(),
                  video: video.url,
                  user: {
                    _id: auth?.currentUser?.email,
                    avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
                  },
                },
              ];
              onSend(message);
            }
          },
          ["Take Picture"]: async (props) => {
            let image = await CameraImageFUnc();
            if (image) {
              let message = [
                {
                  _id: Math.random().toString(36),
                  createdAt: new Date(),
                  [image.type]: image.url,
                  user: {
                    _id: auth?.currentUser?.email,
                    avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
                  },
                },
              ];
              onSend(message);
            }
          },
          ["Take Video"]: async (props) => {
            let Video = await CameraVideoFUnc();
            if (Video) {
              let message = [
                {
                  _id: Math.random().toString(36),
                  createdAt: new Date(),
                  [Video.type]: Video.url,
                  user: {
                    _id: auth?.currentUser?.email,
                    avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
                  },
                },
              ];
              onSend(message);
            }
          },
          ["Send Voice"]: async (props) => {
            setShowrecord(true);
            handleRecord();
          },
          ["File"]: async (props) => {
            let result = await FIlePickerFunc();
            if (result.file) {
              let message = [
                {
                  _id: Math.random().toString(36),
                  createdAt: new Date(),
                  user: {
                    _id: auth?.currentUser?.email,
                    avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
                  },
                  file: result.url,
                  Data: {
                    url: result.url,
                    type: result.type,
                    name: result.name,
                    file: result.file,
                    size: result.size,
                  },
                },
              ];
              onSend(message);
            }
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
    const { _id, createdAt, text, user, image, video, file, Data, audio } =
      messages[0];
    let docId =
      auth.currentUser.uid > data.uid
        ? data.uid + "-" + auth.currentUser.uid
        : auth.currentUser.uid + "-" + data.uid;
    addDoc(collection(database, "singleChat"), {
      _id,
      createdAt,
      text: text ? text : "",
      video: video ? video : "",
      image: image ? image : "",
      user,
      specialId: docId,
      file: file ? file : "",
      Data: Data ? Data : "",
      audio: audio ? audio : "",
    });
  }, []);

  const handleRecord = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log("Starting recording..");

    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);

    console.log("Recording started", recording, "=======", status);

    setRecording(recording);
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setElapsedTime(0);
      const uri = await recording.getURI();
      setShowrecord(false);

      let message = [
        {
          _id: Math.random().toString(36),
          createdAt: new Date(),
          user: {
            _id: auth?.currentUser?.email,
            avatar: `https://ui-avatars.com/api/?name=${auth?.currentUser?.email}`,
          },
          audio: uri,
        },
      ];
      onSend(message);
      console.log("Recording URI:", uri);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={{ flex: 1, padding: 0 }}>
        {ShowRecord ? (
          <View style={styles.record}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 }}
            >
              Voice Recording
            </Text>
            <FontAwesome5 name="record-vinyl" size={100} color="red" />
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 }}
            >
              00:50:12
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                padding: 10,
                elevation: 5,
              }}
              onPress={() => stopRecording()}
            >
              <Entypo name="controller-paus" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
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
                let { text, video, image, file, user, Data, audio } =
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
                } else if (audio) {
                  return (
                    <View
                      style={
                        auth.currentUser.email === user._id
                          ? styles.right
                          : styles.left
                      }
                    >
                      <Audioplay audio={audio} user={user} />
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
        )}

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
  record: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
