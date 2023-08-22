//import libraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Date,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {color} from 'react-native-reanimated';
import {Picker} from '@react-native-picker/picker';
import messaging from '@react-native-firebase/messaging';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

let docId = '';
// Creating new user account and setting up at firestore database.

const createUser = async (
  uid,
  name,
  number,
  diagnosis,
  branch,
  otherSurgery,
  surgeryDate,
) => {
  try {
    const userRef = firestore().collection('Users').doc();
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
    console.log('Doc id is: ', docId);
    console.log('User data added successfully!');
  } catch (error) {
    console.error('Error adding user data: ', error);
  }
};

// Async Storage Session creating
const storeUserSession = async (
  timeStamp,
  surgery,
  docId,
  uid,
  name,
  number,
  diagnosis,
  branchName,
  otherSurgery,
  surgeryDate,
) => {
  try {
    await AsyncStorage.setItem(
      'userSession',
      JSON.stringify({
        timeStamp,
        surgery,
        docId,
        uid,
        name,
        number,
        diagnosis,
        branchName,
        otherSurgery,
        surgeryDate,
      }),
    );
    console.log('User session stored successfully: ');
  } catch (error) {
    console.log('Error storing user session:', error);
  }
};

// Function to retrieve user session details
const getUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    if (userSession !== null) {
      return JSON.parse(userSession);
    } else {
      console.log('User session not found');
    }
  } catch (error) {
    console.log('Error retrieving user session:', error);
  }
};

let userObj = {
  patientPain: {painNumber: 1, timeStamp: 1},
  allergies: '',
  branchName: '',
  currentDay: 1,
  diagnosis: '',
  investigation: '',
  lastDayUpdated: 0,
  medicalHistory: '',
  medicines: '',
  name: '',
  surgery: '',
  surgicalHistory: '',
  timeStamp: 1,
  token: '',
  uidNo: '',
};

