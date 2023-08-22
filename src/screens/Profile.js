//import liraries
// import React, {Component, useEffect, useCallback, useState} from 'react';
import React, { Component, useEffect, useCallback, useState } from "react";

import Form from "./Form";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { useFocusEffect, useBackButton } from "@react-navigation/native";

import { ScrollView } from "react-native-gesture-handler";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import { doc, getDoc } from "@react-native-firebase/firestore";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
import ProfileHeader from "./ProfileHeader";

var patientPainData = [];
var painNumbers = [1, 6, 2, 5, 1, 2, 3];
var labels = [];

let userInfo = {};

export default function Profile() {
  const navigator = useNavigation();
  const [viewMode, setViewMode] = useState("Days");

  const [name, setName] = useState(null);
  const [branch, setBranch] = useState(null);
  const [number, setNumber] = useState(null);
  const [docId, setDocId] = useState(null);
  const [surgery, setSurgery] = useState();
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState();
  const [painArray, setPainArray] = useState([0, 0, 0, 0, 0, 0, 0]);

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
              setName(userInfo.name);
              //setBranch(userInfo.branchName);

              // setSurgery(userInfo.surgery);
              /*if (userInfo.surgicalType) {
                setSurgery(userInfo.surgicalType);
              } else {
                setSurgery(userInfo.surgery);
              }*/
              //setNumber(userInfo.number);
              //setDocId(userInfo.docId);
              //setNumber(userInfo.number);
              if (userInfo.painArray) {
                setPainArray(userInfo.painArray);

                for (let i = 0; i < userInfo.painArray.length; i++) {
                  painArray[i] = userInfo.painArray[i];
                }
                console.log(painArray);
              }

              labels = [...Array(painArray.length).keys()].map(
                (i) => `day${i + 1}`
              );
            }
          })
          .catch((error) => console.log(error));
        setLoading(false);
      }

      readData();
    }, [])
  );

  // Handling Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userSession");
      navigator.navigate("HomeScreen");
      console.log("User Logged Out Successfully...");
      setLoading(true);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const temp = async () => {
      setLoading(true);
      // Local Async Storage Data Fetching.
      await AsyncStorage.getItem("userSession")
        .then((data) => {
          if (data) {
            userInfo = JSON.parse(data);
            console.log("Data of AsyncStorage: useEffect ", userInfo);
            // Setting user data in the local states.
            setName(userInfo.name);
            userInfo.surgeryDate
              ? setTimeStamp(
                  new Date(userData.surgeryDate).toLocaleDateString("en-GB")
                )
              : setTimeStamp(
                  new Date(userInfo.timeStamp * 1000).toLocaleDateString(
                    "en-GB"
                  )
                );
            //setBranch(userInfo.branchName);
            /*if (userInfo.surgicalType) {
              setSurgery(userInfo.surgicalType);
            } else {
              setSurgery(userInfo.surgery);
            }*/
            //setNumber(userInfo.number);
            //setDocId(userInfo.docId);
            //setNumber(userInfo.number);
            if (userInfo.painArray) {
              setPainArray(userInfo.painArray);

              for (let i = 0; i < userInfo.painArray.length; i++) {
                painArray[i] = userInfo.painArray[i];
              }
              console.log(painArray);
            }
          }
        })
        .catch((error) => console.log(error));
      setLoading(false);
    };

    temp();
    // getChartDetails();
    // readData();
  }, []);

  const getChartData = () => {
    switch (viewMode) {
      case "Days":
        // Display chart for last 7 days
        const lastWeekData = painArray.slice(-7);
        var labelLength = 0;
        if (painArray.length >= 7) labelLength = 7;
        else labelLength = painArray.length;
        return {
          labels: [...Array(labelLength).keys()].map((i) => `day${i + 1}`),
          datasets: [
            {
              data: lastWeekData,
              color: (opacity = 1) => `rgba(55, 104, 88, ${opacity})`,
              strokeWidth: 2,
              bezier: true,
            },
          ],
        };

      case "Week":
        const currentMonthData = painArray.slice(-28);
        const currentMonthDataLength = Math.min(currentMonthData.length, 28);
        const weekLabels = ["Week1", "Week2", "Week3", "Week4"];
        const weekValues = [0, 0, 0, 0];

        for (let i = 0; i < currentMonthDataLength; i++) {
          const weekIndex = Math.floor(i / 7);
          weekValues[weekIndex] += currentMonthData[i];
        }

        for (let i = 0; i < weekValues.length; i++) {
          weekValues[i] = weekValues[i] / 7;
        }

        return {
          labels: weekLabels,
          datasets: [
            {
              data: weekValues,
              color: (opacity = 1) => `rgba(55, 104, 88, ${opacity})`,
              strokeWidth: 2,
              bezier: true,
            },
          ],
        };

      case "Month":
        const monthsData = [];
        const currentMonthIndex = new Date().getMonth();
        for (let i = 0; i < 12; i++) {
          const monthData = painArray
            .slice(i * 30, i * 30 + 30)
            .filter((value) => !Number.isNaN(value));
          const monthAverage =
            monthData.length > 0
              ? monthData.reduce((acc, curr) => acc + curr, 0) /
                monthData.length
              : 0;
          monthsData.push(monthAverage || 0);
        }
        const monthLabels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
          .slice(currentMonthIndex)
          .concat(
            [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].slice(0, currentMonthIndex)
          );

        return {
          labels: monthLabels,
          datasets: [
            {
              data: monthsData,
              color: (opacity = 1) => `rgba(55, 104, 88, ${opacity})`,
              strokeWidth: 2,
              bezier: true,
            },
          ],
        };

      default:
        return null;
    }
  };

  const renderButtons = () => {
    const buttons = [
      { label: "Days", value: "Days" },
      { label: "Week", value: "Week" },
      { label: "Month", value: "Month" },
    ];
    return buttons.map((button) => (
      <TouchableOpacity
        key={button.value}
        style={{
          elevation: 5,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: viewMode === button.value ? "#478772" : "#F2F2F2",
          borderRadius: 5,
          marginHorizontal: 4,
          color: "black",
        }}
        onPress={() => setViewMode(button.value)}
      >
        <Text
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            color: viewMode === button.value ? "#FFFFFF" : "#484747",
          }}
        >
          {button.label}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*<View style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        height: 60,
        //backgroundColor:'gray',
        padding:10,
        backgroundColor: 'white'
      }}>
        <View style={{ height: 50, width:50, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={HandleRouteNavigation}>
        <Image
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: '#376858',
                  }}
                  source={require('../../assets/images/back.png')}
                />
        
        </TouchableOpacity>
        
        </View>
        <View style={{ height: 50, width:50, alignItems: 'center'}}>
        <Image
                  style={{
                    height: 50,
                    width: 35,
                    padding:0,
                    
                  }}
                  source={require('../../assets/images/grayLogo.png')}
                />
        </View>
                </View>*/}
      <ProfileHeader />
      <ScrollView>
        <View style={styles.container1}>
          <Text style={styles.titletxt}>Patient Name</Text>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>{name}</Text>
          </View>
          <Text style={styles.titletxt}>Date of Surgery</Text>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>{timeStamp}</Text>
          </View>
        </View>
        {/*<View
          style={{
            flex: 1,
            alignItems: "center",
            fontFamily: "PTSans-Regular",
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 46, height: 66 }}
        />
          <Image
            source={require("../../assets/images/profile.png")}
            style={{ width: 61, height: 61, marginTop: 15 }}
          />
        </View>

        <Text
          style={{
            color: "black",
            alignSelf: "center",
            marginTop: 12,
            marginBottom: 25,
          }}
        >
          {name}
        </Text>*/}

        {loading ? (
          <ActivityIndicator
            style={styles.indicator}
            color="#1b6844"
            size="large"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              width: "100%",
              borderRadius: 5,
            }}
          >
            <ScrollView horizontal style={{ width: "100%" }}>
              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Text style={styles.titletxt}>Your Pain-Scale Chart</Text>
                <LineChart
                  style={{
                    marginVertical: 8,
                    // borderWidth:1,
                    right: "5%",
                    borderRadius: 16,
                  }}
                  data={getChartData()}
                  yAxisInterval={1}
                  width={Dimensions.get("window").width}
                  height={240}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    gridColor: null,
                    barRadius: 16,
                    paddingRight: 100,
                    decimalPlaces: 0,

                    // color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    color: (opacity = 1) => `rgba(55, 104, 88, ${opacity})`,

                    // labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "3",
                      strokeWidth: "4",
                      stroke: "#478772",
                    },
                    propsForLabels: {
                      fontSize: "13",
                    },
                  }}
                  bezier
                />
              </View>
            </ScrollView>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {renderButtons()}
            </View>
          </View>
        )}
        {/* Line Chart Display */}

        <View style={styles.container1}>
          {/*<View style={styles.box} elevation={5}>
            <Text style={styles.txt}>{name}</Text>
          </View>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>
              {number ? number : "No Phone Record"}
            </Text>
          </View>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>Surgeon Name</Text>
          </View>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>{surgery}</Text>
          </View>
          <View style={styles.box} elevation={5}>
            <Text style={styles.txt}>{branch}</Text>
            </View>*/}
          <TouchableOpacity style={styles.box1} onPress={handleLogout}>
            <Text style={styles.txt1}>{loading ? "Loading..." : "Logout"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  graph: {
    marginTop: 40,
  },
  container1: {
    marginTop: 30,

    height: 170,
    alignItems: "center",
  },
  box: {
    // borderBottomWidth:0.4,
    width: "90%",
    marginTop: 5,
    marginBottom: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 15,
    backgroundColor: "#F2F2F2",
  },
  box1: {
    // borderBottomWidth:0.4,
    width: "40%",
    marginTop: 30,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 15,
    backgroundColor: "gold",
  },
  txt: {
    color: "black",
    fontFamily: "inter",
    fontWeight: 500,
    fontSize: 18,
  },
  titletxt: {
    color: "gray",
    fontFamily: "inter",
    fontWeight: 400,
    fontSize: 16,
  },
  txt1: {
    color: "black",
    fontFamily: "inter",
    fontWeight: 400,
    fontSize: 20,
  },
});
