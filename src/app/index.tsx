import { Link } from "expo-router";
import React from "react";
import { Text, View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Page() {

  return (
    <View className="flex flex-1 bg-white dark:bg-slate-900">
      <Header />
      <Content />
    </View>
  );
}

function Content() {
  return (
    <View className="flex-1">
      <View className="flex flex-col items-center gap-4 text-center">
        <View className="gap-4 pt-20">
          <Link
            suppressHighlighting
            className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:text-white dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/second">
            Check Weather
          </Link>
        </View>
      </View>
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <View className="">
        <Text className="text-center text-3xl font-bold dark:text-white">WeatherApp</Text>
      </View>
    </View>
  );
}

