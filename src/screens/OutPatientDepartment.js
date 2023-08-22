import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const Outpatient = () => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  async function onSubmit(qr) {
    setLoading(true);
    try {
      JSON.parse(qr.data);
    } catch (e) {
      alert('Not valid QR code');
      setLoading(false);
      return;
    }
    var userData = JSON.parse(qr.data);
    if (userData.name == '' || userData.medicalhistory == '') {
      alert('Not valid QR code');
      setLoading(false);
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
      alert('Something went wrong');
      return;
    }
    userData.token = await messaging().getToken();
    var temp = await firestore()
      .collection('Users')
      .doc(JSON.stringify(userData.timeStamp))
      .get();
    if (temp.data()) {
      await firestore()
        .doc('Users/' + temp.id)
        .update(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      navigation.navigate({name: 'PainAssessmentScreen'});
      setLoading(false);
      console.log('user added');
      return;
    } else {
      await firestore()
        .collection('Users')
        .doc(userData.timeStamp.toString())
        .set(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      navigation.navigate({name: 'PainAssessmentScreen'});
      setLoading(false);
      console.log('user added');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Out Patient Department</Text>
      <View style={styles.innerContainer}>
        {loading ? (
          <ActivityIndicator
            style={styles.indicator}
            color="#1b6844"
            size="large"
          />
        ) : (
          <QRCodeScanner
            onRead={onSubmit}
            style={styles.box}
            flashMode={RNCamera.Constants.FlashMode.auto}
            cameraStyle={styles.camera}
            containerStyle={styles.cameraCont}
            showMarker={true}
            checkAndroid6Permissions={true}
            permissionDialogMessage="Allows PainScore to scan QR codes."
            permissionDialogTitle="PainScore"
            reactivate={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Outpatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
   // backgroundColor: '#1b6844',
  },
  box:{
    width:100,
    height:100
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderRadius: 30,
    padding: 30,
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginTop: 60,
  },
  label: {
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingLeft: 5,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '700',
    fontSize: 24,
    color: '#000',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
  buttonTouchable: {
    top: 20,
    padding: 16,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    alignSelf: 'stretch',
  },
  camera: {
    //height:300,
    width: 300,
    //position:"absolute",
  },
  cameraCont: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
    //backgroundColor:'#FFFFFF'
  },
  textCont: {
    flex: 1,
    fontSize: 18,
    padding: 35,
    color: '#777',
    textAlign: 'center',
    alignContent: 'center',
  },
  secondTxt: {
    textAlign: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
