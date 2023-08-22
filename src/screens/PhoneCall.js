//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Linking, Platform } from 'react-native';
import { useNavigation, useFocusEffect, useBackButton } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore  from '@react-native-firebase/firestore';

export default function PhoneCall (){
      return (
        <View>
          <Text style={{color:'black'}}>HELLO</Text>
        </View>
      );
}