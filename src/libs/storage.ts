import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { format } from "date-fns";

export interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

export interface StoragePlantProps {
  [id: string]: {
    data: PlantProps;
    notificationsId: string;
  };
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();

    const { times, repeat_every } = plant.frequency;
    
    if (repeat_every === "week") {
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval);
    } else {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    const seconds = Math.abs(Math.ceil((now.getTime() - nextTime.getTime()) / 1000));
    const triggerTime = seconds < 60 ? 60 : seconds;

    const notificationsId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hey, 🌱`,
        body: `It's time to take care of your ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,  
        seconds: triggerTime, 
        repeats: true,  
      },
    });
       

    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationsId,
      },
    };

    await AsyncStorage.setItem(
      "@plantmanager:plants",
      JSON.stringify({
        ...newPlant,
        ...oldPlants,
      })
    );
  } catch (error) {
    console.error("Error saving plant:", error);
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const plantsSorted = Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotification),
            "HH:mm"
          ),
        };
      })
      .sort(
        (a, b) =>
          Math.floor(new Date(a.dateTimeNotification).getTime() / 100) -
          Math.floor(new Date(b.dateTimeNotification).getTime() / 100)
      );

    return plantsSorted;
  } catch (error) {
    console.error("Error loading plants:", error);
    throw new Error(error);
  }
}

export async function removePlant(id: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationsId);

    delete plants[id];

    await AsyncStorage.setItem("@plantmanager:plants", JSON.stringify(plants));
  } catch (error) {
    console.error("Error removing plant:", error);
    throw new Error(error);
  }
}
