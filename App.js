/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import call from "./src/screens/Call";
import profile from "./src/screens/Profile";
import Bookappointment from "./src/screens/Bookappointment";
import Menu from "./src/screens/Inpatient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Form from "./src/screens/Form";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app";
import { createDrawerNavigator } from "@react-navigation/drawer";
//const tab= createBottomTabNavigator();
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import Routes from "./navigation/Routes";
import Signup from "./src/screens/Signup";
import OptionPage from "./src/screens/OptionPage";
import Outpatient from "./src/screens/OutPatientDepartment";
import VideoLibrary from "./src/screens/VideoLibrary";
import MainNavigator from "./navigation/DrawerNavigation";
import Profile from "./src/screens/Profile";

//import CustomSidebarMenu from "./CustomSidebarMenu";
//  import HomeScreen from './src/screens/HomeScreen';
// import Menu from './src/screens/Inpatient';
// import Routes from './navigation/Routes';
/*function VideoLibraryStack() {
  return (
    <Stack.Navigator
      initialRouteName="VideoLibrary"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="VideoLibrary" component={VideoLibrary} />
    </Stack.Navigator>
  );
}*/
const Drawer = createDrawerNavigator();
function App() {
  const tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  return (
    // <View style={styles.container}>
    //   {/* <Routes/> */}
    //   {/* <HomeScreen/> */}
    //   {/* <Signup/> */}
    //   <Form/>
    // </View>

    <NavigationContainer>
      {/*<Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
        }}
        // For setting Custom Sidebar Menu
        drawerContent={props => <CustomSidebarMenu {...props} />}>
        <Drawer.Screen
          name="VideoLibraryStack"
          options={{
            drawerLabel: 'Video Library',
            title: 'Video Library',
            // Section/Group Name
            groupName: 'Gallery',
            activeTintColor: '#e91e63',
          }}
          component={VideoLibraryStack}
        />
      </Drawer.Navigator>*/}
      {/*<Drawer.Navigator useLegacyImplementation >
        <Drawer.Screen name="VideoLibrary" component={VideoLibrary} options={{ drawerLabel: 'Video Library' }}/>
    </Drawer.Navigator>*/}
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OptionPage"
          component={OptionPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Outpatient"
          component={Outpatient}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Form"
          component={Form}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoLibrary" component={VideoLibrary} options={{ headerShown: false }}/>
        <Stack.Screen
          name="Routes"
          component={Routes}
          options={{ headerShown: false }}
        />
  </Stack.Navigator>
  {/*<MainNavigator />*/}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default App;
