import { useEffect, useState } from 'react';
import React from "react";
import { Text, View, TextInput } from "react-native";
import * as Location from 'expo-location';



export default function Page() {
  return (
    <View className="flex flex-1 bg-white dark:bg-black">
      <Content />
    </View>
  );
}

function Content() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View className="flex-1">
      <View className="">
        <View className="flex flex-col items-center gap-4 text-center pt-3">
          <Text>{text}</Text>
          <TextInput className="bg-slate-700 w-screen max-w-96 text-white py-1 px-5 rounded-full" placeholder="Enter name of city" placeholderTextColor="white"></TextInput> 
        </View>
      </View>
    </View>
  );
}

