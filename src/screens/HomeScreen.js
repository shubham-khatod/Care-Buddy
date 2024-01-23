import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Orientation from "react-native-orientation-locker";
import firestore from "@react-native-firebase/firestore";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  NotificationServices,
  requestUserPermission,
} from "../utils/pushNotificationsl";

export default function HomeScreen() {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(true);
  //Orientation.lockToPortrait(); // Lock screen to portrait mode
  useEffect(() => {
    requestUserPermission();
    NotificationServices();

    getTemplate();

    // return () => {
    //   Orientation.unlockAllOrientations(); // Unlock screen orientation on component unmount
    // };
  });

  async function getTemplate() {
    var user = await AsyncStorage.getItem("userSession");
    if (user !== null) {
      // navigator.navigate('Form')
      console.log(user);
      navigator.navigate("Routes");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          style={styles.indicator}
          color="#1b6844"
          size="large"
        />
      ) : (
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <View style={styles.top}>
            <View style={{ top: "34.35%" }}>
              <Text style={styles.txt}>Welcome</Text>
              <Text style={styles.txt}>To</Text>
              <Text style={styles.txt}>Care Buddy</Text>
            </View>

            <Image
              style={styles.circle}
              source={require("../../assets/images/circle.png")}
            />
            <Image
              style={styles.logo}
              source={require("../../assets/images/grayLogo.png")}
            />
          </View>
          <Image
            style={styles.vector1}
            source={require("../../assets/images/Vector1.png")}
          />
          <Image
            style={styles.vector2}
            source={require("../../assets/images/Vector2.png")}
          />
          <Image
            style={styles.vector3}
            source={require("../../assets/images/Vector3.png")}
          />
          <Image
            style={styles.circle1}
            source={require("../../assets/images/drkcircle.png")}
          />
          <Image
            style={styles.circle2}
            source={require("../../assets/images/drkcircle.png")}
          />
          <Image
            style={styles.circle3}
            source={require("../../assets/images/drkcircle.png")}
          />
          <Text style={styles.txt1}>Relieving Pain</Text>
          <Text style={styles.txt2}>Renewing Hope</Text>
          <Text style={styles.txt3}>Restoring Function</Text>

          <Text style={styles.txt4}>
            Click Below To Proceed {/*Select The Pain Type*/}
          </Text>
          <View style={styles.buttonbox}>
            {/*<TouchableOpacity
              style={styles.imageStyle1}
              //  onPress= {()=>{navigator.navigate('Outpatient')}}
              onPress={() => {
                navigator.navigate('OptionPage');
              }}>
              <Image
                source={require('../../assets/images/outpatientnew.png')}
                style={styles.imageStyle1}
              />
            </TouchableOpacity>*/}

            <TouchableOpacity
              style={styles.imageStyle2}
              onPress={() => {
                navigator.navigate("OptionPage");
              }}
              elevation={5}
            >
              <Image
                source={require("../../assets/images/Inpatientnew.png")}
                style={styles.imageStyle2}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    width: "100%",
    height: "46.56%",
    backgroundColor: "#376858",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  circle: {
    position: "absolute",
    top: "79%",
    height: 129,
    width: 129,
    left: "33.58%",
  },
  logo: {
    position: "absolute",
    top: "79.80%",
    height: 120,
    width: 85,
    left: "40%",
  },
  txt: {
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    fontStyle: "normal",
    fontWeight: 400,
    textAlign: "center",
    color: "#FFFFFF",
  },
  vector1: {
    marginTop: 15,
    width: 84,
    height: 27,
    left: "18.60%",
  },
  vector2: {
    left: "48%",
  },
  vector3: {
    left: "53.10%",
    top: "49.80%",
    position: "absolute",
  },
  circle1: {
    position: "absolute",
    left: "46.90%",
    top: "58.20%",
  },
  circle2: {
    position: "absolute",
    top: "52%",
    left: "17.70%",
  },
  circle3: {
    position: "absolute",
    top: "52.5%",
    left: "73.7%",
  },
  txt1: {
    color: "#376858",
    position: "absolute",

    top: "54%",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",

    fontWeight: 400,

    fontSize: 14,
    left: "10%",
  },
  txt2: {
    color: "#376858",
    position: "absolute",

    top: "54%",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",

    fontWeight: 400,

    fontSize: 14,
    left: "65%",
  },
  txt3: {
    color: "#376858",
    position: "absolute",

    top: "60%",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",

    fontWeight: 400,

    fontSize: 14,
    left: "33%",
  },
  // btmbox:{
  //       flex:1,
  //       position:'absolute',
  //       marginTop:'25%',
  //      borderWidth:1,
  //      bottom:3,
  //      right:0,
  //      left:0,
  //      top:450

  // },
  txt4: {
    fontFamily: "Roboto-Medium",
    position: "absolute",
    top: "69%",
    color: "#376858",
    left: "22%",

    fontSize: 18,
  },

  imageStyle1: {
    position: "absolute",
    borderRadius: 10,
    width: 95,
    height: 95,
    left: "45%",
    marginTop: 7,
  },
  imageStyle2: {
    position: "absolute",
    borderRadius: 10,
    marginTop: 7,
    width: 95,
    height: 95,
    left: "30%",
  },

  buttonbox: {
    height: 120,
    flex: 1,
    //borderWidth:3,
    borderColor: "black",
    marginTop: 121,
  },
});
