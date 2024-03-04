import React from "react";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getItemById, urlFor } from "../../sanity";

const Item = ({ route, navigation }) => {
  const { _id } = route.params;
  const [item, setItem] = React.useState(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    getItemById(_id)
      .then((d) => {
        setItem(d);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    let date = moment().format("YYYYMMDDhhmmss");
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`;
    try {
      const res = await FileSystem.downloadAsync(
        urlFor(item.image).url(),
        fileUri
      );
      saveFile(res.uri);
    } catch (err) {
      console.log("FS Err: ", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const saveFile = async (fileUri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      try {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync("4k-Wallpaper");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("4k-Wallpaper", asset, false);
          Platform.OS === "android" &&
            ToastAndroid.show("Image Saved successfully!", ToastAndroid.LONG);
        } else {
          Platform.OS === "android" &&
            ToastAndroid.show("Image Saved successfully!", ToastAndroid.LONG);
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (err) {
        console.log("Save err: ", err);
      }
    } else if (status === "denied") {
      alert("please allow permissions to download");
    }
  };
  return (
    <View className="w-full h-full bg-main-bg">
      {item?._id ? (
        <View className="w-full h-full">
          <Image
            source={{ uri: urlFor(item?.image).url() }}
            className="w-full h-full object-cover"
          />
          <View
            style={{ paddingTop: StatusBar.currentHeight + 10 || 12 }}
            className="absolute w-full h-full z-20 "
          >
            <View className="w-full flex">
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                className="p-4 w-[60px]"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="absolute inset-x-0 p-4 bottom-[20px]">
              <BlurView
                intensity={70}
                tint="dark"
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex  justify-between gap-3">
                  <Text className="text-2xl text-white font-bold">
                    {item.title}
                  </Text>
                  <Text className="text-white font-bold">
                    {item.desription}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleDownload}>
                  <MaterialIcons
                    name="cloud-download"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
          {isDownloading && (
            <View className="absolute w-full h-full z-10 bg-black items-center justify-center opacity-80">
              <ActivityIndicator color={"#ff0000"} size={"large"} />
            </View>
          )}
        </View>
      ) : (
        <>
          <View className="flex-1  bg-main-bg items-center justify-center">
            <ActivityIndicator color={"#ff0000"} size={"large"} />
          </View>
        </>
      )}
    </View>
  );
};

export default Item;
