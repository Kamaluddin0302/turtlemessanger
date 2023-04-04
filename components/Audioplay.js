// import { View, Text, StyleSheet } from "react-native";
// import React from "react";
// import { Entypo } from "@expo/vector-icons";
// import { useState } from "react";
// import { Audio } from "expo-av";

// export default function Audioplay({ audio, user }) {
//   console.log(user);
//   const [play, setPlay] = useState(false);
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     if (play) {
//       setPlay(false);
//     } else {
//       console.log(audio);
//       setPlay(true);
//       console.log("Loading Sound");
//       const { sound } = await Audio.Sound.createAsync({ uri: audio });
//       setSound(sound);

//       console.log("Playing Sound");
//       await sound.playAsync();
//     }
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.avtar}>
//         <Text style={styles.avtarText}>{user._id.slice(0, 2)}</Text>
//       </View>
//       {!play ? (
//         <Entypo
//           name="controller-play"
//           size={30}
//           color="black"
//           onPress={() => playSound()}
//         />
//       ) : (
//         <Entypo
//           name="controller-paus"
//           size={30}
//           color="black"
//           onPress={() => playSound()}
//         />
//       )}
//       <Text>Audioplay</Text>
//     </View>
//   );
// }

// let styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avtar: {
//     borderRadius: 50,
//     height: 35,
//     width: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "green",
//     marginRight: 10,
//   },
//   avtarText: {
//     textTransform: "uppercase",
//     color: "white",
//   },
// });

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function AudioPlayer({ audio }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    async function loadAudio() {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio },
        { shouldPlay: false }
      );
      setSound(sound);

      sound
        .getStatusAsync()
        .then(function (result) {
          setDuration(result.playableDurationMillis);
        })
        .catch((error) => console.log(error));
    }
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function playPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  }

  async function stop() {
    if (sound) {
      await sound.stopAsync();
      setPosition(0);
      setIsPlaying(false);
    }
  }

  async function seek(position) {
    if (sound) {
      await sound.setPositionAsync(position);
      setPosition(position);
    }
  }

  function formatTime(time) {
    console.log(time, "====");
    if (time) {
      const minutes = Math.floor((time / 1000 / 60) << 0);
      const seconds = Math.floor((time / 1000) % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    } else {
      return "-:--";
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          //   alignItems: "center",
          //   alignContent: "center",
        }}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPause}>
            <Ionicons
              name={isPlaying ? "ios-pause" : "ios-play"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seek}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#888"
          thumbTintColor="#fff"
        />
      </View>
      <View style={styles.timer}>
        <Text style={styles.timerText}>{formatTime(position)}</Text>
        <Text style={styles.timerText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    width: "80%",
    height: 30,
  },
  timer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 20,
  },
  timerText: {
    color: "#fff",
  },
});
