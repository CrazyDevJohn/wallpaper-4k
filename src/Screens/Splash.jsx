import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { BG } from "../../assets";

const Splash = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-main-bg relative">
      <Image source={BG} className="w-full h-full object-cover" />
      <View className="absolute z-10 inset-0 flex items-center justify-start h-full w-full">
        <View className="w-full flex px-4 py-44">
          <Text className="text-xl text-[#f6e8e1]">Mobile</Text>
          <Text className="text-[54px] text-white tracking-wider font-bold">
            4K Wallpaper
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.replace("Home");
          }}
          className="w-full px-16 mt-96 absolute bottom-20"
        >
          <View className="w-full bg-[#e1a334] p-4 flex-row items-center justify-center rounded-full">
            <Text className="text-[#6f0f00] text-xl font-bold">
              Get Started :
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Splash;
