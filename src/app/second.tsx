import { useEffect, useState } from 'react';
import React from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
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
  const [forecast, setForecast] = useState(null);
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
          // After setting the current weather, fetch the forecast data
          fetchForecastData(location.coords.latitude, location.coords.longitude);
        })
        .catch(error => {
          console.error("Failed to fetch weather data:", error);
        });
    })();
  }, []);

  const fetchForecastData = async (latitude, longitude) => {
    const forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${latitude},${longitude}&days=10`;
    try {
      const response = await fetch(forecastApiUrl);
      const data = await response.json();
      setForecast(data.forecast.forecastday);
      console.log(data.forecast.forecastday);
    } catch (error) {
      console.error("Failed to fetch forecast data:", error);
    }
  };

  const formatDateWithDay = (dateStr) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateStr);
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    return `${dayName}, ${monthName} ${dayOfMonth}`;
  };

  const getWeatherIconAndColor = (conditionCode) => {
    const iconAndColorMap = {
      1000: { icon: "weather-sunny", color: "#FFD700" },
      1003: { icon: "weather-partly-cloudy", color: "#DAA520" },
      1006: { icon: "weather-cloudy", color: "#808080" },
      1009: { icon: "weather-cloudy", color: "#696969" },
      1030: { icon: "weather-fog", color: "#A9A9A9" },
      1063: { icon: "weather-rainy", color: "#1E90FF" },
    };
    return iconAndColorMap[conditionCode] || { icon: "weather-cloudy", color: "#808080" };
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  return (
    <View className="flex-1 bg-zinc-900 max-w-lg">
      <TextInput className="bg-slate-700 w-screen mt-5 max-w-96 text-white py-1 px-5 rounded-full mx-auto" placeholder="Enter name of city" placeholderTextColor="white"></TextInput>
      {weather && (
        <View className="flex-4 flex-col items-center gap-4 text-center pt-3">
          <MaterialCommunityIcons size={100} name={getWeatherIconAndColor(weather.condition.code).icon} color={getWeatherIconAndColor(weather.condition.code).color} />
          <Text className='dark:text-white text-white font-bold text-3xl'>{weather.temp_c}°</Text>
          <Text className='dark:text-white text-white font-bold text-sm right-1'>{weather.condition.text}</Text>
        </View>
      )}
      {forecast && (
          <ScrollView style={{ maxHeight: '50%' }} className="pt-10 max-w-96 w-96 mx-auto">
          <Text className="dark:text-white text-white font-bold text-xl pb-2">10-Day Forecast:</Text>
          {forecast.map((day, index) => (
            <View key={index} className="flex flex-row justify-between text-white py-1">
              <MaterialCommunityIcons size={30} name={getWeatherIconAndColor(day.day.condition.code).icon} color={getWeatherIconAndColor(day.day.condition.code).color} />
              <Text className='text-white w-28 text-base pt-1'>{formatDateWithDay(day.date)}</Text>
              <Text className='text-white pt-1'>{day.day.maxtemp_c}°</Text>
              <Text className='text-yellow-200 pt-1'>{day.day.mintemp_c}°</Text>
              <Text className='text-white text-sm pt-1'>Chance of rain {day.day.daily_chance_of_rain}%</Text>
            </View>
          ))}
          </ScrollView>
      )}
    </View>
  );
}