import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/Signup";
import ChatScreen from "./screens/Chat";
import HomeScreen from "./screens/Home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SurveyScreen from "./screens/Survey";
import SplashScreen from "./screens/Splash";
import FormScreen from "./screens/Form";
import UploadScreen from "./screens/Upload";
import AllUser from "./screens/AllUser";
import SingleChat from "./screens/SingleChat";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import GroupChat from "./screens/GroupChat";
import AddGroup from "./screens/AddGroup";
import SearchUser from "./screens/SearchUser";
import ForgotPass from "./screens/ForgotPass";

const TopTab = createMaterialTopTabNavigator();

const Stack = createNativeStackNavigator();
const AuthenticatedUserContext = createContext({});
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs();
const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function SingleChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatWith"
        component={AllUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleChat"
        component={SingleChat}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="GroupChat"
        component={GroupChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddGroup"
        component={AddGroup}
        options={{ headerShown: true, title: "Create Now Circle" }}
      />
      <Stack.Screen
        name="SearchUser"
        component={SearchUser}
        options={{
          headerShown: true,
          title: "Create Now Group",
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Survey"
        component={SurveyScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function FormStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="Forgot"
        component={ForgotPass}
        options={{ headerShown: true, title: "Forgot Password" }}
      />
    </Stack.Navigator>
  );
}

// top Tab Navigation

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  console.log(user, "------------");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Chat"
            component={ChatStack}
            options={{
              tabBarLabel: "Chat",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="My Chat"
            component={SingleChatStack}
            options={{
              tabBarLabel: "My Chat",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Forms"
            component={FormStack}
            options={{
              tabBarLabel: "Forms",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="form-select"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
