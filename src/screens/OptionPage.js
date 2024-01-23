import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import Orientation from "react-native-orientation-locker";
let docId = "";

// Creating new user account and setting up at firestore database.
const createUser = async (
  uid,
  name,
  number,
  diagnosis,
  branch,
  otherSurgery,
  surgeryDate
) => {
  try {
    const userRef = await firestore().collection("Users").doc();
    const userData = {
      uid,
      name,
      number,
      diagnosis,
      branch,
      otherSurgery,
      surgeryDate,
    };
    await userRef.set(userData);
    docId = userRef.id;
    console.log("Doc id is: ", docId);
    console.log("User data added successfully!");
  } catch (error) {
    console.error("Error adding user data: ", error);
  }
};

// Async Storage Session creating
const storeUserSession = async (data) => {
  try {
    await AsyncStorage.setItem("userSession", JSON.stringify(data));
    console.log("User session stored successfully");
  } catch (error) {
    console.log("Error storing user session:", error);
  }
};

// Function to retrieve user session details
const getUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem("userSession");
    if (userSession !== null) {
      return JSON.parse(userSession);
    } else {
      console.log("User session not found");
    }
  } catch (error) {
    console.log("Error retrieving user session:", error);
  }
};

const OptionPage = () => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState({});
  const [scanned, setScanned] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const [day, setDay] = useState();
  useEffect(() => {
    //Orientation.lockToPortrait(); // Lock screen to portrait mode

    async function requestCameraPermission() {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "This app needs access to your camera to scan QR codes",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasCameraPermission(true);
          } else {
            alert("You need to grant camera permission to use this app");
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setHasCameraPermission(true);
      }
    }
    requestCameraPermission();

    /*return () => {
      Orientation.unlockAllOrientations(); // Unlock screen orientation on component unmount
    };*/
  }, []);

  const handleForm = () => {
    navigator.navigate("Form");
  };

  const handleBarCodeScanned = async ({ data }) => {
    setLoading(true);
    setScanned(true);
    console.log(data);
    setQrData(data);
    // storeUserSession(data);

    var userData = JSON.parse(data);
    console.log("Name: ", userData.name);
    console.log("timeStamp: ", userData.timeStamp);
    // alert(`QR code with data ${data} has been scanned!`);

    if (userData.name == "" || userData.medicalhistory == "") {
      alert("Not Valid QR Code.");
      return;
    }

    if (!userData.timeStamp) {
      userData.timeStamp = Math.floor(new Date() / 1000);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      alert("Something went wrong");
      return;
    }

    userData.token = await messaging().getToken();
    var temp = await firestore()
      .collection("Users")
      .doc(JSON.stringify(userData.timeStamp))
      .get();

    if (temp.data()) {
      if (userData.currentDay || userData.lastDayUpdated) {
        const currentDay = userData.currentDay ? userData.currentDay : 1;
        setDay(currentDay);

        const lastDayUpdated = userData.lastDayUpdated
          ? userData.lastDayUpdated
          : userData.timeStamp * 1000;
        const currentDayStart = new Date().setHours(0, 0, 0, 0); // Start of current day
        const timeDiff = currentDayStart - lastDayUpdated;
        const dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
        if (dayDiff > 0) {
          const newDay = currentDay + dayDiff;
          userData.currentDay = newDay;
          console.log("Day Number while scanning: ", newDay);
        } else {
          console.log("Day Crossed 5 Days: ", currentDay + dayDiff);
        }
      } else {
        userData.currentDay = 1;
        userData.lastDayUpdated = userData.lastDayUpdated
          ? userData.lastDayUpdated
          : userData.timeStamp * 1000;
      }

      await firestore()
        .doc("Users/" + temp.id)
        .update(userData);

      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      console.log("User Fetched by Scanner");
      navigator.navigate("Routes");
      // setLoading(false);
      return;
    } else {
      userData.currentDay = 1;
      //userData.lastDayUpdated = new Date().getTime();

      await firestore()
        .collection("Users")
        .doc(userData.timeStamp.toString())
        .set(userData);
      console.log("New User Added: ", userData);
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      navigator.navigate("Routes");
    }
    setLoading(false);
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text>No camera permission</Text>
      </View>
    );
  }

  const handelSubmit = () => {};

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/grayLogo.png")}
        style={styles.logo}
      />
      <View style={{ top: "31%" }}>
        <Text style={{ fontSize: 16, fontWeight: 500, color: "black" }}>
          Please scan QR Code printed on discharge card
        </Text>
      </View>
      {/* QR Scanner -> Scanning Receipt and calling handleQR function */}

      <View style={styles.frame}>
        <RNCamera
          onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
        />
        {loading ? (
          <ActivityIndicator
            style={styles.indicator}
            color="#1b6844"
            size="large"
          />
        ) : (
          <View></View>
        )}
      </View>
      {/*<Text
        style={{
          fontSize: 30,
          fontFamily: 'PT Sans',
          top: '40%',
          color: '#478772',
        }}>
        or
      </Text>

      {// Fill Form Button -> Redirecting to the Form Filling Page //}
      <TouchableOpacity
        elevation={10}
        style={styles.submit}
        onPress={handleForm}>
        <Text style={{fontSize: 20, color: 'white'}}>Fill Form</Text>
      </TouchableOpacity>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: 'center',
    alignItems: "center",
  },
  camera: {
    flex: 1,
    height: "100%",
    width: "100%",
    //top: "14%",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    margin: 20,
  },
  frame: {
    marginTop: 10,
    borderWidth: 1,
    top: "34%",
    height: "35%",
    width: "70%",
    overflow: "hidden",
    borderRadius: 15,
    borderColor: "black",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  submit: {
    top: "43%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#478772",
    borderRadius: 40,
    marginTop: 20,
    marginBottom: 10,
    width: 160,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 85,
    height: 150,
    top: "15%",
    alignSelf: "center",
    position: "absolute",
  },
});

export default OptionPage;
