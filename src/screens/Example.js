import * as React from "react";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app";
import WebView from "react-native-webview";
import Carousel from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";
//import Slider from '@react-native-community/slider';
import { Slider } from "@miblanchard/react-native-slider";
import { SuccessModal } from "../../Components/SuccessModal";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import Video from "react-native-video";
import { CheckBox } from "react-native-elements";
//import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  BackHandler,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Header from "./Header";

const gradientColors = ["#D0E9E3", "#6abd6a", "#2f9545", "#377c4f", "#316856"];
const { height, width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const videoWidth = width * 0.7;
const videoHeight = videoWidth * (9 / 16);

const images = [
  require("../../assets/images/2.png"),
  require("../../assets/images/4.png"),
  require("../../assets/images/6.png"),
  require("../../assets/images/8.png"),
  require("../../assets/images/10.png"),
  require("../../assets/images/12.png"),
];

const videos = [
  { id: "K-Sp2eRSH48", url: "https://www.youtube.com/embed/K-Sp2eRSH48" },
  { id: "04z5jfJgSI4", url: "https://www.youtube.com/embed/04z5jfJgSI4" },
  { id: "wPwuU7asJZc", url: "https://www.youtube.com/embed/wPwuU7asJZc" },
  { id: "RJ3rsUc-lTM", url: "https://www.youtube.com/embed/RJ3rsUc-lTM" },
  { id: "0THhrVqt-5w", url: "https://www.youtube.com/embed/0THhrVqt-5w" },
];

const numberData = [
  { key: "0" },
  { key: "1" },
  { key: "2" },
  { key: "3" },
  { key: "4" },
  { key: "5" },
  { key: "6" },
  { key: "7" },
  { key: "8" },
  { key: "9" },
  { key: "10" },
];

const massages = [
  "A smooth road to recovery is indeed a joyride.",
  "Some pain/discomfort is expected. Please continue medication given at the time of discharge.",
  "Some pain/discomfort is expected. Please continue medication given at the time of discharge.",
  "Your ride seems a little bumpy. Hang in there and take the medication prescribed at the time of discharge.",
  "Your ride seems a little bumpy. Hang in there and take the medication prescribed at the time of discharge.",
  "An assistant doctor will call you shortly. If you don't receive a call within 30min, please call on our 24*7 helpline.",
  "An assistant doctor will call you shortly. If you don't receive a call within 30min, please call on our 24*7 helpline.",
  "An assistant doctor will call you right away. Please come to the clinic for assessment and pain management.",
  "An assistant doctor will call you right away. Please come to the clinic for assessment and pain management.",
  "An assistant doctor will call you right away. Please come to the clinic right away for assessment and pain management.",
  "An assistant doctor will call you right away. Please come to the clinic right away for assessment and pain management.",
];
const windowWidth = Dimensions.get("window");
const videoW = 300; // assume the video has a width of 640
const videoH = 150; // assume the video has a height of 360
const aspectRatio = videoW / videoH;

export default Example = () => {
  const navigator = useNavigation();
  const [surgery, setSurgery] = useState("Piles");

  const renderNumber = ({ item }) => (
    <View style={{ justifyContent: "space-between", paddingVertical: 5 }}>
      <Text style={{ fontSize: 15, color: "#999" }}>{item.key}</Text>
    </View>
  );
  // Function renderItem is used to render the YouTube videos, which displays carousal for youtube videos.
  /*const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <WebView
        source={{uri: item.url}}
        style={styles.video}
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
      />
    </View>
  );*/

  const [timeStamp, setTimeStamp] = useState();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState([]);
  const [asssitantDoctor, setAsssitantDoctor] = useState("");
  const [textforFollowUpAppointment, setTextforFollowUpAppointment] =
    useState("");
  const [textforOrderMedcine, setTextforOrderMedcine] = useState("");
  const [whatsAppNumberApp, setWhatsAppNumberApp] = useState("");
  const [whatsAppNumberOrederMed, setWhatsAppNumberOrederMed] = useState("");

  const [patientPain, setPaitentPain] = useState(1);
  const [image, setImage] = useState(1);
  const [painValue, setPainValue] = useState(2);
  const [sliderValue, setSliderValue] = useState();
  const [patientObj, setPatientObj] = useState({});

  const [bleeding, setBleeding] = useState(false);
  const [fever, setFever] = useState(false);
  const [headache, setHeadache] = useState(false);
  const [urination, setUrination] = useState(false);

  const [videoLoading, setVideoLoading] = useState(false);
  const [today, setToday] = useState(1);
  const [todaysUrl, setTodaysUrl] = useState();
  const [todaysThumbnail, setTodaysThumbnail] = useState();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // ===================== Handling Success Modals =====================
  const handleSuccessSubmit = () => {
    // Submit form logic goes here
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setUrination(false);
    setHeadache(false);
    setFever(false);
    setBleeding(false);
    setIsSuccessModalVisible(false);
  };
  const { width, height } = Dimensions.get("screen");
  // ===================== Used to set the Pain Value. =====================
  const handlePainValue = (value) => {
    console.log("Slider value: ", parseInt(value));

    setSliderValue(parseInt(value));
    setPaitentPain(value);
    setPainValue(Math.floor(value));
  };

  // ===================== Used to display the Slider Thumb Image. =====================
  const handleSettingImage = (value) => {
    setImage(parseInt(value) % 2 === 0 ? parseInt(value) : parseInt(value) + 1);
  };

  // ===================== Handling 4 Symptoms (Nauseaa, Vomitting, Bleeding, Hyper Acidity) =====================

  const handleClickBleeding = () => {
    setBleeding(!bleeding);
  };
  const handleClickUrination = () => {
    setUrination(!urination);
  };
  const handleClickHeadache = () => {
    setHeadache(!headache);
  };
  const handleClickFever = () => {
    setFever(!fever);
  };

  // ======================== POST SURGERY INSTRUCTION ======================

  const [showFullText, setShowFullText] = useState(false);
  const text =
    "Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua . Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris, Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua . Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris ";
  const maxLength = 160;
  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };
  const displayText = showFullText ? text : `${text.slice(0, maxLength)}`;

  // For exiting App
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [])
  );

  // Function to update the Pain Assessment of the User to Firebase.
  const handleSubmit = async () => {
    // Retrieving local storage user data to get the timeStamp, as it is firebase doc id for that user.
    var userData = await AsyncStorage.getItem("userSession");

    // If the userData is not empty, then only move for the further firebase functionality.
    if (userData !== null) {
      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection("Users")
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();
      //Everytime pain update, doctor need to attend the patient
      userData.doctorsAction = false;
      var lastestTimeStamp = 0;
      // If the patientPain array is empty, then initiate it with first new map having two values painNumber and timeStamp.
      if (userData.painArray && userData.painArray.length > 0) {
        userData.painArray.push(parseInt(sliderValue));
      } else {
        userData.painArray = [];
        userData.painArray.push(parseInt(sliderValue));
      }

      if (userData.patientPain && userData.patientPain.length > 0) {
        userData.symptoms = { urination, bleeding, fever, headache };
        userData.latestPainFromPatient = parseInt(sliderValue);
        userData.lastUpdateFromPatient = new Date().getTime();

        // lastestTimeStamp = userData.latestUpdateFromPatient;
        userData.patientPain.push({
          painNumber: userData.latestPainFromPatient,
          timeStamp: userData.lastUpdateFromPatient,
        });
      }
      // Else, Update the patientPain array with by appending new map.
      else {
        userData.patientPain = [];
        userData.latestPainFromPatient = parseInt(sliderValue);
        userData.lastUpdateFromPatient = new Date().getTime();
        // lastestTimeStamp = userData.lastUpdateFromPatient;
        userData.symptoms = { urination, bleeding, fever, headache };

        userData.patientPain.push({
          painNumber: userData.latestPainFromPatient,
          timeStamp: userData.lastUpdateFromPatient,
        });
      }

      // Updating the userData, specifically patientPain in the firebase.
      await firestore()
        .doc("Users/" + temp.id)
        .update(userData);
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      handleSuccessSubmit();

      return;
    }
  };

  useEffect(() => {
    // Fetch today number whenever the component is rendered.
    readDay();

    readTimeStamp = async () => {
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

        console.log(timeStamp);
      }
    };
    readTimeStamp();

    // Function to set patient's todays video.
    // setTodaysVideo();

    getTemplate();
  }, []);

  // readDay function is used to check the currentDay and calculate according to today's time.
  readDay = async () => {
    var userData = await AsyncStorage.getItem("userSession");
    if (userData !== null) {
      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection("Users")
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();

      // If currentDay is present then, check the day and set accordingly.
      if (userData.currentDay || userData.lastDayUpdated) {
        // const currentDay = userData.currentDay;
        // setToday(currentDay);
        // console.log('Day Number PRE: ', today);

        // // day = currentDay;
        // const lastDayUpdated = userData.lastDayUpdated;
        // console.log('TS: ',lastDayUpdated);
        // const currentTime = new Date().getTime();
        // setDayTimeStamp(currentTime);
        // const timeDiff = currentTime - lastDayUpdated;
        // const dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        // // day = currentDay + dayDiff;
        // // if(dayDiff){

        //   const newDay = currentDay+dayDiff;
        //   userData.currentDay = newDay;
        //   userData.lastDayUpdated = currentTime;
        //   setToday(newDay);

        //   console.log('Day Number POST: ', today);

        const currentDay = userData.currentDay ? userData.currentDay : 1;
        setToday(currentDay);
        console.log("Day Number PRE: ", currentDay);

        const lastDayUpdated = userData.lastDayUpdated
          ? userData.lastDayUpdated
          : userData.timeStamp * 1000;
        const currentDayStart = new Date().setHours(0, 0, 0, 0); // Start of current day
        const dayDiff = Math.floor(
          (currentDayStart - lastDayUpdated) / (24 * 60 * 60 * 1000)
        );
        console.log("Day Difference: ", dayDiff);
        if (dayDiff > 0) {
          const newDay = currentDay + dayDiff;
          userData.currentDay = newDay;
          userData.lastDayUpdated = currentDayStart;
          setToday(newDay);
          console.log("Day Number POST: ", today);
        }
      }
      // If currentDay is not present, then make a new currentDay.
      else {
        // userData.currentDay = 1;
        // const dateString = userData.surgeryDate;
        // userData.lastDayUpdated = new Date().getTime();

        const surgeryDate = new Date(userData.surgeryDate);
        const surgeryDateMidnight = new Date(
          surgeryDate.getFullYear(),
          surgeryDate.getMonth(),
          surgeryDate.getDate(),
          0,
          0,
          0
        );
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - surgeryDateMidnight.getTime();
        const dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        console.log("Day Diffs: ", dayDiff);
        setToday(dayDiff + 1);
        userData.currentDay = dayDiff + 1;
        userData.lastDayUpdated = surgeryDateMidnight.getTime();
      }

      await firestore()
        .doc("Users/" + temp.id)
        .update(userData);
      console.log("Day Number : ", today);
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      console.log("User Fetched");

      await setTodaysVideo();
    }
    return;
  };

  async function getTemplate() {
    var userData = await AsyncStorage.getItem("userSession");
    if (userData !== null) {
      setLoading(true);
      var templates = await firestore()
        .collection("templates")
        .doc("mainPage")
        .get();
      if (templates.data()) {
        setTemplate(templates.data().template);
      }

      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection("BranchInformations")
        .doc(userData.branchName)
        .get();
      if (temp.data()) {
        temp = temp.data();
        setAsssitantDoctor(temp.asssitantDoctor);
        setWhatsAppNumberApp(temp.whatsAppNumberApp);
        setTextforFollowUpAppointment(temp.textforFollowUpAppointment);
        setWhatsAppNumberOrederMed(temp.whatsAppNumberOrederMed);
        setTextforOrderMedcine(temp.textforOrderMedcine);
      }
    }
    setLoading(false);
  }

  setTodaysVideo = async () => {
    var userData = await AsyncStorage.getItem("userSession");
    if (userData !== null) {
      setVideoLoading(true);
      console.log("HELLO");
      var videoDay = 1;
      /*if (today % 7 == 0) {
        videoDay = 7;
      } else {
        videoDay = parseInt(today % 7);
      }
      console.log("Day: ", videoDay);*/

      if (surgery == "Fistula") {
        if (today < 3) {
          videoDay = 1;
        } else {
          if (today < 15) {
            videoDay = 2;
          } else {
            videoDay = 3;
          }
        }
      } else {
        if (surgery == "Piles") {
          if (today < 3) {
            videoDay = 1;
          } else {
            videoDay = 2;
          }
        } else {
          if (surgery == "Hernia") {
            if (today < 3) {
              videoDay = 1;
            } else {
              videoDay = 2;
            }
          } else {
            surgery = "Piles";
            if (today < 3) {
              videoDay = 1;
            } else {
              videoDay = 2;
            }
          }
        }
      }

      // Fetching Storage bucket videos according to the surgery value given for patient diagnosis.
      const storage = firebase.storage();
      storage
        .ref()
        //.child(`Sample/day1Url.mp4`)
        .child(`${surgery}/day${videoDay}Url.mp4`)
        .getDownloadURL()
        .then((url) => {
          setTodaysUrl(() => url);

          console.log(url);
        })
        .then(() => {
          setVideoLoading(false);
        });
      // storage
      //   .ref()
      //   //.child(`Sample/day1Url.mp4`)
      //   .child(`${surgery}/day${videoDay}Url.png`)
      //   .getDownloadURL()
      //   .then((url) => {
      //     setTodaysThumbnail(url);
      //     //console.log(url);
      //   });
    } else {
      console.log("User Data not present");
    }
    return;
  };

  const youtubeRefs = {};
  videos.forEach((video) => {
    youtubeRefs[video.id] = useRef(null);
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <ScrollView overScrollMode="never" nestedScrollEnabled={true}>
        <View style={styles.container}>
          {/*} <Text
            style={{
              marginTop: 5,
              fontSize: 15,
              color: "#376858",
              lineHeight: 19.41,
              fontWeight: "bold",
            }}
          >
            Day {today}
          </Text>*/}

          {/* Rendering Youtube Video */}
          <View
            style={{
              position: "relative",
              flex: 1,
              width: "70%", //343,
              height: 415, //193,
              overflow: "hidden",
              borderRadius: 5,
              borderWidth: 1,
              marginTop: 2,
            }}
          >
            {videoLoading ? (
              <ActivityIndicator
                style={styles.indicator}
                color="#1b6844"
                size="large"
              />
            ) : (
              todaysUrl && (
                <Video
                  source={{
                    uri: todaysUrl,
                  }}
                  paused={true}
                  controls={true}
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="contain"
                  hideShutterView={true}
                  playInBackground={false}
                  playWhenInactive={false}
                />
              )
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              margin: 10,
              color: "#000",
              fontFamily: "Roboto-Medium",
            }}
          >
            How is your pain on day {today} ?
          </Text>
          {/* Kindly Use Pain Scale Text */}
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Roboto-Medium",
                color: "#000000",
                textAlign: "center",
              }}
            >
              Kindly use the pain assessment scale below
            </Text>
          </View>
          {/* Pain Numbers Rendering */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={numberData}
              renderItem={renderNumber}
              horizontal={true}
              contentContainerStyle={{
                width: 350,
                alignItems: "center",
                justifyContent: "space-between",
              }}
              //ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            />
          </View>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.16, 0.33, 0.5, 0.67, 0.84]}
            colors={[
              "#74b551",
              "#97c24c",
              "#f1ca2d",
              "#e19831",
              "#d6682d",
              "#cd2f2c",
            ]}
            style={{ flex: 1, borderRadius: 20 }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 20,
                width: 350,
                height: 30,
                justifyContent: "center",
              }}
            >
              {/*<Slider
                style={{
                  // width: 350,
                  width: '100%',
                  height: 20,
                  //alignItems: 'center',
                  justifyContent: 'center',
                  // borderWidth:1
                  // marginTop: 10,
                  // marginBottom: 10,
                  // height: 30,
                  //  transform: [{ scaleX: 1 }, { scaleY: 1 }],
                }}
                minimumValue={0}
                maximumValue={10}
                value={3}
                trackStyle={{height: 0}}
                thumbImage={require('./../../assets/images/thumb.png')}
                
                // thumbSize={10}

                //thumbTintColor="#2D5A4C"
                minimumTrackTintColor="gold"
                maximumTrackTintColor="#ffffff"
                onValueChange={value => {
                  handleSettingImage(value);
                  handlePainValue(value);
                }}
              />*/}
              <Slider
                trackStyle={{ margin: 2 }}
                minimumTrackTintColor="gold"
                maximumTrackTintColor="#ffffff"
                minimumValue={0}
                maximumValue={10}
                step={0.1}
                thumbTintColor="#376858"
                thumbStyle={{ height: "35%" }}
                value={patientPain}
                onValueChange={(value) => {
                  handleSettingImage(value);
                  handlePainValue(value);
                  setSelectedImageIndex(
                    parseInt(value) % 2 === 0
                      ? parseInt(value) / 2
                      : (parseInt(value) + 1) / 2
                  );
                }}
              />
            </View>
          </LinearGradient>

          {/* Pain Icons Dispalying */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-around",
              alignContent: "space-between",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleSettingImage(index * 2);
                  handlePainValue(index * 2);
                  setImage(index * 2);
                  setSelectedImageIndex(index);
                }}
              >
                <Image
                  source={image}
                  style={{
                    width: selectedImageIndex === index ? 50 : 35,
                    height: selectedImageIndex === index ? 50 : 35,
                    opacity: selectedImageIndex === index ? 1 : 0.6,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Pain Text Container Indicator */}
          <View
            //elevation={6}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#DBEFEA",
              borderRadius: 10,
              width: "90%",
              paddingVertical: 8,
              paddingHorizontal: 5,
            }}
          >
            <>
              {image <= 1 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,
                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    No pain
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      fontSize: 14,
                      textAlign: "center",
                      fontFamily: "Roboto-Medium",
                    }}
                  >
                    I'm good! Hardly notice any pain
                  </Text>
                </>
              )}
            </>
            <>
              {image > 1 && image <= 3 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,

                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    Mild pain
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      fontFamily: "Roboto-Medium",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    Little distracting but not interfering with routine
                    activities
                  </Text>
                </>
              )}
            </>
            <>
              {image > 3 && image <= 5 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,

                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    Moderate pain
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      textAlign: "center",
                      fontFamily: "Roboto-Medium",
                      fontSize: 14,
                    }}
                  >
                    Hard to ignore and interfering with some routine activities
                  </Text>
                </>
              )}
            </>
            <>
              {image > 5 && image <= 7 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,

                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    Severe pain
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      textAlign: "center",
                      fontFamily: "Roboto-Medium",
                      fontSize: 14,
                    }}
                  >
                    Can't focus, extremely difficult to perform routine
                    activities
                  </Text>
                </>
              )}
            </>
            <>
              {image > 7 && image <= 9 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,

                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    Very severe pain
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      textAlign: "center",
                      fontFamily: "Roboto-Medium",
                      fontSize: 14,
                    }}
                  >
                    Awful! Unable to perform routine activities
                  </Text>
                </>
              )}
            </>
            <>
              {image > 9 && (
                <>
                  <Text
                    style={{
                      //lineHeight: 32.35,
                      fontSize: 18,

                      fontFamily: "Roboto-Bold",
                      color: "#376858",
                    }}
                  >
                    Worst pain possible
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontWeight: 400,
                      fontFamily: "Roboto-Medium",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    Intolerable!! Can't think of anything else
                  </Text>
                </>
              )}
            </>
          </View>

          <Text
            style={{
              marginTop: 15,
              marginBottom: 5,
              fontSize: 15,
              color: "#000",
              fontFamily: "Roboto-Medium",
            }}
          >
            Any other symptoms ?
          </Text>
          {/* NAUSEA and VOMTTING Button */}
          <View
            style={{
              width: "90%",
              // borderWidth:1,
              // height:'2.27%',
              //height: 30,
              flexDirection: "row",
              marginBottom: 5,
            }}
          >
            {/* Nausea CheckBox */}
            <CheckBox
              title={
                <Text
                  style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 13,
                    color: "#000",
                    marginLeft: 5,
                  }}
                >
                  Difficulty in urination
                </Text>
              }
              checked={urination}
              onPress={() => handleClickUrination()}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                width: "55%",
                margin: 0,
              }}
              checkedColor="#376858"
            />

            {/* Vomiting CheckBox */}
            <CheckBox
              title={
                <Text
                  style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 13,
                    color: "#000",
                    marginLeft: 5,
                  }}
                >
                  Headache
                </Text>
              }
              checked={headache}
              onPress={() => handleClickHeadache()}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                width: "45%",
                margin: 0,
              }}
              checkedColor="#376858"
            />
          </View>
          <View
            style={{
              width: "90%",
              // borderWidth:1,
              // height:'2.27%',
              //height: 55,
              //marginBottom: 5,
              flexDirection: "row",
            }}
          >
            {/* Bleeding CheckBox */}
            <CheckBox
              title={
                <Text
                  style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 13,
                    color: "#000",
                    marginLeft: 5,
                  }}
                >
                  Bleeding Discharge
                </Text>
              }
              checked={bleeding}
              onPress={() => handleClickBleeding()}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                width: "55%",
                margin: 0,
              }}
              checkedColor="#376858"
            />
            {/* Hyper Acidity CheckBox */}

            <CheckBox
              title={
                <Text
                  style={{
                    fontFamily: "Roboto-Regular",
                    fontSize: 13,
                    color: "#000",
                    marginLeft: 5,
                  }}
                >
                  Fever
                </Text>
              }
              checked={fever}
              onPress={() => handleClickFever()}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                width: "45%",
                margin: 0,
              }}
              checkedColor="#376858"
            />
          </View>

          {/*  =================== Submit Button ==================== */}
          <TouchableOpacity
            //elevation={10}
            style={styles.submit}
            onPress={handleSubmit}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                fontFamily: "Roboto-Medium",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>

          <View>
            <SuccessModal
              visible={isSuccessModalVisible}
              onClose={handleCloseSuccessModal}
              massage1={"Thank you for updating your pain status!"}
              massage2={massages[sliderValue]}
            />
          </View>

          {/* ================== Youtube Carousal ================== */}
          {/*<View style={{paddingTop: 10, paddingBottom: 100}}>
            <Carousel
              data={videos}
              renderItem={renderItem}
              sliderWidth={width}
              activeSlideAlignment="center"
              itemWidth={ITEM_WIDTH}
              vertical={false}
              onSnapToItem={index => setActiveIndex(index)}
            />
              </View>*/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
  },
  videoContainer: {
    width: 228,
    marginRight: 10,
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  style1: {
    marginRight: 18,
    width: "15%",
    height: 60,
  },
  style2: {
    marginRight: 18,
    width: "15%",
    height: 60,
    opacity: 0.2,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  recorder: {
    alignItems: "center",
    justifyContent: "center",
    width: 43,
    height: 43,
    borderRadius: 50,
    backgroundColor: "#F2F2F2",
    margin: 15,
  },
  submit: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    borderRadius: 20,
    marginVertical: 15,
    width: width * 0.35,
    height: height * 0.05,
  },
  checkBoxButtons: {
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F2F2",
    borderRadius: 25,

    // marginTop: 20,
    // width: 138,
    width: width * 0.23,

    height: "100%",
    // padding: 20,
    // paddingLeft: 30,
    // paddingRight: 30,
  },

  selectedCheckBoxButton: {
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#478772",
    borderRadius: 25,
    // marginTop: 20,
    // padding: 20,
    // width: 138,
    width: width * 0.23,

    height: "100%",
    // padding: 10,
    // paddingLeft: 30,
    // paddingRight: 30,
  },
  checkBoxText: {
    color: "#484747",
    fontSize: 12,
  },
  selectedCheckBoxText: {
    color: "white",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  recorderContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#007aff",
    marginHorizontal: 5,
  },
  recordingButton: {
    backgroundColor: "#ff3b30",
  },
  playingButton: {
    backgroundColor: "#5ac8fa",
  },
  stopButton: {
    backgroundColor: "#ffcc00",
  },
  deleteButton: {
    backgroundColor: "#ff2d55",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  videoContainer: {
    position: "absolute",
    width: 250,
    backgroundColor: "black",
    height: 150,
    marginBottom: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  videoItemContainer: {
    width: 228,
    height: 156,
    marginBottom: 100,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedVideoItem: {
    borderWidth: 2,
    borderColor: "#f00",
  },
  videoItem: {
    flex: 1,
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
