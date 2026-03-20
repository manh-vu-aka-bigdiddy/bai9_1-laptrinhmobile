import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const AuthContext = createContext();

// ================= CONTEXT =================
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const val = await AsyncStorage.getItem("isLoggedIn");
      if (val === "true") setIsLoggedIn(true);
    };
    check();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ================= COMPONENTS =================

// INPUT
const CustomTextInput = ({ placeholder, secure, icon }) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={20} color="gray" />
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secure}
      style={{ marginLeft: 10, flex: 1 }}
    />
  </View>
);

// BUTTON ICON
const IconButton = ({ title, color, icon }) => (
  <TouchableOpacity style={[styles.iconBtn, { backgroundColor: color }]}>
    <FontAwesome name={icon} size={18} color="#fff" />
    <Text style={styles.iconText}>{title}</Text>
  </TouchableOpacity>
);

// HEADER
const Header = ({ title }) => (
  <View style={styles.headerRow}>
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.viewAll}>View all</Text>
  </View>
);

// ================= SCREENS =================

//  SIGN IN
const SignInScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.label}>Email ID</Text>
      <CustomTextInput
        placeholder="Enter your email here!"
        icon="mail-outline"
      />

      <Text style={styles.label}>Password</Text>
      <CustomTextInput
        placeholder="Enter your password here"
        secure
        icon="lock-closed-outline"
      />

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or sign in with</Text>

      <View style={{ flexDirection: "row" }}>
        <IconButton title="Google" color="#DB4437" icon="google" />
        <IconButton title="Facebook" color="#4267B2" icon="facebook" />
      </View>

      <Text style={styles.signup}>
        Not yet a member?{" "}
        <Text style={{ color: "orange", fontWeight: "bold" }}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

//  FORGOT
const ForgotPasswordScreen = () => (
  <View style={styles.center}>
    <Text>Forgot Password</Text>
  </View>
);

// EXPLORER
const data = [
  { id: "1", name: "Pizza" },
  { id: "2", name: "Burger" },
  { id: "3", name: "Steak" },
];

const renderItem = ({ item }) => (
  <View style={styles.card}>
    <Text>{item.name}</Text>
  </View>
);

const ExplorerScreen = () => (
  <View style={{ flex: 1, padding: 15 }}>
    {/* Top bar */}
    <View style={styles.topBar}>
      <Ionicons name="location-outline" size={22} />
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="gray" />
        <TextInput placeholder="Search..." style={{ marginLeft: 5 }} />
      </View>
    </View>

    <Header title="Top Categories" />
    <FlatList horizontal data={data} renderItem={renderItem} />

    <Header title="Popular Items" />
    <FlatList horizontal data={data} renderItem={renderItem} />

    <Header title="Sale-off Items" />
    <FlatList horizontal data={data} renderItem={renderItem} />
  </View>
);

//  ACCOUNT
const AccountScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.accountHeader}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Vu Tien Manh</Text>
      </View>

      {/* Info */}
      <View style={styles.accountInfo}>
        <Text>Email: manhvutien@gmail.com</Text>
        <Text>Phone: 099999999999</Text>

        <TouchableOpacity style={styles.loginBtn} onPress={logout}>
          <Text style={styles.loginText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ================= NAV =================
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainTab = () => (
  <Tab.Navigator>
    <Tab.Screen name="Explorer" component={ExplorerScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const RootRouter = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  );
};

// ================= APP =================
export default function App() {
  return (
    <AuthProvider>
      <RootRouter />
    </AuthProvider>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  label: { marginTop: 10, marginBottom: 5 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  forgot: { textAlign: "right", color: "orange", marginBottom: 10 },

  loginBtn: {
    backgroundColor: "orange",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  loginText: { color: "#fff", fontWeight: "bold" },

  or: { textAlign: "center", marginVertical: 15 },

  signup: { textAlign: "center", marginTop: 20 },

  iconBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
    margin: 5,
    borderRadius: 8,
  },

  iconText: { color: "#fff", marginLeft: 8 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  headerTitle: { fontWeight: "bold", fontSize: 16 },

  viewAll: { color: "orange" },

  card: {
    padding: 20,
    backgroundColor: "#eee",
    marginRight: 10,
    borderRadius: 10,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
    flex: 1,
  },

  accountHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },

  accountInfo: {
    padding: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});