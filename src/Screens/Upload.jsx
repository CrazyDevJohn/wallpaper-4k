import {
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { client, createPost, getCategory, urlFor } from "../../sanity";
import { ROSE } from "../../assets";

const { width, height } = Dimensions.get("screen");

const Upload = ({ navigation }) => {
  const [image, setImage] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [isSelectingCategory, setIsSelectingCategory] = React.useState(false);
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const [isPostUploading, setIsPostUploading] = React.useState(false);

  React.useEffect(() => {
    setIsPostUploading(true);
    setTimeout(() => {
      pickImage();
    }, 1000);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setIsPostUploading(false);
      setIsImageUploading(true);
      const img = await fetch(result.assets[0].uri);
      const blob = await img.blob();
      await client.assets
        .upload("image", blob, {
          filename: "image",
          contentType: blob.type,
        })
        .then((asset) => {
          setImage(asset);
          setIsImageUploading(false);
        })
        .catch((e) => alert(e));
    } else {
      navigation.goBack();
    }
  };

  const publish = async () => {
    if ((image, title, description, category)) {
      setIsPostUploading(true);
      const _doc = {
        _type: "items",
        title,
        desription: description,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: image._id,
          },
        },
        categories: [
          {
            _type: "reference",
            _ref: category?._id,
            _key: new Date().getTime().toString(),
          },
        ],
      };
      const res = await createPost(_doc).then((res) => {
        Platform.OS === "android" &&
          ToastAndroid.show("Post Saved successfully!", ToastAndroid.LONG);
        setTitle("");
        setDescription("");
        setImage("");
        setCategory("");
        setTimeout(() => {
          setIsPostUploading(false);
        }, 1500);
      });
    }
  };

  return (
    <View className="w-full h-full bg-main-bg">
      <ScrollView style={{ flex: 1, padding: 0 }}>
        <View
          style={{
            width,
            minHeight: height,
            paddingHorizontal: 20,
            paddingTop: StatusBar.currentHeight + 10 || 12,
            paddingBottom: 10,
          }}
        >
          <Text className="text-2xl text-gray-50 font-semibold">
            4K Wallpapers
          </Text>
          <View
            className="w-full overflow-hidden mt-4"
            style={{ height: height / 2 }}
          >
            {isImageUploading ? (
              <>
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={"#ff0000"} size={"large"} />
                </View>
              </>
            ) : (
              <Image
                source={{ uri: image?.url }}
                className="w-full h-full rounded-3xl"
              />
            )}
          </View>
          <View className="w-full h-full py-3">
            <View className="mt-5">
              <Text className="text-white font-semibold text-xl">Title</Text>
              <TextInput
                placeholder="Enter Your Title..."
                placeholderTextColor={"#edeef0"}
                value={title}
                onChangeText={(e) => setTitle(e)}
                className="w-full h-12 bg-main-bg border border-white mt-1 rounded-2xl px-2 text-[#edeef0]"
              />
            </View>
            <View className="mt-5">
              <Text className="text-white font-semibold text-xl">
                Description
              </Text>
              <TextInput
                placeholder="Enter Your Title..."
                placeholderTextColor={"#edeef0"}
                value={description}
                onChangeText={(e) => setDescription(e)}
                className="w-full h-12 bg-main-bg border border-white mt-1 rounded-2xl px-2 text-[#edeef0]"
              />
            </View>
            <View className="w-full h-20 mt-5">
              <TouchableOpacity
                className="items-center justify-center w-full h-full border rounded-2xl border-white overflow-hidden"
                onPress={() => {
                  setIsSelectingCategory(true);
                }}
              >
                {category ? (
                  <View
                    style={{
                      margin: SPACE,
                      backgroundColor: "#fff",
                      padding: 5,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <Image
                      source={{ uri: urlFor(category?.image).url() }}
                      style={{
                        height: ITEM_SIZE - 10,
                        width: ITEM_SIZE - 10,
                        borderRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        width: 2,
                        height: ITEM_SIZE - 10,
                        borderRadius: 10,
                        backgroundColor: "#000",
                        marginHorizontal: 10,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#555",
                          textTransform: "capitalize",
                        }}
                      >
                        {category?.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#555",
                          textTransform: "capitalize",
                        }}
                      >
                        {category?.description}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text className="text-2xl font-semibold text-white">
                    Choise a category
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View className="w-full bg-[#2455af] py-2 mt-5 rounded-xl">
              <TouchableOpacity activeOpacity={0.7} onPress={publish}>
                <Text className="text-xl text-center font-semibold text-white uppercase">
                  Publish
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {isSelectingCategory && (
        <CategorysList
          setCategory={setCategory}
          setIsSelectingCategory={setIsSelectingCategory}
        />
      )}
      {isPostUploading && (
        <>
          <View className="absolute w-full h-full z-50 bg-[#0008] items-center justify-center">
            <ActivityIndicator color={"#ff0000"} size={"large"} />
          </View>
        </>
      )}
    </View>
  );
};

const ITEM_SIZE = 80;
const SPACE = 10;

const CategorysList = ({ setCategory, setIsSelectingCategory }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [categories, setCategories] = React.useState(null);

  React.useEffect(() => {
    getCategory()
      .then((c) => {
        setCategories(c);
      })
      .catch((e) => alert(e));
  }, []);

  return (
    <View className="absolute w-full h-full top-0 left-0 z-40 bg-main-bg">
      {categories ? (
        <>
          <Image
            source={ROSE}
            className="w-full h-full object-cover absolute"
            blurRadius={20}
          />
          <View
            style={{
              width,
              height,
              position: "absolute",
              backgroundColor: "#0006",
            }}
          />
          <Animated.FlatList
            data={categories}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{
              paddingTop: StatusBar.currentHeight + 10 || 12,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            renderItem={({ item, index }) => {
              const inputRange = [
                -1,
                0,
                index * (ITEM_SIZE + SPACE * 2),
                (index + 2) * (ITEM_SIZE + SPACE * 2),
              ];
              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0],
              });
              return (
                <Animated.View
                  style={{
                    height: ITEM_SIZE,
                    width: width - 20,
                    margin: SPACE,
                    backgroundColor: "#fff9",
                    borderRadius: 10,
                    padding: 5,
                    transform: [{ scale }],
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                    activeOpacity={0.9}
                    onPress={() => {
                      setCategory(item);
                      setIsSelectingCategory(false);
                    }}
                  >
                    <Image
                      source={{ uri: urlFor(item?.image).url() }}
                      style={{
                        height: ITEM_SIZE - 10,
                        width: ITEM_SIZE - 10,
                        borderRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        width: 2,
                        height: ITEM_SIZE - 10,
                        borderRadius: 10,
                        backgroundColor: "#555",
                        marginHorizontal: 10,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#555",
                          textTransform: "capitalize",
                        }}
                      >
                        {item?.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#555",
                          textTransform: "capitalize",
                        }}
                      >
                        {item?.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </>
      ) : (
        <>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={"#ff0000"} size={"large"} />
          </View>
        </>
      )}
    </View>
  );
};

export default Upload;
