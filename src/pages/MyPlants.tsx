import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Alert, FlatList } from "react-native";
import { Header } from "../components/Header";
import waterdrop from "../assets/waterdrop.png";
import colors from "../styles/colors";
import { loadPlant, PlantProps, removePlant } from "../libs/storage";
import { formatDistance } from "date-fns";
import { enUS } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecundary } from "../components/PlantCardSecundary";
import { Load } from "../components/Load";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert("Remove", `Do you want to remove ${plant.name}?`, [
      {
        text: "No 😥",
        style: "cancel",
      },
      {
        text: "Yes 😎",
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );
          } catch (error) {
            Alert.alert("Unable to remove 🤯!");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    async function loadStoredData() {
      const plantsStored = await loadPlant();
      const nextTime = formatDistance(
        new Date(plantsStored[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: enUS }
      );
      setNextWatered(
        `Don't forget to water ${plantsStored[0].name} in ${nextTime}.`
      );
      setMyPlants(plantsStored);
      setLoading(false);
    }

    loadStoredData();
  }, []);

  if (loading) return <Load />;

  return (
    <FlatList
      data={myPlants}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.container}>
          <Header title="My" subtitle="Plants" />

          <View style={styles.spotLight}>
            <Image source={waterdrop} style={styles.spotLightImage} />
            <Text style={styles.spotLightText}>{nextWatered}</Text>
          </View>

          <View style={styles.plants}>
            <Text style={styles.plantsTitle}>Upcoming Waterings</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <PlantCardSecundary
          data={item}
          handleRemove={() => handleRemove(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.plantList}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  spotLight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  spotLightImage: {
    width: 60,
    height: 60,
  },
  spotLightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: "justify",
  },
  plants: {
    flex: 1,
    width: "100%",
    paddingBottom: 20,
  },
  plantsTitle: {
    fontSize: 22,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 10,
  },
  plantList: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});
