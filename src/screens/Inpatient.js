import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Video from 'react-native-video';
import WebView from 'react-native-webview';
import YouTube from 'react-native-youtube';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import VideoPlayer from 'react-native-video-controls';
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
  Platform,
  PermissionsAndroid,
  PermissionsIOS,
} from 'react-native';

import Slider from '@react-native-community/slider';
import {SuccessModal} from '../../Components/SuccessModal';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import VideoLibrary from './VideoLibrary';
import Header from './Header';
const gradientColors = ['#D0E9E3', '#6abd6a','#2f9545', '#377c4f',  '#316856'];

const thumbImage = require('./../../assets/images/thumb.png');

const {height, width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;
const videoWidth = width * 0.7;
const videoHeight = videoWidth * (9 / 16);

const images = [
  require('../../assets/images/2.jpg'),
  require('../../assets/images/4.jpg'),
  require('../../assets/images/6.jpg'),
  require('../../assets/images/8.jpg'),
  require('../../assets/images/10.jpg'),
];

const videos = [
  {id: 'K-Sp2eRSH48', url: 'https://www.youtube.com/embed/K-Sp2eRSH48'},
  {id: '04z5jfJgSI4', url: 'https://www.youtube.com/embed/04z5jfJgSI4'},
  {id: 'wPwuU7asJZc', url: 'https://www.youtube.com/embed/wPwuU7asJZc'},
  {id: 'RJ3rsUc-lTM', url: 'https://www.youtube.com/embed/RJ3rsUc-lTM'},
  {id: '0THhrVqt-5w', url: 'https://www.youtube.com/embed/0THhrVqt-5w'},
];

const numberData = [
  {key: '0'},
  {key: '1'},
  {key: '2'},
  {key: '3'},
  {key: '4'},
  {key: '5'},
  {key: '6'},
  {key: '7'},
  {key: '8'},
  {key: '9'},
  {key: '10'},
];

const massages=["We are happy to know your Pain free status",
"It helps us to serve you in a better way.",
"It helps us improving pain free treatment.",
"Such Discomfort is expected after surgery.If you feel more discomfort or Pain,feel free to contact us anytime.",
"Such Discomfort is expected after surgery.If you feel more discomfort or Pain,feel free to contact us anytime.",
"Such Pain is expected after surgery.Feel free to contact us or update Pain Score if you feel more discomfort or Pain.",
"Such Pain is expected after surgery.Feel free to contact us or update Pain Score if you feel more discomfort or Pain.",
"You will receive a call from our doctors shortly,Please call our team if you don't get a callback in sometime.",
"You will receive a call from our doctors shortly,Please call our team if you don't get a callback in sometime.",
"You will receive a call from our doctors shortly,Please call our team if you don't get a callback in sometime.",
"You will receive a call from our doctors shortly,Please call our team if you don't get a callback in sometime."]
const windowWidth = Dimensions.get('window');
const videoW = 300; // assume the video has a width of 640
const videoH = 150; // assume the video has a height of 360
const aspectRatio = videoW / videoH;

// var userData = {};

export default function Menu() {
  const navigator = useNavigation();

  var url = '';
  const [surgery, setSurgery] = useState('Piles');

  const [activeIndex, setActiveIndex] = useState(0);

  const renderNumber = ({item}) => (
    <View style={{padding: 11}}>
      <Text style={{fontSize: 18, color: '#C5C5C5'}}>{item.key}</Text>
    </View>
  );

  // Function renderItem is used to render the YouTube videos, which displays carousal for youtube videos.
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <WebView
        source={{uri: item.url}}
        style={styles.video}
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
      />
    </View>
  );

  // Nikhil Code States

  const [template, setTemplate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [asssitantDoctor, setAsssitantDoctor] = useState('');
  const [textforFollowUpAppointment, setTextforFollowUpAppointment] =
    useState('');
  const [textforOrderMedcine, setTextforOrderMedcine] = useState('');
  const [whatsAppNumberApp, setWhatsAppNumberApp] = useState('');
  const [whatsAppNumberOrederMed, setWhatsAppNumberOrederMed] = useState('');

  const [patientPain, setPaitentPain] = useState({});
  const [timeStamp, setTimeStamp] = useState();

  const [image, setImage] = useState(4);
  const [painValue, setPainValue] = useState(4);
  const [sliderValue, setSliderValue]= useState();
  const [patientObj, setPatientObj] = useState({});

  const [nausea, setNausea] = useState(false);
  const [vomitting, setVomitting] = useState(false);
  const [hyperAcidity, setHyperAcidity] = useState(false);
  const [bleeding, setBleeding] = useState(false);

  const [videoLoading, setVideoLoading] = useState(false);

  // var day = 0;
  const [today, setToday] = useState(1);
  const [dayTimeStamp, setDayTimeStamp] = useState();
  const [todaysUrl, setTodaysUrl] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleVideoLibraryClick = () => {
    navigator.navigate('VideoLibrary');
  };

  // ===================== Handling Success Modals =====================
  const handleSuccessSubmit = () => {
    // Submit form logic goes here
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setNausea(false);
    setVomitting(false);
    setHyperAcidity(false);
    setBleeding(false);
    setIsSuccessModalVisible(false);
  };

  const {width, height} = Dimensions.get('screen');

  // ===================== Used to set the Pain Value. =====================
  const handlePainValue = value => {
    console.log("Slider value: ",parseInt(value));
    setSliderValue(parseInt(value));
    setPainValue(
      Math.floor(
        parseInt(value) % 2 == 0 ? parseInt(value) : parseInt(value) + 1,
      ),
    );
    setPatientObj({
      painValue: painValue,
      time: new Date().toLocaleTimeString(),
    });
    console.log(painValue);
    console.log(patientObj);
  };

  // ===================== Used to display the Slider Thumb Image. =====================
  const handleSettingImage = value => {
    setImage(parseInt(value) % 2 == 0 ? parseInt(value) : parseInt(value) + 1);
  };

  // ===================== Handling 4 Symptoms (Nauseaa, Vomitting, Bleeding, Hyper Acidity) =====================
  const handleClickNausea = () => {
    setNausea(!nausea);
  };

  const handleClickVomitting = () => {
    setVomitting(!vomitting);
  };

  const handleClickHyperAcidity = () => {
    setHyperAcidity(!hyperAcidity);
  };

  const handleClickBleeding = () => {
    setBleeding(!bleeding);
  };

  // ======================== POST SURGERY INSTRUCTION ======================

  const [showFullText, setShowFullText] = useState(false);
  const text =
    'Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua . Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris, Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua . Ut enim ad minim veniam, quis nostrudexercitation ullamco laboris ';
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
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  // Function to update the Pain Assessment of the User to Firebase.
  const handleSubmit = async () => {
    // Retrieving local storage user data to get the timeStamp, as it is firebase doc id for that user.
    var userData = await AsyncStorage.getItem('userSession');

    // If the userData is not empty, then only move for the further firebase functionality.
    if (userData !== null) {
      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection('Users')
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();

      var lastestTimeStamp = 0;
      // If the patientPain array is empty, then initiate it with first new map having two values painNumber and timeStamp.
      if (userData.painArray && userData.painArray.length > 0) {
        userData.painArray.push(parseInt(painValue));
      } else {
        userData.painArray = [];
        userData.painArray.push(parseInt(painValue));
      }

      if (userData.patientPain && userData.patientPain.length > 0) {
        userData.symptoms = {nausea, bleeding, hyperAcidity, vomitting};
        userData.latestPainFromPatient = parseInt(painValue);
        userData.lastUpdateFromPatient = Math.floor(new Date() / 1000);
        // lastestTimeStamp = userData.latestUpdateFromPatient;
        userData.patientPain.push({
          painNumber: userData.latestPainFromPatient,
          timeStamp: userData.lastUpdateFromPatient,
        });
      }
      // Else, Update the patientPain array with by appending new map.
      else {
        userData.patientPain = [];
        userData.latestPainFromPatient = parseInt(painValue);
        userData.lastUpdateFromPatient = Math.floor(new Date() / 1000);
        // lastestTimeStamp = userData.lastUpdateFromPatient;
        userData.symptoms = {nausea, bleeding, hyperAcidity, vomitting};

        userData.patientPain.push({
          painNumber: userData.latestPainFromPatient,
          timeStamp: userData.lastUpdateFromPatient,
        });
      }

      // Updating the userData, specifically patientPain in the firebase.
      await firestore()
        .doc('Users/' + temp.id)
        .update(userData);
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      handleSuccessSubmit();

      return;
    }
  };

  useEffect(() => {
    readTimeStamp = async () => {
      var userData = await AsyncStorage.getItem('userSession');
      // If the userData is not empty, then only move for the further firebase functionality.

      if (userData !== null) {
        userData = JSON.parse(userData);
        setTimeStamp(userData.timeStamp);
        if (userData.surgicalType) {
          if (
            userData.surgicalType == 'Piles' ||
            userData.surgicalType == 'Circum' ||
            userData.surgicalType == 'Fissure' ||
            userData.surgicalType == 'Fistula' ||
            userData.surgicalType == 'Hernia' ||
            userData.surgicalType == 'Sinus' ||
            userData.surgicalType == 'Varicose'
          ) {
            setSurgery(userData.surgicalType);
            console.log('Hernia Called', surgery);
          } else {
            setSurgery('Piles');
            console.log('Piles Called');
          }
        } else {
          if (
            userData.surgery == 'Piles' ||
            userData.surgery == 'Circum' ||
            userData.surgery == 'Fissure' ||
            userData.surgery == 'Fistula' ||
            userData.surgery == 'Hernia' ||
            userData.surgery == 'Sinus' ||
            userData.surgery == 'Varicose'
          ) {
            setSurgery(userData.surgery);
            console.log('Hernia Called', surgery);
          } else {
            setSurgery('Piles');
            console.log('Piles Called');
          }
        }

        console.log(timeStamp);
      }
    };
    readTimeStamp();

    // Fetch today number whenever the component is rendered.
    readDay();

    // Function to set patient's todays video.
    // setTodaysVideo();

    getTemplate();
  }, []);

  // readDay function is used to check the currentDay and calculate according to today's time.
  readDay = async () => {
    var userData = await AsyncStorage.getItem('userSession');
    if (userData !== null) {
      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection('Users')
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();

      // If currentDay is present then, check the day and set accordingly.
      if (userData.currentDay && userData.lastDayUpdated) {
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

        const currentDay = userData.currentDay;
        setToday(currentDay);
        console.log('Day Number PRE: ', today);

        const lastDayUpdated = userData.lastDayUpdated;
        const currentDayStart = new Date().setHours(0, 0, 0, 0); // Start of current day
        const dayDiff = Math.floor(
          (lastDayUpdated - currentDayStart) / (24 * 60 * 60 * 1000),
        );

        if (dayDiff > 0) {
          const newDay = currentDay + dayDiff;
          userData.currentDay = newDay;
          userData.lastDayUpdated = currentDayStart;
          setToday(newDay);
          console.log('Day Number POST: ', today);
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
          0,
        );
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - surgeryDateMidnight.getTime();
        const dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        console.log('Day Diffs: ', dayDiff);
        setToday(dayDiff + 1);
        userData.currentDay = dayDiff + 1;
        userData.lastDayUpdated = surgeryDateMidnight.getTime();
      }

      await firestore()
        .doc('Users/' + temp.id)
        .update(userData);
      console.log('Day Number : ', today);
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      console.log('User Fetched');

      await setTodaysVideo();
    }
    return;
  };

  setTodaysVideo = async () => {
    var userData = await AsyncStorage.getItem('userSession');
    if (userData !== null) {
      setVideoLoading(true);
      console.log('HELLO');
      var videoDay = 1;

      if (today % 7 == 0) {
        videoDay = 7;
      } else {
        videoDay = parseInt(today % 7);
      }
      console.log('Day: ', videoDay);

      // Fetching Storage bucket videos according to the surgery value given for patient diagnosis.
      const storage = firebase.storage();
      storage
        .ref()
        .child(`${surgery}/day${videoDay}Url.mp4`)
        .getDownloadURL()
        .then(url => {
          setTodaysUrl(url);
        });

      setVideoLoading(false);
    } else {
      console.log('User Data not present');
    }
    return;
  };

  // getTemplate will fetch the user data from the Async Storage.
  async function getTemplate() {
    var userData = await AsyncStorage.getItem('userSession');
    if (userData !== null) {
      setLoading(true);
      var templates = await firestore()
        .collection('templates')
        .doc('mainPage')
        .get();
      if (templates.data()) {
        setTemplate(templates.data().template);
      }

      userData = JSON.parse(userData);
      var temp = await firestore()
        .collection('BranchInformations')
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

  const youtubeRefs = {};
  videos.forEach(video => {
    youtubeRefs[video.id] = useRef(null);
  });

  const handleVideoPress = video => {
    // Find the YouTube component by ID
    const player = youtubeRefs[video.id].current;

    // Start playing the video
    player && player.playVideo();
  };
  // const thumbSize = 50;

  return (
    <SafeAreaView>
      <Header title={'Home'}/>
      <ScrollView overScrollMode="never">
      
        {/*<View
          style={{
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
            // margin: -70,
            // fontFamily: 'PTSans-Regular',
          }}>*/}
        <View style={styles.container}>
          {/*<View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{width: 46, height: 66}}
              />
            </View>
        </View>*/}

          <Text
            style={{
              marginTop: 5,
              fontSize: 15,
              color: '#376858',
              lineHeight: 19.41,
              fontWeight: 'bold',
            }}>
            Day {today}
          </Text>
          

          {/*<TouchableOpacity
            onPress={handleVideoLibraryClick}
            style={{
              elevation: 5,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: '#478772',
              borderRadius: 5,
              marginHorizontal: 4,
              marginBottom: 10,
              color: 'black',
            }}>
            <Text
              style={{fontFamily: 'Inter', fontWeight: 500, color: '#FFFFFF'}}>
              Video Library
            </Text>
          </TouchableOpacity>*/}

          {/* Video Rendering code from Local Data */}
          {/*<View style={{flex:1, width: 343, height: 193, backgroundColor: 'blue', borderRadius: 5}}>
          <VideoPlayer
            source={require('./../../assets/videos/doctorVideo.mp4')}
            style={{ width: 343, height: 193, borderRadius: 5 }}
            disableFullscreen
            resizeMode="contain"
            paused={false}
          />
        </View>*/}

          {/* Rendering Youtube Video */}
          {videoLoading ? (
            <ActivityIndicator
              style={styles.indicator}
              color="#1b6844"
              size="large"
            />
          ) : (
            <View
              style={{
                flex: 1,
                width: 343,
                height: 193,
                overflow: 'hidden',
                borderRadius: 5,
                marginTop: 10,
              }}>
              <WebView
                source={{uri: todaysUrl}}
                mediaPlaybackRequiresUserAction={true}
                style={{width: 343, height: 193}}
                
                javaScriptEnabled={true}
                allowsFullscreenVideo={true}
                
              />
            </View>
          )}
          <Text
            style={{
              fontSize: 23,
              fontWeight: 400,
              margin: 10,
              color: '#000000',
            }}>
            How is your pain today?
          </Text>
          {/*<Text
            style={{
              fontSize: 18,
              lineHeight: 23.29,
              marginTop: 10,
              color: '#000000',
            }}>
            Post Surgery Instruction
          </Text>
          {// Post Surgery Instructions }
          <View style={{width: '97%'}}>
            <Text
              style={{
                color: '#000000',
                lineHeight: 14.52,
                textAlign: 'center',
                marginTop: 5,
                justifyContent: 'center',
              }}>
              {displayText}
            </Text>
            {!showFullText && (
              <TouchableOpacity
                style={{alignItems: 'center', marginTop: 15}}
                onPress={toggleShowFullText}>
                <Image
                  source={require('./../../assets/images/Arrow.png')}
                  style={{alignItems: 'center'}}
                />
              </TouchableOpacity>
            )}
          </View>*/}

          {/* Kindly Use Pain Scale Text */}
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: '90%',
            }}>
            <Text
              style={{fontSize: 16, fontFamily: 'PT Sans', color: '#000000', textAlign: 'center'}}>
              Kindly use the pain assessment scale below
            </Text>
          </View>

          {/* Pain Numbers Rendering */}
          <View style={{flex: 1}}>
            <FlatList
              data={numberData}
              renderItem={renderNumber}
              horizontal={true}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </View>

          <LinearGradient
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            colors={gradientColors}
            style={{flex: 1, borderRadius: 20}}>
            <View
              style={{
                borderRadius: 20,
                width: 350,
                height: 25,
                justifyContent: 'center',
              }}>
              <Slider
                style={{
                  // width: 350,
                  width: '100%',
                  height: '100%',
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

                // thumbTintColor="#2D5A4C"
                minimumTrackTintColor="gold"
                maximumTrackTintColor="#ffffff"
                onValueChange={value => {
                  handleSettingImage(value);
                  handlePainValue(value);
                }}
              />
            </View>
          </LinearGradient>

          {/* Pain Icons Dispalying */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-around',
              alignContent: 'space-between',
              marginTop: 10,
              marginBottom: 10,
            }}>
            {images.map((image, index) => {
              sliderValue < 1 ? pain=2 : pain=painValue;
              const highLightIndex = (index + 1) * 2;
              if (pain === highLightIndex) {
                return (
                  <Image
                    key={index}
                    source={image}
                    style={{
                      borderColor: 'gold',
                      
                      borderWidth: 5.5,
                      borderRadius: 25,
                      width: 45,
                      height: 45,
                      opacity: 1,
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    key={index}
                    source={image}
                    style={{width: 45, height: 45, opacity: 1}}
                  />
                );
              }
            })}
          </View>

          {/* Pain Text Container Indicater */}
          <View
            elevation={6}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#DBEFEA',
              borderRadius: 10,
              width: '89%',
              height: '7%',
            }}>
            <>
              {image == 2 || image == 0 ? (
                <>
                  <Text
                    style={{
                      lineHeight: 32.35,
                      fontSize: 25,
                      fontWeight: 700,
                      fontFamily: 'PT Sans',
                      color: '#2D5A4C',
                    }}>
                    No Pain
                  </Text>
                  <Text style={{color: '#757575', fontWeight: 400}}>
                    All is well
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              {image == 4 ? (
                <>
                  <Text
                    style={{
                      lineHeight: 32.35,
                      fontSize: 25,
                      fontWeight: 700,
                      fontFamily: 'PT Sans',
                      color: '#2D5A4C',
                    }}>
                    Slight Pain
                  </Text>
                  <Text style={{color: '#757575', fontWeight: 400}}>
                    Pain is present but does not limit activity
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              {image == 6 ? (
                <>
                  <Text
                    style={{
                      lineHeight: 32.35,
                      fontSize: 25,
                      fontWeight: 700,
                      fontFamily: 'PT Sans',
                      color: '#2D5A4C',
                    }}>
                    Mild Pain
                  </Text>
                  <Text style={{color: '#757575'}}>
                    Can do most activities with rest periods
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              {image == 8 ? (
                <>
                  <Text
                    style={{
                      lineHeight: 32.35,
                      fontSize: 25,
                      fontWeight: 700,
                      fontFamily: 'PT Sans',
                      color: '#2D5A4C',
                    }}>
                    Severe Pain
                  </Text>
                  <Text style={{color: '#757575', fontWeight: 400}}>
                    Unable to do most activities because of pain
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              {image == 10 ? (
                <>
                  <Text
                    style={{
                      lineHeight: 32.35,
                      fontSize: 25,
                      fontWeight: 700,
                      fontFamily: 'PT Sans',
                      color: '#2D5A4C',
                    }}>
                    Very Severe Pain
                  </Text>
                  <Text style={{color: '#757575', fontWeight: 400}}>
                    Unable to do most activities because of pain
                  </Text>
                </>
              ) : (
                <></>
              )}
            </>
          </View>

          <Text
            style={{
              marginTop: 15,
              marginBottom: 15,
              fontSize: 18,
              color: 'black',
              fontWeight: 400,
            }}>
            Other pain your are going through ?
          </Text>
          {/* You can select or send recording Text */}
          {/*<Text
              style={{
                marginBottom: 20,
                fontSize: 13,
                color:'#8E8E8E',
                fontWeight: 400
              }}>
              You can select or send recording 
            </Text>*/}

          {/* NAUSEA and VOMTTING Button */}
          <View
            style={{
              width: '100%',
              // borderWidth:1,
              // height:'2.27%',
              height: '3%',
              marginBottom: 20,
              
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-around',
            }}>
            {/*  =================== Nausea Button ==================== */}
            <TouchableOpacity
              onPress={handleClickNausea}
              style={
                !nausea ? styles.checkBoxButtons : styles.selectedCheckBoxButton
              }>
              <Text
                style={
                  !nausea ? styles.checkBoxText : styles.selectedCheckBoxText
                }>
                Nausea
              </Text>
            </TouchableOpacity>

            {/*  =================== Vomitting Button ==================== */}
            <TouchableOpacity
              onPress={handleClickVomitting}
              style={
                !vomitting
                  ? styles.checkBoxButtons
                  : styles.selectedCheckBoxButton
              }>
              <Text
                style={
                  !vomitting ? styles.checkBoxText : styles.selectedCheckBoxText
                }>
                Vomitting
              </Text>
            </TouchableOpacity>
          {/*</View>*/}

          {/* Hyper Acidity and Bleeding Button */}
          {/*<View
            style={{
              width: '100%',
              height: '2.57%',
              // borderWidth:1,
              marginBottom: 10,
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-around',
            }}>*/}
            <TouchableOpacity
              onPress={handleClickHyperAcidity}
              style={
                !hyperAcidity
                  ? styles.checkBoxButtons
                  : styles.selectedCheckBoxButton
              }>
              <Text
                style={
                  !hyperAcidity
                    ? styles.checkBoxText
                    : styles.selectedCheckBoxText
                }>
                Hyper Acidity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClickBleeding}
              style={
                !bleeding
                  ? styles.checkBoxButtons
                  : styles.selectedCheckBoxButton
              }>
              <Text
                style={
                  !bleeding ? styles.checkBoxText : styles.selectedCheckBoxText
                }>
                Bleeding
              </Text>
            </TouchableOpacity>
          </View>

          {/*  =================== Submit Button ==================== */}
          <TouchableOpacity
            elevation={10}
            style={styles.submit}
            onPress={handleSubmit}>
            <Text
              style={{fontSize: 22, color: '#222222', fontFamily: 'PT Sans'}}>
              Submit
            </Text>
          </TouchableOpacity>

          <View>
            <SuccessModal
              visible={isSuccessModalVisible}
              onClose={handleCloseSuccessModal}
              massage1={"Thank you for updating your pain status!"}
              massage2={massages[painValue]}
            />
          </View>

          {/* ================== Youtube Carousal ================== */}
          <View style={{paddingTop: 10, paddingBottom: 100}}>
            <Carousel
              data={videos}
              renderItem={renderItem}
              sliderWidth={width}
              activeSlideAlignment="center"
              itemWidth={ITEM_WIDTH}
              vertical={false}
              onSnapToItem={index => setActiveIndex(index)}
            />
          </View>
        </View>

        {/*</View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
  },
  videoContainer: {
    width: 228,
    marginRight: 10,
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  style1: {
    marginRight: 18,
    width: '15%',
    height: 60,
  },
  style2: {
    marginRight: 18,
    width: '15%',
    height: 60,
    opacity: 0.2,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  recorder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    borderRadius: 50,
    backgroundColor: '#F2F2F2',
    margin: 15,
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
    borderRadius: 25,
    marginBottom: 10,
    width: width * 0.35,
    height: height * 0.05,
  },
  checkBoxButtons: {
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F2',
    borderRadius: 25,

    // marginTop: 20,
    // width: 138,
    width: width * 0.23,

    height: '100%',
    // padding: 20,
    // paddingLeft: 30,
    // paddingRight: 30,
  },

  selectedCheckBoxButton: {
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#478772',
    borderRadius: 25,
    // marginTop: 20,
    // padding: 20,
    // width: 138,
    width: width * 0.23,

    height: '100%',
    // padding: 10,
    // paddingLeft: 30,
    // paddingRight: 30,
  },
  checkBoxText: {
    color: '#484747',
    fontSize: 12,
  },
  selectedCheckBoxText: {
    color: 'white',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  recorderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#007aff',
    marginHorizontal: 5,
  },
  recordingButton: {
    backgroundColor: '#ff3b30',
  },
  playingButton: {
    backgroundColor: '#5ac8fa',
  },
  stopButton: {
    backgroundColor: '#ffcc00',
  },
  deleteButton: {
    backgroundColor: '#ff2d55',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  videoContainer: {
    position: 'absolute',
    width: 250,
    backgroundColor: 'black',
    height: 150,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoItemContainer: {
    width: 228,
    height: 156,
    marginBottom: 100,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedVideoItem: {
    borderWidth: 2,
    borderColor: '#f00',
  },
  videoItem: {
    flex: 1,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