export default function Form() {
  // User Collection all states that needs to be pushed to firestore database.
  const [uid, setuid] = useState('');
  const [name, setname] = useState('');
  const [number, setnumber] = useState('');
  const [diagnosis, setdiagnosis] = useState('Piles');
  const [branch, setbranch] = useState('Baner');
  const [otherSurgery, setOtherSurgery] = useState(null);
  const [surgeryDate, setsurgeryDate] = useState('dd/mm/yyyy');
  const navigator = useNavigation();

  // The handleSubmit new firebase document of the new patient.
  const handleSubmit = async item => {
    // Function to create document in firebase
    const userCreate = async (
      uid,
      name,
      number,
      diagnosis,
      branch,
      otherSurgery,
      surgeryDate,
    ) => {
      try {
        const timeStamp = Math.floor(
          firestore.Timestamp.now().toMillis() / 1000,
        );
        const docRef = await firestore()
          .collection('Users')
          .doc(timeStamp.toString());

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) {
          alert('Something went wrong');
          return;
        }

        var token = await messaging().getToken();

        await docRef.set({
          timeStamp: timeStamp,
          name: name,
          branchName: branch,
          number: number,
          diagnosis: diagnosis,
          surgery: diagnosis,
          otherSurgery: otherSurgery,
          surgeryDate: surgeryDate,
          medicines: ['No Medicines'],
          medicinetime: [],
          medicinedays: [],
          investigation: 'NIL',
          surgeonName: 'NIL',
          token: token,
        });
        // Storing the user data in session only if the document is created in firebase.
        storeUserSession(
          timeStamp,
          diagnosis,
          docId,
          uid,
          name,
          number,
          diagnosis,
          branch,
          otherSurgery,
          surgeryDate,
        );
        console.log('Data Saved Successfully, TimeStamp: ', timeStamp);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    // Check to create document only if all the fields are filled, only Other Surgery is optional.
    if (uid && name && number && diagnosis && branch && surgeryDate) {
      await userCreate(
        uid,
        name,
        number,
        diagnosis,
        branch,
        otherSurgery,
        surgeryDate,
      );
      getUserSession().then(userSession => console.log(userSession));
      navigator.navigate('Routes');
    } else {
      Alert.alert('Please enter all the details above.');
    }
  };

 /* useEffect(() => {
    Orientation.lockToPortrait(); // Lock screen to portrait mode
    return () => {
      Orientation.unlockAllOrientations(); // Unlock screen orientation on component unmount
    };
  }, []);*/

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{width: 70, height: 100, marginTop: 15, alignSelf: 'center'}}
        />
        <Text style={styles.head}>Patient Details</Text>
        <View style={styles.inputbox}>
          <Text style={styles.inputhead}>UID </Text>
          <TextInput
            style={styles.input}
            value={uid}
            onChangeText={setuid}
            placeholder="Enter your text here"
          />
        </View>
        <View style={styles.inputbox}>
          <Text style={styles.inputhead}>Patient Name </Text>
          <TextInput style={styles.input} value={name} onChangeText={setname} />
        </View>
        <View style={styles.inputbox}>
          <Text style={styles.inputhead}>Contact Number </Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setnumber}
            keyboardType="number-pad"
          />
        </View>
        {/* diagnosis selection */}
        <View style={{marginTop: 15, width: '90%'}}>
          <Text
            style={{
              color: '#376858',
              fontFamily: 'PT Sans',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 15,
              left: 7,
            }}>
            Select diagnosis
          </Text>
          <View style={styles.dropbox}>
            {/* <Text style={{color: 'black',justifyContent:'center',top:"25%"}}>Select a value:</Text> */}

            <Picker
              selectedValue={diagnosis}
              onValueChange={(itemValue, itemIndex) => setdiagnosis(itemValue)}>
              <Picker.Item label="Select Diagnosis" value="" />
              <Picker.Item label="Piles" value="Piles" />
              <Picker.Item label="Fistula" value="Fistula" />
              <Picker.Item label="Circum" value="Circum" />
              <Picker.Item label="Sinus" value="Sinus" />
              <Picker.Item label="Fissure" value="Fissure" />
              <Picker.Item label="Varicose" value="Varicose" />
              <Picker.Item label="Hernia" value="Hernia" />
            </Picker>
            {/*<Text
              style={{
                color: 'black',
                position: 'absolute',
                top: '22%',
                left: '2%',
                fontSize: 15,
              }}>
              {' '}
              {diagnosis}
            </Text>*/}
          </View>
        </View>

        <View style={styles.inputbox}>
          <Text style={styles.inputhead}> Other Surgery (If any) </Text>
          <TextInput
            placeholder="Optional"
            placeholderTextColor={'black'}
            style={styles.input}
            value={otherSurgery}
            onChangeText={setOtherSurgery}
          />
        </View>

        <View style={{marginTop: 15, width: '90%'}}>
          <Text
            style={{
              color: '#376858',
              fontFamily: 'PT Sans',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 15,
              left: 7,
            }}>
            Select Date
          </Text>
          <View style={styles.dropbox}>
            {/* <Text style={{color: 'black',justifyContent:'center',top:"25%"}}>Select a value:</Text> */}

            <Text
              style={{
                color: 'black',
                position: 'absolute',
                top: '22%',
                left: '5%',
                fontSize: 15,
              }}>
              {' '}
              {surgeryDate}
            </Text>
          </View>
        </View>
        <Calendar
          style={styles.calender}
          maxDate={this.state.date}
          onDayPress={day => {
            // this.state.setState({ : day.dateString() })
            setsurgeryDate(day.dateString);
            //console.log(this.state.selected_date);
          }}
          markedDates={{
            [surgeryDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: '#84cbb4',
              selectedTextColor: 'black',
            },
          }}
        />

        <View style={{marginTop: 15, width: '90%'}}>
          <Text
            style={{
              color: '#376858',
              fontFamily: 'PT Sans',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 15,
              left: 7,
            }}>
            Select Branch
          </Text>
          <View style={styles.dropbox}>
            {/* <Text style={{color: 'black',justifyContent:'center',top:"25%"}}>Select a value:</Text> */}
            <Picker
              selectedValue={branch}
              onValueChange={(itemValue, itemIndex) => setbranch(itemValue)}>
              <Picker.Item label="Select Branch" value="" />

              <Picker.Item label="Andheri" value="Andheri" />
              <Picker.Item label="Baner" value="Baner" />
              <Picker.Item label="Chakan" value="Chakan" />
              <Picker.Item label="DP Road" value="DP Road" />
              <Picker.Item label="Hyderabad" value="Hyderabad" />
              <Picker.Item label="JP Nagar" value="JP Nagar" />
              <Picker.Item label="Jaipur" value="Jaipur" />
              <Picker.Item label="Kemps-Corner" value="Kemps-Corner" />
              <Picker.Item label="Kolhapur" value="Kolhapur" />
              <Picker.Item label="Kothrud" value="Kothrud" />
              <Picker.Item label="Latur" value="Latur" />
              <Picker.Item label="Ludhiana" value="Ludhiana" />
              <Picker.Item label="Nashik" value="Nashik" />
              <Picker.Item label="Navi-Mumbai" value="Navi-Mumbai" />
              <Picker.Item label="Pimpri-Chinchwad" value="Pimpri-Chinchwad" />
              <Picker.Item label="Sahakarnagar" value="Sahakarnagar" />
              <Picker.Item label="Salunkhe-Vihar" value="Salunkhe-Vihar" />
              <Picker.Item label="Surat" value="Surat" />
              <Picker.Item label="Thane" value="Thane" />
              <Picker.Item label="Tilak Road" value="Tilak Road" />
            </Picker>
            {/*<Text
              style={{
                color: 'black',
                position: 'absolute',
                top: '22%',
                left: '5%',
                fontSize: 15,
              }}>
              {' '}
              {branch}
            </Text>*/}
          </View>
        </View>
        <View style={styles.btnbox}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button4}>
            <Text style={{color: 'white', fontSize: 20}}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white',
    flex: 1,

    backgroundColor: 'white',
  },
  head: {
    marginTop: '10%',
    fontFamily: 'PT Sans',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 20,
    color: '#376858',
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'black',
  },
  inputbox: {
    marginTop: 15,
    width: '95%',
  },
  inputhead: {
    color: '#376858',
    fontFamily: 'PT Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 15,
    left: 5,
  },
  dropbox: {
    borderWidth: 1,
    height: 45,
    borderRadius: 10,
    width: '105%',
    borderColor: '#454545',
  },
  dateinput: {
    marginTop: 40,
    borderWidth: 1,
    width: '90%',
    height: 42,
    borderRadius: 10,
    paddingBottom: 5,
  },
  calender: {
    margin: 30,
    width: '80%',
    borderWidth: 1,
    borderColor: '#376858',
    shadowColor: 'red',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  btnbox: {
    width: '100%',
    height: 200,
  },
  button4: {
    alignItems: 'center',
    backgroundColor: '#478772',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 138,

    borderRadius: 20,
    height: 40,
    marginTop: 50,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
});

//make this component available to the app
