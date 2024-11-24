import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface PlaceButtonProps extends RectButtonProps {
  title: string;
  active?: boolean;
}

export function PlaceButton({
  title,
  active = false,
  ...rest
}: PlaceButtonProps) {
  return (
    <RectButton
      style={[styles.container, active && styles.containerActive]}
      {...rest}
    >
      <Text style={[styles.text, active && styles.textActive]}>{title}</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.shape,
    minWidth: 80, 
    height: 45, 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 10, 
    paddingHorizontal: 15,
    marginVertical: 5, 
    borderWidth: 1, 
    borderColor: colors.shape, 
  },

  containerActive: {
    backgroundColor: colors.green_light, 
    borderColor: colors.green_light, 
  },

  text: {
    color: colors.heading,
    fontFamily: fonts.text,
    fontSize: 14, 
  },

  textActive: {
    color: colors.green,
    fontFamily: fonts.heading,
    fontWeight: "bold", 
  },
});
