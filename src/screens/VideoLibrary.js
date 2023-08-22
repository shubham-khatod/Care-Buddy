//import liraries
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {style} from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import React, {Component, useMemo, useState, useEffect} from 'react';
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
} from 'react-native';
import {Linking} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import WebView from 'react-native-webview';
import Header from './Header';
// import {ScrollView} from 'react-native-gesture-handler';
// create a component

const SCREEN_WIDTH = Dimensions.get('window').width;

const {height, width} = Dimensions.get('window');
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
    day: '1',
    id: 'K-Sp2eRSH48',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
  {
    day: '2',
    id: '04z5jfJgSI4',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
  {
    day: '3',
    id: 'wPwuU7asJZc',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
  {
    day: '4',
    id: 'RJ3rsUc-lTM',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
  {
    day: '5',
    id: '0THhrVqt-5w',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
];

var instructionVideos = [
  {
    instructionText:
      'Lorem ipsum dolor sit amet, cosnsectetur adipiscing elit,sed do eiusmod tempor in',
    day: '1',
    id: 'K-Sp2eRSH48',
    url: 'https://www.youtube.com/embed/K-Sp2eRSH48',
  },
  {
    instructionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in',
    day: '2',
    id: '04z5jfJgSI4',
    url: 'https://www.youtube.com/embed/04z5jfJgSI4',
  },
  {
    instructionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in',
    day: '3',
    id: 'wPwuU7asJZc',
    url: 'https://www.youtube.com/embed/wPwuU7asJZc',
  },
  {
    instructionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in',
    day: '4',
    id: 'RJ3rsUc-lTM',
    url: 'https://www.youtube.com/embed/RJ3rsUc-lTM',
  },
  {
    instructionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor in',
    day: '5',
    id: '0THhrVqt-5w',
    url: 'https://www.youtube.com/embed/0THhrVqt-5w',
  },
];

export default function VideoLibrary() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [todaysUrl, setTodaysUrl] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState();
  const [surgery, setSurgery] = useState();
  const [videoData, setVideoData] = useState([]);
  const [day1Url, setDay1Url] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [day2Url, setDay2Url] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [day3Url, setDay3Url] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [day4Url, setDay4Url] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  const [day5Url, setDay5Url] = useState(
    'https://www.youtube.com/embed/K-Sp2eRSH48',
  );
  // const [urlArray, setUrlArray] = ([]);
  var urlArray = [];
  useEffect(() => {
    readTimeStamp = async () => {
      var userData = await AsyncStorage.getItem('userSession');
      // If the userData is not empty, then only move for the further firebase functionality.
      setLoading(false);

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
      await setTodaysVideo();
      setLoading(false);
    };
    readTimeStamp();

    // Fetch today number whenever the component is rendered.
    // readDay();

    // Function to set patient's todays video.
    // setTodaysVideo();

    // getTemplate();
  }, []);

  setTodaysVideo = async () => {
    // setLoading(true);
    console.log('HELLO');
    var videoDay = parseInt(1 % 5);
    console.log('Day: ', videoDay);

    // Fetching Storage bucket videos according to the surgery value given for patient diagnosis.
    const storage = firebase.storage();

    videos.forEach(video => {
      storage
        .ref()
        .child(`${surgery}/day${video.day}Url.mp4`)
        .getDownloadURL()
        .then(url => {
          // Update the url field for the corresponding video object
          const updatedVideos = videos.map(v =>
            v.day === video.day ? {...v, url} : v,
          );
          // Set the state with the updated videos array
          // setVideos(updatedVideos);
          videos = updatedVideos;
          console.log('VIDEOS ARRAY: ', videos);
        })
        .catch(error => {
          console.log(`Error retrieving URL for day ${video.day}:`, error);
        });
    });

    instructionVideos.forEach(instructionVideo => {
      storage
        .ref()
        .child(`${surgery}/day${instructionVideo.day}Url.mp4`)
        .getDownloadURL()
        .then(url => {
          // Update the url field for the corresponding video object
          const updatedVideos = instructionVideos.map(v =>
            v.day === instructionVideo.day ? {...v, url} : v,
          );
          // Set the state with the updated videos array
          // setVideos(updatedVideos);
          instructionVideos = updatedVideos;
          console.log('VIDEOS ARRAY: ', instructionVideos);
        })
        .catch(error => {
          console.log(
            `Error retrieving URL for day ${instructionVideo.day}:`,
            error,
          );
        });
    });

    // setLoading(false);

    console.log(day1Url);
    console.log(day2Url);
    console.log(day3Url);
    console.log(day4Url);
    console.log(day5Url);
  };

  const renderItem = ({item}) => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.itemContainer}>
        <WebView
          source={{uri: item.url}}
          style={styles.video}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={true}
          
        />
      </View>
      <Text
        style={{
          marginTop: 6,
          color: '#000000',
          fontFamily: 'PT Sans',
          fontSize: 13,
        }}>
        {' '}
        Day {item.day}{' '}
      </Text>
    </View>
  );

  const renderInstructionItem = ({item}) => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.itemContainer}>
        <WebView
          source={{uri: item.url}}
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
      <Header title={'Video Library'}/>
      <ScrollView>
        <View>
          {/* LOGO Image */}
          {/*<View style={{ alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{width: 46, height: 66}}
            />
  </View>*/}

          {/*<View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'PT Sans',
                fontSize: 20,
                color: '#000000',
                fontWeight: 'bold',
              }}>
              {' '}
              Video Library{' '}
            </Text>
            </View>*/}
          {/*<View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'PT Sans',
                fontSize: 15,
                color: '#376858',
                fontWeight: 'bold',
              }}>
              {' '}
              Days Videos{' '}
            </Text>
            </View>*/}

          {/* Video Carousel Slider */}
          {/*{loading ? (
            <ActivityIndicator
              style={styles.indicator}
              color="black"
              size="large"
            />
          ) : (
            <View style={{marginTop: 10}}>
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
          )}*/}

          {/* DASH Line 
          <View style={{marginTop: 15}}>
            <Image
              source={require('../../assets/images/dash.png')}
              style={{width: '100%'}}
            />
          </View>*/}

          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'PT Sans',
                fontSize: 15,
                color: '#376858',
                fontWeight: 'bold',
              }}>
              {' '}
              Instruction Videos{' '}
            </Text>
          </View>

          {/* Video Carousel Slider */}

          <View style={{marginTop: 10}}>
            <Carousel
              data={instructionVideos}
              renderItem={renderInstructionItem}
              sliderWidth={width}
              activeSlideAlignment="center"
              itemWidth={ITEM_WIDTH}
              vertical={false}
              onSnapToItem={index => setActiveIndex(index)}
            />
          </View>

          <View style={{marginTop: 15}}>
            <Image
              source={require('../../assets/images/dash.png')}
              style={{width: '100%'}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
    // width: 293,
    // height: 156,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.56,
    // width: 293,
    // height: 156,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//make this component available to the app
// export default call;
