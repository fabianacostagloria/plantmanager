import React, { useEffect } from 'react';
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import { PlantProps } from './src/libs/storage';


export default function App(){
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notifications => {
        const data = notifications.request.content.data.plant as PlantProps;

      });
    
      return () => subscription.remove();
}, [])



  return(
    <Routes />
  )
}
