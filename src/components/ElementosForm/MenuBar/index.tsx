import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Headset, LogOut, TextAlignJustify, User } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

const MenuBar = ({ style }: any) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  const toggleMenu = () => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleLogOut = async() => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    navigation.navigate('Login' as never);
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.mainButton, style]}
        onPress={toggleMenu}
      >
        <TextAlignJustify color="white"  /> 
      </TouchableOpacity>

      {visible && (
        <Animated.View
          style={[
            styles.menu,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Configuracoes' as never)} activeOpacity={0.5} style={styles.menuButton}>
            <User />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.menuButton}>
            <Headset />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLogOut()} activeOpacity={0.5} style={styles.menuButton}>
            <LogOut />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 8,
    left: "89%",
    width: 45
  },
  menu: {
    position: "absolute",
    top: 45,
    right: 10,
    zIndex: 999,
    width: "40%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuButton: {
    padding: 10,
    alignItems: "center",
  },
});

export default MenuBar;
