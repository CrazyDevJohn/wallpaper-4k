import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React from "react";
import { getCategory } from "../../sanity";
import { Ionicons } from "@expo/vector-icons";
import { MasonaryLayout } from "../Components";

const Home = ({ navigation }) => {
  const [categories, setCategories] = React.useState(null);
  React.useEffect(() => {
    getCategory()
      .then((d) => {
        setCategories(d);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-main-bg relative">
      <SafeAreaView
        className="flex w-full flex-1 items-center justify-start gap-4 bg-[#04020d]"
        style={{ paddingTop: StatusBar.currentHeight + 10 || 12 }}
      >
        <View className="w-full px-6 flex-row items-center justify-between">
          <Text className="text-2xl text-gray-50 font-semibold">
            4K Wallpaper
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Upload")}>
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView className="w-full h-full px-4">
          {categories ? (
            <>
              <MasonaryLayout data={categories} screen={"ItemsScreen"} />
            </>
          ) : (
            <>
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color={"#ff0000"} size={"large"} />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
