//import libraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';
import Call from '../src/screens/Call';
import MenuOption from '../src/screens/MenuOption';
import Profile from '../src/screens/Profile';
import Bookappointment from '../src/screens/Bookappointment';
import VideoLibrary from '../src/screens/VideoLibrary';
import Menu from '../src/screens/Inpatient';
import PhoneCall from '../src/screens/PhoneCall';
import { Svg, Circle} from 'react-native-svg';
import { Linking, Platform } from 'react-native';
import firestore  from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Example from '../src/screens/Example';
import Temp1 from '../src/screens/Temp1';

function Routes() {
  const navigator = useNavigation();

  const [callNumber, setCallNumber] = useState();
  // const callNumber = 0;

  const readData = async () => {
    var userData = await AsyncStorage.getItem('userSession');
     
    if (userData !== null) {
      userData = JSON.parse(userData);
      console.log('USER DATA: ', userData);
      var branch = userData.branchName;
      var temp = await firestore()
        .collection('BranchInformations')
        .doc(branch)
        .get();
      userData = temp.data();
      console.log('Dataaaa: ', userData);
      medicalPhoneNumber = userData.whatsAppFollowUpAppointment;
      console.log("NUMBER: ",medicalPhoneNumber);
      // callNumber = medicalPhoneNumber;
      setCallNumber(medicalPhoneNumber);
      // handlePhoneCall();  
    }
  
      return;
  }


  handlePhoneCall = () => {
    const phoneNumber = callNumber;
    const scheme = Platform.OS === 'android' ? 'tel:' : 'telprompt:';
    const phoneUrl = scheme + phoneNumber;
    // console.log('Medical Call: ', phoneUrl);
    if(callNumber){
      Linking.openURL(phoneUrl).catch(() => {
        navigation.navigate('Call');
      });

    }
    return;
}





useEffect(() => {
  readData();
}, [])

  const tab = createBottomTabNavigator();
  return (
    // <NavigationContainer>
      <tab.Navigator
        initialRouteName="Menu"

        screenOptions={{headerShown: false,
         
          tabBarStyle: {
            backgroundColor: '#DEF1EB', // set background color here
          },          
          selectedBackgroundColor: 'red'}}
        headerShown= {false}
       >
        <tab.Screen
          name="Menu"
          component={Example}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 400,
              color: 'black',
          },
            tabBarLabel: 'Home',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  style={{
                    height: 25,
                    width: 28,
                    marginBottom: -7,
                    tintColor: focused ? 'gold' : '#376858',
                  }}
                  source={require('../assets/images/home.png')}
                />
              );
            },
          }}
        />
        
        <tab.Screen
          name="Call"
          component={Call}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 400,
              color: 'black',
          },
            tabBarLabel: 'Medicine',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  style={{
                    height: 25,
                    width: 28,
                    marginBottom: -7,
                    tintColor: focused ? 'gold' : '#376858',
                  }}
                  source={require('../assets/images/medicines.png')}
                />
              );
            },
          }}
        />

        <tab.Screen
        
        name="PhoneCall"
        style={styles.call}
        component={PhoneCall}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 400,
            color: 'black',
        },
          tabBarLabel: 'Call Now',
          tabBarIcon: ({focused}) => {
            return (
            <Svg
            onPress={handlePhoneCall}
            alignItems='center' height="54" width="54">
            
            <Circle  cx="28" cy="28" r="28" fill="#DEF1EB" />
            <Image
            style={{
              width: 35,
              height: 32,
              top: 11,
              left: 12,
              marginBottom: -10,
            }}
            source={require('../assets/images/phone.png')}
          />
        
        </Svg>
              
            );
          },
        }}
      />



        <tab.Screen
          name="Book Appointment"
          component={Bookappointment}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 400,
              color: 'black',
          },
            tabBarLabel: 'Appointment',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  style={{
                    height: 25,
                    width: 28,
                    marginBottom: -7,
                    tintColor: focused ? 'gold' : '#376858',
                  }}
                  source={require('../assets/images/book.png')}
                />
              );
            },
          }}
        />
        <tab.Screen    
          name="VideoLibrary"
          component={VideoLibrary}
          // component={Profile}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 400,
              color: 'black',
          },
            tabBarLabel: 'Library',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  style={{
                    height: 25,
                    width: 28,
                    marginBottom: -7,
                    tintColor: focused ? 'gold' : '#376858',
                  }}
                  source={require('../assets/images/gallery.png')}
                />
              );
            },
          }}
        />


      </tab.Navigator>
    // </NavigationContainer>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DEF1EB0',
  },
  icon1: {
    height: 15,
    width: 20,
  },
  icon2: {
    height: 23,
    width: 22,
  },
  call: {
   position: 'absolute',
   width: 54,
   height: 54,
   borderRadius: '30',
   backgroundColor: '#DEF1EB'
  }
});

//make this component available to the app
export default Routes;
