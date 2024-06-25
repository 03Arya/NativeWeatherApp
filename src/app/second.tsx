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

  const getWeatherIcon = (conditionCode) => {
    const iconMap = {
      1000: "weather-sunny", // Clear
      1003: "weather-partly-cloudy", // Partly cloudy
      1006: "weather-cloudy", // Cloudy
      1009: "weather-cloudy", // Overcast
      1030: "weather-fog", // Mist
      1063: "weather-rainy", // Patchy rain possible
    };
    return iconMap[conditionCode] || "weather-cloudy"; // Default icon
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = locationName ? `Location: ${locationName}` : `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View className="flex-1">
      <View className="">
        <View className='mx-auto flex pt-4'>
          <TextInput className="bg-slate-700 w-screen max-w-96 text-white py-1 px-5 rounded-full" placeholder="Enter name of city" placeholderTextColor="white"></TextInput>
        </View>
        <View className="flex flex-col items-center gap-4 text-center pt-3">
          {weather && (
            <>
              <MaterialCommunityIcons size={48} name={getWeatherIcon(weather.condition.code)} color={'#000'} />
              <Text className='dark:text-white'>Temperature: {weather.temp_c}°C</Text>
              <Text className='dark:text-white'>Condition: {weather.condition.text}</Text>
              <Text className='dark:text-white'>Humidity: {weather.humidity}%</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}