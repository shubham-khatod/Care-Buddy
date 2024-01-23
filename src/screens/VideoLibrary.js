//import liraries
// import AsyncStorage from '@react-native-async-storage/async-storage';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import React, {
  Component,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Video from "react-native-video";
import { useFocusEffect, useBackButton } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";

import Carousel from "react-native-snap-carousel";
import WebView from "react-native-webview";
import Header from "./Header";
// import {ScrollView} from 'react-native-gesture-handler';
// create a component

const SCREEN_WIDTH = Dimensions.get("window").width;

const { height, width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const videoWidth = width * 0.7;
const videoHeight = videoWidth * (9 / 16);

// var videos = [
//   { day:'1', id: 'K-Sp2eRSH48', url: 'https://www.youtube.com/embed/K-Sp2eRSH48' },
//   { day:'2',id: '04z5jfJgSI4', url: 'https://www.youtube.com/embed/04z5jfJgSI4' },
//   { day:'3',id: 'wPwuU7asJZc', url: 'https://www.youtube.com/embed/wPwuU7asJZc' },
//   { day:'4',id: 'RJ3rsUc-lTM', url: 'https://www.youtube.com/embed/RJ3rsUc-lTM' },
//   { day:'5',id: '0THhrVqt-5w', url: 'https://www.youtube.com/embed/0THhrVqt-5w' },
// ];

var videos = [
  {
    day: "1",
    id: "K-Sp2eRSH48",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
  {
    day: "2",
    id: "04z5jfJgSI4",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
  {
    day: "3",
    id: "wPwuU7asJZc",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
  {
    day: "4",
    id: "RJ3rsUc-lTM",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
  {
    day: "5",
    id: "0THhrVqt-5w",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
];

const Generic_Videos = [
  {
    day: "1",
    id: "6E_NU69-hzM",
    url: "https://www.youtube.com/embed/6E_NU69-hzM",
  },
  {
    day: "2",
    id: "-j6jdjXieNI",
    url: "https://www.youtube.com/embed/-j6jdjXieNI",
  },
  {
    day: "3",
    id: "OY8ZYtFti7M",
    url: "https://www.youtube.com/embed/OY8ZYtFti7M",
  },
  {
    day: "4",
    id: "KqLFlNLmgIk",
    url: "https://www.youtube.com/embed/KqLFlNLmgIk",
  },
  {
    day: "5",
    id: "ebsLMfzTkP4",
    url: "https://www.youtube.com/embed/ebsLMfzTkP4",
  },
  {
    day: "6",
    id: "GeOMNzf0N1I",
    url: "https://www.youtube.com/embed/GeOMNzf0N1I",
  },
  {
    day: "7",
    id: "h1ETyaEYqNo",
    url: "https://www.youtube.com/embed/h1ETyaEYqNo",
  },
  {
    day: "8",
    id: "neEimvMy5Bs",
    url: "https://www.youtube.com/embed/neEimvMy5Bs",
  },
  {
    day: "9",
    id: "MaInE0NZhGE",
    url: "https://www.youtube.com/embed/MaInE0NZhGE",
  },
  {
    day: "10",
    id: "-66TSQlepwg",
    url: "https://www.youtube.com/embed/-66TSQlepwg",
  },
  {
    day: "11",
    id: "uH-FEcvXOVE",
    url: "https://www.youtube.com/embed/uH-FEcvXOVE",
  },
  {
    day: "12",
    id: "OXHrvcl-bxc",
    url: "https://www.youtube.com/embed/OXHrvcl-bxc",
  },
  {
    day: "13",
    id: "Nyu-YxeiZZY",
    url: "https://www.youtube.com/embed/Nyu-YxeiZZY",
  },
];

const Varicose_Veins = [
  {
    day: "1",
    id: "gf4uIgwig4w",
    url: "https://www.youtube.com/embed/gf4uIgwig4w",
  },
];

const Fistula = [
  {
    day: "1",
    id: "1",
    url: "",
  },
  {
    day: "2",
    id: "2",
    url: "",
  },
  {
    day: "3",
    id: "3",
    url: "",
  },
];

const Hernia = [
  {
    day: "1",
    id: "1",
    url: "",
  },
  {
    day: "2",
    id: "2",
    url: "",
  },
];

const Piles = [
  {
    day: "1",
    id: "1",
    url: "",
  },
  {
    day: "2",
    id: "2",
    url: "",
  },
];

const Constipation = [
  {
    day: "1",
    id: "cWCJRMfYZcI",
    url: "https://www.youtube.com/embed/cWCJRMfYZcI",
  },
];
var instructionVideos = [
  {
    instructionText:
      "Lorem ipsum dolor sit amet, cosnsectetur adipiscing elit,sed do eiusmod tempor in",
    day: "1",
    id: "K-Sp2eRSH48",
    url: "https://www.youtube.com/embed/K-Sp2eRSH48",
  },
  {
    instructionText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in",
    day: "2",
    id: "04z5jfJgSI4",
    url: "https://www.youtube.com/embed/04z5jfJgSI4",
  },
  {
    instructionText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in",
    day: "3",
    id: "wPwuU7asJZc",
    url: "https://www.youtube.com/embed/wPwuU7asJZc",
  },
  {
    instructionText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in",
    day: "4",
    id: "RJ3rsUc-lTM",
    url: "https://www.youtube.com/embed/RJ3rsUc-lTM",
  },
  {
    instructionText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in",
    day: "5",
    id: "0THhrVqt-5w",
    url: "https://www.youtube.com/embed/0THhrVqt-5w",
  },
];

export default function VideoLibrary() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState();
  const [surgery, setSurgery] = useState("Piles");
  const [piles, setPiles] = useState([]);
  const [fistula, setFistula] = useState([]);
  const [hernia, setHernia] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef();

  // const [urlArray, setUrlArray] = ([]);
  var urlArray = [];
  useEffect(() => {
    const readTimeStamp = async () => {
      var userData = await AsyncStorage.getItem("userSession");
      // If the userData is not empty, then only move for the further firebase functionality.

      if (userData !== null) {
        userData = JSON.parse(userData);
        setTimeStamp(userData.timeStamp);
        if (userData.surgicalType) {
          if (
            userData.surgicalType == "Piles" ||
            userData.surgicalType == "Circum" ||
            userData.surgicalType == "Fissure" ||
            userData.surgicalType == "Fistula" ||
            userData.surgicalType == "Hernia" ||
            userData.surgicalType == "Sinus" ||
            userData.surgicalType == "Varicose"
          ) {
            setSurgery(userData.surgicalType);
            console.log("Hernia Called", surgery);
          } else {
            setSurgery("Piles");
            console.log("Piles Called");
          }
        } else {
          if (
            userData.surgery == "Piles" ||
            userData.surgery == "Circum" ||
            userData.surgery == "Fissure" ||
            userData.surgery == "Fistula" ||
            userData.surgery == "Hernia" ||
            userData.surgery == "Sinus" ||
            userData.surgery == "Varicose"
          ) {
            setSurgery(userData.surgery);
            console.log("Hernia Called", surgery);
          } else {
            setSurgery("Piles");
            console.log("Piles Called");
          }
        }

        //console.log(timeStamp);
      }
    };
    readTimeStamp();

    // Fetch today number whenever the component is rendered.
    // readDay();

    // Function to set patient's todays video.
    // setTodaysVideo();

    // getTemplate();
  }, []);

  const fetchVideoURLs = async () => {
    const storage = firebase.storage();
    if (surgery === "Piles") {
      setLoading(true);

      try {
        const urls = await Promise.all(
          Piles.map(async (item) => {
            try {
              const url = await storage
                .ref()
                .child(`${surgery}/day${item.day}Url.mp4`)
                .getDownloadURL();
              return { ...item, url };
            } catch (error) {
              console.error(`Error fetching URL for day ${item.day}:`, error);
              return { ...item, url: null };
            }
          })
        );
        setPiles(urls.filter((item) => item.url !== null));
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      } finally {
        setLoading(false);
      }
    }
    if (surgery === "Hernia") {
      setLoading(true);
      try {
        const urls = await Promise.all(
          Hernia.map(async (item) => {
            try {
              const url = await storage
                .ref()
                .child(`${surgery}/day${item.day}Url.mp4`)
                .getDownloadURL();
              return { ...item, url };
            } catch (error) {
              console.error(`Error fetching URL for day ${item.day}:`, error);
              return { ...item, url: null };
            }
          })
        );
        setHernia(urls.filter((item) => item.url !== null));
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      } finally {
        setLoading(false);
      }
    }
    if (surgery === "Fistula") {
      setLoading(true);
      try {
        const urls = await Promise.all(
          Fistula.map(async (item) => {
            try {
              const url = await storage
                .ref()
                .child(`${surgery}/day${item.day}Url.mp4`)
                .getDownloadURL();
              return { ...item, url };
            } catch (error) {
              console.error(`Error fetching URL for day ${item.day}:`, error);
              return { ...item, url: null };
            }
          })
        );
        setFistula(urls.filter((item) => item.url !== null));
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVideoURLs();
  }, [surgery]); // Assuming surgery may change

  const renderInstructionItemPortrait = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          position: "relative",
          flex: 1,
          width: width, //343,
          height: 415, //193,
          overflow: "hidden",

          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Video
          source={{
            uri: item.url,
          }}
          paused={true}
          controls={true}
          style={{
            height: "100%",
            width: width * 0.7,
            borderRadius: 5,
            borderWidth: 1,
          }}
          resizeMode="contain"
          hideShutterView={true}
          playInBackground={false}
          playWhenInactive={false}
        />
      </Animated.View>
    );
  };

  const renderInstructionItem = ({ item }) => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.itemContainer}>
        <WebView
          source={{ uri: item.url }}
          style={styles.video}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={true}
          domStorageEnabled={true}
          allowFileAccess={false}
          startInLoadingState={true}
        />
      </View>
      {/*<Text
        style={{
          marginTop: 6,
          color: '#000000',
          fontFamily: 'PT Sans',
          fontSize: 13,
        }}>
        {' '}
        {item.instructionText}{' '}
      </Text>*/}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Video Library"} />
      <ScrollView>
        <View style={{ marginTop: 5 }}>
          <Image
            source={require("../../assets/images/dash.png")}
            style={{ width: "100%" }}
          />
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontSize: 15,
              color: "#376858",
            }}
          >
            You are watching videos of{" "}
          </Text>
          <View
            style={{
              borderWidth: 2,
              height: 50,
              fontFamily: "Roboto-Medium",
              borderRadius: 10,
              width: 150,
              borderColor: "#376858",
            }}
          >
            <Picker
              style={{
                fontFamily: "Roboto-Medium",
                fontSize: 15,
                color: "#376858",
              }}
              selectedValue={surgery}
              onValueChange={(itemValue, itemIndex) => {
                setCurrentIndex(0);
                setSurgery(itemValue);
              }}
            >
              <Picker.Item label="Generic Videos" value="Generic Videos" />
              <Picker.Item label="Piles" value="Piles" />
              <Picker.Item label="Fistula" value="Fistula" />
              <Picker.Item label="Circumcision" value="Circum" />
              <Picker.Item label="Pilonidal Sinus" value="Sinus" />
              <Picker.Item label="Fissure" value="Fissure" />
              <Picker.Item label="Varicose Veins" value="Varicose" />
              <Picker.Item label="Hernia" value="Hernia" />
              <Picker.Item label="Constipation" value="Constipation" />
            </Picker>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Image
            source={require("../../assets/images/dash.png")}
            style={{ width: "100%" }}
          />
        </View>

        {surgery === "Fistula" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Fistula Videos{" "}
              </Text>
            </View>

            {/* <View style={{ marginTop: 10 }}>
              <Carousel
                data={Fistula}
                renderItem={renderInstructionItemPortrait}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View> */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: width,
              }}
            >
              {!loading ? (
                fistula &&
                fistula.length > 2 && (
                  <>
                    <Animated.FlatList
                      ref={ref}
                      horizontal={true}
                      data={fistula}
                      pagingEnabled={true}
                      onScroll={(e) => {
                        const x = e.nativeEvent.contentOffset.x;
                        setCurrentIndex((x / width).toFixed(0));
                      }}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderInstructionItemPortrait}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        width: width,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      {Fistula.map((item, index) => {
                        return (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor:
                                currentIndex == index ? "green" : "gray",
                              marginLeft: 5,
                            }}
                            key={index}
                          ></View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                      }}
                    >
                      <TouchableOpacity
                        disabled={currentIndex == 0 ? true : false}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == 0 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex - 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) - 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/left-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={
                          currentIndex == Fistula.length - 1 ? true : false
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == Fistula.length - 1 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex + 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) + 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/right-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <ActivityIndicator
                  style={styles.indicator}
                  color="#1b6844"
                  size="large"
                />
              )}
            </View>

            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}

        {surgery === "Hernia" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Hernia Videos{" "}
              </Text>
            </View>

            {/* Video Carousel Slider */}

            {/* <View style={{ marginTop: 10 }}>
              <Carousel
                data={Hernia}
                renderItem={renderInstructionItemPortrait}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View> */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: width,
              }}
            >
              {!loading ? (
                hernia &&
                hernia.length > 1 && (
                  <>
                    <Animated.FlatList
                      ref={ref}
                      horizontal={true}
                      data={hernia}
                      pagingEnabled={true}
                      onScroll={(e) => {
                        const x = e.nativeEvent.contentOffset.x;
                        setCurrentIndex((x / width).toFixed(0));
                      }}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderInstructionItemPortrait}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        width: width,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      {Hernia.map((item, index) => {
                        return (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor:
                                currentIndex == index ? "green" : "gray",
                              marginLeft: 5,
                            }}
                            key={index}
                          ></View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                      }}
                    >
                      <TouchableOpacity
                        disabled={currentIndex == 0 ? true : false}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == 0 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex - 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) - 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/left-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={
                          currentIndex == Hernia.length - 1 ? true : false
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == Hernia.length - 1 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex + 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) + 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/right-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <ActivityIndicator
                  style={styles.indicator}
                  color="#1b6844"
                  size="large"
                />
              )}
            </View>

            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}

        {surgery === "Piles" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Piles Videos{" "}
              </Text>
            </View>

            {/* Video Carousel Slider */}

            {/* <View style={{ marginTop: 10 }}>
              <Carousel
                data={Piles}
                renderItem={renderInstructionItemPortrait}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View> */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: width,
              }}
            >
              {!loading ? (
                piles &&
                piles.length > 1 && (
                  <>
                    <Animated.FlatList
                      ref={ref}
                      horizontal={true}
                      data={piles}
                      pagingEnabled={true}
                      onScroll={(e) => {
                        const x = e.nativeEvent.contentOffset.x;
                        setCurrentIndex((x / width).toFixed(0));
                      }}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderInstructionItemPortrait}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        width: width,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      {Piles.map((item, index) => {
                        return (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor:
                                currentIndex == index ? "green" : "gray",
                              marginLeft: 5,
                            }}
                            key={index}
                          ></View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                      }}
                    >
                      <TouchableOpacity
                        disabled={currentIndex == 0 ? true : false}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == 0 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex - 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) - 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/left-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={
                          currentIndex == Piles.length - 1 ? true : false
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#000",
                          opacity: currentIndex == Piles.length - 1 ? 0.5 : 1,
                        }}
                        onPress={() => {
                          setCurrentIndex(currentIndex + 1);
                          ref.current.scrollToIndex({
                            animated: true,
                            index: parseInt(currentIndex) + 1,
                          });
                        }}
                      >
                        <Image
                          source={require("../../assets/images/right-button.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <ActivityIndicator
                  style={styles.indicator}
                  color="#1b6844"
                  size="large"
                />
              )}
            </View>

            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}

        {surgery === "Generic Videos" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Generic Videos{" "}
              </Text>
            </View>

            {/* Video Carousel Slider */}

            {/* <View style={{ marginTop: 10 }}>
              <Carousel
                data={Generic_Videos}
                renderItem={renderInstructionItem}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View> */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: width,
              }}
            >
              <Animated.FlatList
                ref={ref}
                data={Generic_Videos}
                horizontal
                pagingEnabled={true}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  setCurrentIndex((x / width).toFixed(0));
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={renderInstructionItem}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: width,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {Generic_Videos.map((item, index) => {
                return (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: currentIndex == index ? "green" : "gray",
                      marginLeft: 5,
                    }}
                    key={index}
                  ></View>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                disabled={currentIndex == 0 ? true : false}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  opacity: currentIndex == 0 ? 0.5 : 1,
                }}
                onPress={() => {
                  setCurrentIndex(currentIndex - 1);
                  ref.current.scrollToIndex({
                    animated: true,
                    index: parseInt(currentIndex) - 1,
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/left-button.png")}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  currentIndex == Generic_Videos.length - 1 ? true : false
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  opacity: currentIndex == Generic_Videos.length - 1 ? 0.5 : 1,
                }}
                onPress={() => {
                  setCurrentIndex(currentIndex + 1);
                  ref.current.scrollToIndex({
                    animated: true,
                    index: parseInt(currentIndex) + 1,
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/right-button.png")}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}

        {surgery === "Varicose" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Varicose Veins Videos{" "}
              </Text>
            </View>

            {/* Video Carousel Slider */}

            <View style={{ marginTop: 10 }}>
              <Carousel
                data={Varicose_Veins}
                renderItem={renderInstructionItem}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}

        {surgery === "Constipation" && (
          <View>
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  color: "#376858",
                }}
              >
                {" "}
                Constipation Videos{" "}
              </Text>
            </View>

            {/* Video Carousel Slider */}

            <View style={{ marginTop: 10 }}>
              <Carousel
                data={Constipation}
                renderItem={renderInstructionItem}
                sliderWidth={width}
                activeSlideAlignment="center"
                itemWidth={ITEM_WIDTH}
                vertical={false}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <Image
                source={require("../../assets/images/dash.png")}
                style={{ width: "100%" }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
    // width: 293,
    // height: 156,
  },
  itemContainer: {
    width: width,
    height: ITEM_WIDTH * 0.56,
    // width: 293,
    // height: 156,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

//make this component available to the app
// export default call;
