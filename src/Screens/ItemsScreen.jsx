import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import { getCategoryItems, urlFor } from "../../sanity";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.72;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;
const SPACE = 10;

const BackDrop = ({ items, scrollX }) => {
  return (
    <View style={{ width, height, position: "absolute" }}>
      <FlatList
        data={[{ key: "left" }, ...items, { key: "right" }]}
        keyExtractor={(_, i) => i.toString()}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height }}
        renderItem={({ item, index }) => {
          if (item?.key) return;
          const inputRange = [
            (index - 2) * (ITEM_WIDTH + SPACE * 2),
            (index - 1) * (ITEM_WIDTH + SPACE * 2),
          ];
          const backdropWidth = scrollX.interpolate({
            inputRange,
            outputRange: [0, width],
          });

          return (
            <Animated.View
              style={{
                width: backdropWidth,
                height,
                position: "absolute",
                overflow: "hidden",
              }}
              removeClippedSubviews={false}
            >
              <Image
                style={{
                  height,
                  width,
                  position: "absolute",
                  resizeMode: "cover",
                }}
                source={{ uri: urlFor(item.image).url() }}
                blurRadius={10}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const ItemsScreen = ({ route, navigation }) => {
  const id = route.params.param;
  const [items, setItems] = React.useState(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    getCategoryItems(id)
      .then((d) => {
        setItems(d);
      })
      .catch((e) => console.log(e));
  }, []);
  if (!items) {
    return (
      <>
        <View className="flex-1  bg-main-bg items-center justify-center">
          <ActivityIndicator color={"#ff0000"} size={"large"} />
        </View>
      </>
    );
  }
  return (
    <View className="w-full h-full bg-main-bg">
      <BackDrop items={items} scrollX={scrollX} />
      <View
        className="w-full flex absolute z-30"
        style={{ top: StatusBar.currentHeight + 10 || 12 }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className="p-4 w-[60px]"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Animated.FlatList
        data={[{ key: "left" }, ...items, { key: "right" }]}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        snapToInterval={ITEM_WIDTH + SPACE * 2}
        scrollEventThrottle={16}
        decelerationRate={0}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * (ITEM_WIDTH + SPACE * 2),
            (index - 1) * (ITEM_WIDTH + SPACE * 2),
            index * (ITEM_WIDTH + SPACE * 2),
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [30, 0, 30],
          });
          if (item?.key) {
            return (
              <View
                style={{
                  width: SPACER_WIDTH,
                  height: SPACER_WIDTH,
                  marginHorizontal: -SPACE / 2,
                }}
              />
            );
          }
          return (
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                backgroundColor: "#fff",
                marginHorizontal: SPACE,
                borderRadius: 40,
                transform: [{ translateY }],
                padding: 10,
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => navigation.navigate("Item", { _id: item?._id })}
              >
                <Image
                  source={{ uri: urlFor(item?.image).url() }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                    borderRadius: 40,
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default ItemsScreen;
