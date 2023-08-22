//import liraries
import React, { Component, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  date,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Markings } from "react-native-calendars/src/calendar/day/marking";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Orientation from "react-native-orientation-locker";
import { ScrollView } from "react-native-gesture-handler";
import { SuccessModal } from "../../Components/SuccessModal";
import { useFocusEffect, useBackButton } from "@react-navigation/native";
import Header from "./Header";

// Getting Height and Width of the Device.
const { height, width } = Dimensions.get("window");

state = {
  date: moment().format("YYYY-MM-DD"),
  selected_date: null,
};
let dates, slots;

// Bookappointment Component
export default function Bookappointment({}) {
  const [state, setState] = useState("dddd-mm-yy");
  const [pressed, setpressed] = useState(false);
  const [date1, setselecteddate] = useState(new Date());
  const [preBookedDate, setPreBookedDate] = useState();
  const [loading, setLoading] = useState(false);
  const [preBookedSlot, setPreBookedSlot] = useState();
  // let preBookedSlot = '';
  const [slot, setSlot] = useState();
  const [modalSubmit, setModalSubmit] = useState(false);

  const buttons = ["Morning", "Afternoon", "Evening"];

  // const markedDates = {
  //   [predefinedDate]: { selected: true, marked: true, selectedColor: 'blue' }
  // };

  /* const temp = async () => {
    setLoading(true);
    // Local Async Storage Data Fetching.
    await AsyncStorage.getItem('userSession')
      .then(data => {
        if (data) {
          userInfo = JSON.parse(data);
          console.log('Data of AsyncStorage: ', userInfo);
          // Setting user data in the local states.

          if (userInfo.appointmentDate && userInfo.appointmentSlot) {
            setPreBookedDate(userInfo.appointmentDate);
            setPreBookedSlot(userInfo.appointmentSlot);
            // preBookedSlot = userInfo.appointmentSlot;
            console.log('Slot: ', preBookedSlot);
            console.log('Appointment Date: ', preBookedDate);
          }
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  };*/

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Success Modal Functions
  const handleSuccessSubmit = () => {
    // Submit form logic goes here
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    setPreBookedDate(dates);
    setPreBookedSlot(slots);
  };

  const handleBookAppointment = async () => {
    console.log("Book Appointment called!");

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

      if (userData.bookAppointment && userData.bookAppointment.length == 0) {
        userData.appointmentDate = date1;
        userData.appointmentSlot = slot ? slot : "Morning";
      } else {
        userData.appointmentDate = "";
        userData.appointmentSlot = "";

        userData.appointmentDate = date1;
        userData.appointmentSlot = slot ? slot : "Morning";;
      }

      // Updating the userData, specifically patientPain in the firebase.
      await firestore()
        .doc("Users/" + temp.id)
        .update(userData);
      handleSuccessSubmit();
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      //console.log(userData.appointmentDate);
      //console.log(userData.appointmentSlot);
      dates=userData.appointmentDate;
      slots=userData.appointmentSlot;
      return;
    }
  };

  const onpressHandler = () => {
    setpressed(!pressed);
    console.log(pressed);
  };
  const printButton = () => {
    console.log(date1);
    console.log("hiii");
  };

  const [clickedId, setClickedId] = useState(1);
  const handleClick = (item, id, label) => {
    setClickedId(id);
    setSlot(label);
    // console.log('Slot: ', label);
    doSomethingAfterClick(item, id, label);
    console.log(clickedId);
  };

  const doSomethingAfterClick = (iteml, id, label) => {
    console.log("Slot here: ", label);
  };

  useFocusEffect(
    useCallback(() => {
      async function readData() {
        setLoading(true);
        // Local Async Storage Data Fetching.
        await AsyncStorage.getItem("userSession")
          .then((data) => {
            if (data) {
              userInfo = JSON.parse(data);
              console.log("Data of AsyncStorage: ", userInfo);
              // Setting user data in the local states.

              if (userInfo.appointmentDate && userInfo.appointmentSlot) {

                if(userInfo.appointmentDate < moment().format("YYYY-MM-DD"))
                {
                  setPreBookedDate("");
                  setPreBookedSlot("");
                  console.log("PreBooked Date: ", userInfo.appointmentDate );
                }
                else{
                  setPreBookedDate(userInfo.appointmentDate);
                  console.log("PreBooked Date: ", userInfo.appointmentDate );
                  setPreBookedSlot(userInfo.appointmentSlot);
                }
                  
               
                
                // preBookedSlot = userInfo.appointmentSlot;
                console.log("Slot: ", preBookedSlot);
                console.log("Appointment Date: ", preBookedDate);
              }
            }
          })
          .catch((error) => console.log(error));
        setLoading(false);
      }

      readData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Book Appointment'}/>
      <ScrollView>
        {/* LOGO */}
        {/*<Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 46, height: 66, alignSelf: "center" , marginTop:15}}
  />*/}
        <Text style={styles.head}>Book Appointment</Text>
        {preBookedDate ? (
          <Text style={styles.subhead}>
            Appointment already booked :{" "}
            <Text style={styles.highlightedSubHead}> {preBookedDate} </Text>{" "}
          </Text>
        ) : (
          <Text style={styles.subhead}>Select Date For Appointment</Text>
        )}

        {/* Calender Display Code */}
        {preBookedDate ? (
          <Calendar
            style={styles.calender}
            minDate={this.state.date}
            onDayPress={(day) => {
              setselecteddate(day.dateString);
            }}
            markedDates={{
              [preBookedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "orange",
                selectedTextColor: "black",
              },
            }}
          />
        ) : (
          <Calendar
            style={styles.calender}
            minDate={this.state.date}
            onDayPress={(day) => {
              setselecteddate(day.dateString);
            }}
            markedDates={{
              [date1]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "#84cbb4",
                selectedTextColor: "black",
              },
            }}
          />
        )}

        {preBookedSlot ? (
          <View style={{ flex: 1 }}>
            <View style={styles.slots}>
              <Text
                style={{
                  fontFamily: "PT Sans",
                  fontSize: 15,
                  color: "#000000",
                  fontWeight: 700,
                }}
              >
                Appointment Slot :{" "}
                <Text style={styles.highlightedSubHead}> {preBookedSlot} </Text>
              </Text>
            </View>

            <View style={styles.slots}>
              <Text
                style={{
                  fontFamily: "PT Sans",
                  fontSize: 15,
                  color: "#376858",
                  fontWeight: 700,
                }}
              >
                Want to Change Appointment ? Click on Call Icon!
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.slots}>
              <Text
                style={{
                  fontFamily: "PT Sans",
                  fontSize: 15,
                  color: "#000000",
                  fontWeight: 700,
                }}
              >
                SLOTS
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={(item) => handleClick(item, 1, "Morning")}
                key={1}
                style={[1 === clickedId ? styles.buttonActive : styles.button]}
              >
                <Text style={1 === clickedId ? styles.textActive : styles.text}>
                  Morning
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(item) => handleClick(item, 2, "Afternoon")}
                key={2}
                style={[2 === clickedId ? styles.buttonActive : styles.button]}
              >
                <Text style={2 === clickedId ? styles.textActive : styles.text}>
                  Afternoon
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(item) => handleClick(item, 3, "Evening")}
                key={3}
                style={[3 === clickedId ? styles.buttonActive : styles.button]}
              >
                <Text style={3 === clickedId ? styles.textActive : styles.text}>
                  Evening
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleBookAppointment}
              style={styles.button4}
            >
              <Text style={{ color: "black", fontSize: 22, fontWeight: 'bold' }}>Book</Text>
            </TouchableOpacity>

            <View>
              <SuccessModal
                visible={isSuccessModalVisible}
                onClose={handleCloseSuccessModal}
                massage1={"Thank You..!"}
                massage2={"Your Appointment Booked Successfully."}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Book Appointment Screen Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  head: {
    fontFamily: "PT Sans",
    color: "#000000",
    lineHeight: 29.76,
    alignSelf: "center",
    marginTop: 15,
    fontWeight: "medium",

    // fontWeight: 300,
    fontSize: 23,
  },
  subhead: {
    color: "#000000",
    alignSelf: "center",
    marginTop: 25,
    fontWeight: 700,
    fontSize: 15,
  },
  highlightedSubHead: {
    color: "#376858",
    alignSelf: "center",
    marginTop: "5%",
    fontWeight: 700,
    fontSize: 15,
  },
  calender: {
    // alignSelf:'center',
    margin: 30,
    borderWidth: 1,
    borderColor: "#376858",
    shadowColor: "red",
    shadowOpacity: 0.9,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  slt: {
    color: "black",

    fontWeight: 700,
    fontSize: 15,
    alignSelf: "center",
    //borderWidth: 13,
  },
  btnbox: {
    flexDirection: "row",
  },
  button4: {
    alignItems: "center",
    backgroundColor: "gold", //"#478772",
    justifyContent: "center",
    alignSelf: "center",
    // width:138,
    width: width * 0.35,
    borderRadius: 20,
    height: 40,
    marginTop: 50,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 50,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DEDEDE63",
    justifyContent: "center",
    // width:100,
    width: width * 0.28,
    borderRadius: 20,
    height: 35,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
  slots: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  buttonActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DEF1EB",
    justifyContent: "center",
    width: 100,
    borderRadius: 20,
    height: 35,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
  bookedButtonActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
    justifyContent: "center",
    width: 100,
    borderRadius: 20,
    height: 35,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
  bookedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
    justifyContent: "center",
    width: 100,
    borderRadius: 20,
    height: 35,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
  text: {
    color: "black",
  },
  textActive: {
    color: "black",
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
