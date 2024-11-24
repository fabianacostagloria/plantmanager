import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import colors from "../styles/colors"; 
import fonts from "../styles/fonts"; 

type ConfirmationProps = {
  route: {
    params: {
      title: string;
      subtitle: string;
      buttonTitle: string;
      icon: "smile" | "hug";
      nextScreen: string;
    };
  };
};

const emojis = {
  hug: "🤗",
  smile: "😄",
};

export function Confirmation({ route }: ConfirmationProps) {
  const { title, subtitle, buttonTitle, icon, nextScreen } = route.params;
  const navigation = useNavigation();

  function handleMoveOn() {
    navigation.navigate(nextScreen);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{emojis[icon]}</Text>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleMoveOn}>
              <Text style={styles.buttonText}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, 
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12, 
    backgroundColor: colors.white, 
    elevation: 5, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26, 
    fontFamily: fonts.heading,
    textAlign: "center",
    color: colors.heading, 
    lineHeight: 36,
    marginTop: 20,
    fontWeight: "700", 
  },
  subtitle: {
    fontFamily: fonts.text, 
    textAlign: "center",
    fontSize: 18, 
    color: colors.body_dark,
    paddingVertical: 15, 
  },
  emoji: {
    fontSize: 100, 
    marginBottom: 20, 
  },
  footer: {
    width: "100%",
    marginTop: 25,
  },
  button: {
    backgroundColor: colors.green, 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    fontSize: 18, 
    fontFamily: fonts.heading, 
    color: colors.white, 
    fontWeight: "bold", 
  },
});
