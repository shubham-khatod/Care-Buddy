import React from "react";

import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from "react-native";

import Routes from './Routes';
import VideoLibrary from "../src/screens/VideoLibrary";
import StackNavigation from "./StackNavigation";
import { call } from "react-native-reanimated";
import Bookappointment from "../src/screens/Bookappointment";
import Profile from "../src/screens/Profile";
import Call from "../src/screens/Call";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {useCallback , useState, useEffect} from 'react';

{/*const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="VideoLibrary" component={VideoLibrary} />
      <Drawer.Screen name="Stack" component={StackNavigation} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;*/}



const Drawer = createDrawerNavigator();
const CustomDrawer = (props)=>{
  return <DrawerContentScrollView style={{padding:0}} {...props}>
          <View style={{margin:0, height:60, backgroundColor: '#376858', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: 600, color: 'white'}}>
            Welcome To Care Buddy
            </Text>
          </View>
          <View style={{marginTop:15}}>
          <DrawerItemList {...props}/>
          </View>
      
    </DrawerContentScrollView>
}
    

export default function MainNavigator() {

  return (
    <Drawer.Navigator screenOptions={{headerShown: true, headerStyle: {backgroundColor: 'white', elevation: 0, shadowOpacity: 0}, headerTitle:"" }} drawerContent={(props)=> <CustomDrawer {...props} />} >
        <Drawer.Screen name="Home" component={Routes} />
        {/*<Drawer.Screen name="Order Medicine" component={Call} options={{ drawerLabel: 'Order Medicine' ,  }}/>
        <Drawer.Screen name="Book Appointment" component={Bookappointment} options={{ drawerLabel: 'Book Appointment' }}/>
        
  <Drawer.Screen name="Profile" component={Profile} options={{ drawerLabel: 'User Profile' }}/>*/}
        <Drawer.Screen name="Video Library" component={VideoLibrary} />
      
    </Drawer.Navigator>
  )
}

 