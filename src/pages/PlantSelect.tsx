import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PlaceButton } from "../components/PlaceButton";
import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { PlantProps } from "../libs/storage";
import plantsData from "../services/server.json";

interface PlaceProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [places, setPlaces] = useState<PlaceProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [placeSelected, setPlaceSelected] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate("PlantSave", { plant });
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    fetchPlants();
  }

  function handlePlaceSelected(place: string) {
    setPlaceSelected(place);
    setPage(1);
    const filtered =
      place === "all"
        ? plants
        : plants.filter((plant) => plant.environments.includes(place));

    setFilteredPlants(filtered);
  }

  function fetchPlace() {
    if (plantsData?.plants_environments) {
      const environments = plantsData.plants_environments;
      setPlaces([{ key: "all", title: "All" }, ...environments]);
      setPlaceSelected("all");
    } else {
      Alert.alert("Unable to load environments! 🚨");
    }
  }

  function fetchPlants() {
    if (!plantsData?.plants) {
      setLoading(true);
      Alert.alert("Unable to load plants! 🚨");
      return;
    }

    const allPlants = plantsData.plants;

    const filtered =
      placeSelected === "all"
        ? allPlants
        : allPlants.filter((plant: { environments: string | string[] }) =>
            plant.environments?.includes(placeSelected)
          );

    const plantsToShow = filtered.slice(0, page * 8);
    setPlants(filtered);
    setFilteredPlants(plantsToShow);
    setLoading(false);
    setLoadingMore(false);
  }

  useEffect(() => {
    try {
      fetchPlace();
    } catch (error) {
      Alert.alert("Unable to load places! 🚨");
    }
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [page, placeSelected]);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Which environment</Text>
        <Text style={styles.subtitle}>would you like to place your plant?</Text>
      </View>

      <View>
        <FlatList
          data={places}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <PlaceButton
              title={item.title}
              active={item.key === placeSelected}
              onPress={() => handlePlaceSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.placeList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  placeList: {
    height: "5%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  contentContainerStyle: {
    paddingBottom: 20,
  },
});
