import { useEffect, useState } from 'react';
import React from "react";
import { Text, View, TextInput } from "react-native";
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const key = "652ea738e20946f1b1765105242506";

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

      const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location.coords.latitude},${location.coords.longitude}`;
      fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
          setWeather(data.current);
          console.log(data.current);
        })
        .catch(error => {
          console.error("Failed to fetch weather data:", error);
        });
    })();
  }, []);

  const getWeatherIconAndColor = (conditionCode) => {
    const iconAndColorMap = {
      1000: { icon: "weather-sunny", color: "#FFD700" }, // Clear, Yellow
      1003: { icon: "weather-partly-cloudy", color: "#DAA520" }, // Partly cloudy, Goldenrod
      1006: { icon: "weather-cloudy", color: "#808080" }, // Cloudy, Gray
      1009: { icon: "weather-cloudy", color: "#696969" }, // Overcast, DimGray
      1030: { icon: "weather-fog", color: "#A9A9A9" }, // Mist, DarkGray
      1063: { icon: "weather-rainy", color: "#1E90FF" }, // Patchy rain possible, DodgerBlue
    };
    return iconAndColorMap[conditionCode] || { icon: "weather-cloudy", color: "#808080" }; // Default icon and color
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = locationName ? `Location: ${locationName}` : `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  if (weather) {
    const { icon, color } = getWeatherIconAndColor(weather.condition.code);
    return (
      <View className="flex-1 bg-zinc-900 max-w-lg">
        <View className="">
          <View className='mx-auto flex pt-4'>
            <TextInput className="bg-slate-700 w-screen max-w-96 text-white py-1 px-5 rounded-full" placeholder="Enter name of city" placeholderTextColor="white"></TextInput>
          </View>
          <View className="flex-4 flex-col items-center gap-4 text-center pt-3">
            <>
              <MaterialCommunityIcons size={100} name={icon} color={color} />
              <Text className='dark:text-white text-white font-bold text-3xl'>{weather.temp_c}°</Text>
              <Text className='dark:text-white text-white font-bold text-sm right-1'>{weather.condition.text}</Text>
              <View className='flex flex-row gap-2 flex-wrap justify-center pt-5'>
                <Text className='dark:text-white bg-slate-400 rounded-3xl px-2 py-5 text-center'>Temperature: {weather.temp_c}°C</Text>
                <Text className='dark:text-white bg-slate-400 rounded-3xl px-2 py-5 text-center'>Condition: {weather.condition.text}</Text>
                <Text className='dark:text-white bg-slate-400 rounded-3xl px-2 py-5 text-center'>Humidity: {weather.humidity}%</Text>
                {/* Remove duplicated elements if not needed */}
              </View>
            </>
          </View>
        </View>
      </View>
    );
  }
}