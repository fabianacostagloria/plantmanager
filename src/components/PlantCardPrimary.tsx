import React from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  useWindowDimensions,
} from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { SvgFromUri } from "react-native-svg";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface PlantProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
  };
}

export const PlantCardPrimary = ({ data, ...rest }: PlantProps) => {
  const { width } = useWindowDimensions();

  const textFontSize = width > 350 ? 16 : 14; 

  return (
    <RectButton style={styles.container} {...rest}>
      {data.photo.includes(".svg") ? (
        <SvgFromUri uri={data.photo} width={70} height={70} />
      ) : (
        <Image source={{ uri: data.photo }} style={styles.image} />
      )}

      <View style={styles.textContainer}>
        <Text style={[styles.text, { fontSize: textFontSize }]}>
          {data.name}
        </Text>
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "45%", 
    backgroundColor: colors.shape,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    margin: 10,
    shadowColor: colors.heading,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },

  text: {
    color: colors.green_dark,
    fontFamily: fonts.heading,
    textAlign: "center", 
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10, 
    marginBottom: 12, 
  },
});
