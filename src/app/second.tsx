import { Link } from "expo-router";
import { useEffect, useState } from 'react';
import React from "react";
import { Text, View, TextInput } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex flex-1 bg-white dark:bg-black">
      <Content />
    </View>
  );
}

function Content() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);
  return (
    <View className="flex-1">
      <View className="">
          <View className="flex flex-col items-center gap-4 text-center pt-3">
          <Text>Latitude: {location?.latitude}</Text>
          <Text>Longitude: {location?.longitude}</Text>
          <TextInput className="bg-slate-700 w-screen max-w-96 text-white py-1 px-5 rounded-full" placeholder="Enter name of city" placeholderTextColor="white"></TextInput> 
            </View>
          </View>
        </View>
  );
}

