//import liraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Dimensions} from 'react-native';
import Header from "./Header";
import React, { Component, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { SuccessModal } from "../../Components/SuccessModal";
import Mailer from "react-native-mail";
import firebase from "@react-native-firebase/app";
import Orientation from "react-native-orientation-locker";
import firestore from "@react-native-firebase/firestore";
import { Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
import { ButtonGroup } from "../../Components/ButtonGroup";
// create a component
/*const MyButton = ({ index, isPressed, onPress, txt1, txt2, txt3 }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isPressed ? "#DEF1EB" : "#F2F2F2" },
      ]}
      onPress={() => onPress(index)}
    >
      <Image
        source={require("../../assets/images/Tickcircle.png")}
        style={styles.tickcircle}
      />
      {isPressed && (
        <Image
          source={require("../../assets/images/Tick.png")}
          style={styles.tick}
        />
      )}
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text style={styles.text1}>{txt1}</Text>
        <Text style={{ right: 15, top: 5, color: "black" }}>{txt3}</Text>
      </View>
     
      <View
        style={{
          flex: 1,
          // width: 240,
          // heigh: 30,
          position: "absolute",
          paddingBottom: 50,
          top: 28,
          left: 50,
        }}
      >
        <Text style={styles.text2}>{txt2}</Text>
      </View>
    </TouchableOpacity>
  );
};*/

export default function Call({ navigator }) {
  // state={
  //     selectedButton: '',
  // };
  const [pressedButtons, setPressedButtons] = useState([]);

  const selectedMedicines = [];
  var medObject = {};
  var tp = { 0: "Med1", 1: "Med2" };
  const [timeStamp, setTimeStamp] = useState();
  const [name, setName] = useState();
  const [med, setMed] = useState([]);
  const [medTime, setMedTime] = useState([]);
  const [medDays, setMedDays] = useState([]);
  const [medAlphabets, setMedAlphabets] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]);

  const [isMedicineAvailable, setIsMedicineAvailable] = useState(true);
  const [callLoading, setCallLoading] = useState(false);
  const [callNumber, setCallNumber] = useState();

  const [branch, setBranch] = useState("");
  const [template, setTemplate] = useState([]);
  const [isPress, setIsPress] = useState(false);
  const [clickedindex, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [asssitantDoctor, setAsssitantDoctor] = useState("");
  const [textforFollowUpAppointment, setTextforFollowUpAppointment] =
    useState("");
  const [textforOrderMedcine, setTextforOrderMedcine] = useState("");
  const [whatsAppNumberOrederMed, setWhatsAppNumberOrederMed] = useState("");

  const [searchText, setSearchText] = useState("");
  const itemList = [
    { id: 1, name: "ACIDEEM", quantity: 0 },
    { id: 2, name: "Anoac Cream", quantity: 0 },
    { id: 3, name: "ANOAC H", quantity: 0 },
    { id: 4, name: "Anospray", quantity: 0 },
    { id: 5, name: "ANTACID", quantity: 0 },
    { id: 6, name: "APTIVATE SYRUP", quantity: 0 },
    { id: 7, name: "Augmentin 625mg", quantity: 0 },
    { id: 8, name: "BETADINE SOLUTION", quantity: 0 },
    { id: 9, name: "Carefree Sanitary Pads", quantity: 0 },
    { id: 10, name: "Constac Plus Powder", quantity: 0 },
    { id: 11, name: "Constac Powder", quantity: 0 },
    { id: 12, name: "Constalax Powder", quantity: 0 },
    { id: 13, name: "Constc Plus Powder", quantity: 0 },
    { id: 14, name: "Constlax Tablets", quantity: 0 },
    { id: 15, name: "CREMAFFIN SYP", quantity: 0 },
    { id: 16, name: "Daflon 1000mg", quantity: 0 },
    { id: 17, name: "Daflon-500mg", quantity: 0 },
    { id: 18, name: "DUPHALAC 20ML", quantity: 0 },
    { id: 19, name: "ENZOFLAM", quantity: 0 },
    { id: 20, name: "Gut-Renew Capsules", quantity: 0 },
    { id: 21, name: "Gutwin 400mg Tablet", quantity: 0 },
    { id: 22, name: "KIWI BIOTIC", quantity: 0 },
    { id: 23, name: "LEVOFLOX 500MG", quantity: 0 },
    { id: 24, name: "Nupatch", quantity: 0 },
    { id: 25, name: "Oflin O Tablet", quantity: 0 },
    { id: 26, name: "PAN 40", quantity: 0 },
    { id: 27, name: "PAN D", quantity: 0 },
    { id: 28, name: "Phytorelief-CC", quantity: 0 },
    { id: 29, name: "Subneuro B12", quantity: 0 },
    { id: 30, name: "Subneuro-B6 Tablet", quantity: 0 },
    { id: 31, name: "Turmocin Cream", quantity: 0 },
    { id: 32, name: "TURMOCIN PLUS", quantity: 0 },
    { id: 33, name: "Turmocin Tab", quantity: 0 },
    { id: 34, name: "ULTRACET", quantity: 0 },
    { id: 35, name: "VOVERAN SR 100MG", quantity: 0 },
    { id: 36, name: "VOVERAN SR 75MG", quantity: 0 }, 
    //Add items as needed
  ];
  const [products, setProducts] = useState(itemList);
  const [cartItems, setCartItems] = useState([]);
  const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

  const handleAddToCart = () => {
    const selectedItems = products.filter((product) => product.quantity > 0);
    //setCartItems(selectedItems);
    console.log("Items added to cart:", selectedItems);
    //setMed((prev)=> selectedItems);
    //console.log(med);
    handleOrder(selectedItems);
    // Add your logic to handle adding items to the cart
  };

  const handleAddQuantity = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleRemoveQuantity = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId && product.quantity > 0
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleRemoveQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleAddQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePress = (index) => {
    const newPressedButtons = [...pressedButtons];
    newPressedButtons[index] = !newPressedButtons[index];
    setPressedButtons(newPressedButtons);
  };
  const printButton = () => {
    console.log("hiii");
  };

  let oneTimePressed = 1;
  let oneTimeFirestore = 0;

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleSuccessSubmit = () => {
    // Submit form logic goes here
    setIsSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    setProducts(itemList);
  };

  async function getTemplate() {
    var user = await AsyncStorage.getItem("userSession")
      .then((data) => {
        if (data) {
          userInfo = JSON.parse(data);
          // console.log("Data of AsyncStorage: ", userInfo);

          setName(userInfo.name);
          setTimeStamp(userInfo.timeStamp);
          setBranch(userInfo.branchName);
          // setMed(userInfo.medicines);
          // console.log("Medicines: ", med);
          setPressedButtons(med.map(() => false));
          // console.log('Branch is: ', branch);
          // console.log('TimeStamp is ', timeStamp);
          // console.log('Name is ', name);
        }
      })
      .catch((error) => console.log(error));
    console.log(pressedButtons);
  }

  const [isButtonPressed, setIsButtonPressed] = useState(true);

  var medicalPhoneNumber = "";

  const readMedicines = async () => {
    var userData = await AsyncStorage.getItem("userSession");

    if (userData !== null) {
      userData = JSON.parse(userData);

      // console.log('USER DATA: ', userData);
      var branch = userData.branchName;
      var temp = await firestore()
        .collection("Users")
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();

      // console.log('Dataaaa: ', userData);
      setMed(userData.medicines);
      setMedTime(userData.medicinetime);
      setMedDays(userData.medicinedays);

      if (userData.medicines[0] == "No Medicines") {
        // Alert.alert('No Medicine found.');
        setIsMedicineAvailable(false);
        setMed([]);
        setMedTime([]);
        setMedDays([]);
      }
      console.log("Med: ", med);
    }
    return;
  };

  const readData = async () => {
    setCallLoading(true);
    var userData = await AsyncStorage.getItem("userSession");

    if (userData !== null) {
      userData = JSON.parse(userData);
      var branch = userData.branchName;
      var temp = await firestore()
        .collection("BranchInformations")
        .doc(branch)
        .get();
      userData = temp.data();
      // console.log('Dataaaa: ', userData);
      setCallNumber(userData.whatsAppFollowUpAppointment);
      // medicalPhoneNumber = userData.whatsAppFollowUpAppointment;
      console.log(callNumber);
    }
    setCallLoading(false);
    return;
  };

  var count = 0;
  // This useEffect is used to fetch readMedicines and readData of medical only once.
  useEffect(() => {
    Orientation.lockToPortrait(); // Lock screen to portrait mode
    
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  
    //readMedicines();
    readData();
  }, []);

  // This useEffect is used to update the selected medicines continuously based on selection and de-selection.
  useEffect(() => {
    if (pressedButtons && isButtonPressed) {
      getTemplate();
      setIsButtonPressed(false);
    }

    console.log(pressedButtons);
  }, [pressedButtons]);

  // Sending email to pain score.
  const fetchMedicines = () => {};

  function onClick(loadingflag) {
    setLoading(loadingflag);
    setIsPress(!isPress);
  }

  const handleOrder = async (items) => {
    var orderedMedicines = items;
    console.log("Ordered Medicines are: ", orderedMedicines);

    var userData = await AsyncStorage.getItem("userSession");

    // If the userData is not empty, then only move for the further firebase functionality.
    if (userData !== null) {
      userData = JSON.parse(userData);
      userData.orderedMedicines =orderedMedicines;
      console.log("User Data is updated",userData);
      
      var temp = await firestore()
        .collection("Users")
        .doc(userData.timeStamp.toString())
        .get();
      userData = temp.data();

      // If the patientPain array is empty, then initiate it with first new map having two values painNumber and timeStamp.
      if (userData.orderedMedicines && userData.orderedMedicines.length > 0) {
        userData.orderedMedicines = orderedMedicines;
      }
      // // Else, Update the patientPain array with by appending new map.
      else {
        userData.orderedMedicines = [];
        userData.orderedMedicines = orderedMedicines;
      }

      // Update the "orderedMedicines" field in the document using the new object
      await firestore()
        .doc("Users/" + temp.id)
        .update(userData);

      // Merge the updated "orderedMedicines" field into the userData object
      // userData.orderedMedicines = orderedMedicines;

      await AsyncStorage.setItem("userSession", JSON.stringify(userData));
      handleSuccessSubmit();
      return;
    }

    handleSuccessSubmit();
  };

  handlePhoneCall = () => {
    const phoneNumber = callNumber;
    const scheme = Platform.OS === "android" ? "tel:" : "telprompt:";
    const phoneUrl = scheme + phoneNumber;
    console.log("Medical Call: ", phoneUrl);
    Linking.openURL(phoneUrl).catch(() => {
      navigation.navigate("Call");
    });
    return;
  };

  const [selectedButton, setState] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Order Medicines'}/>
      {loading ? (
        <ActivityIndicator
          style={styles.indicator}
          color="#1b6844"
          size="large"
        />
      ) : (
      
          <View>
            {/*<View
              style={{
                
                alignItems: "center",
                justifyContent: 'center',
                fontFamily: "PTSans-Regular",
                
              }}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 46, height: 66 }}
              />
            </View>*/}
            <View style={{ height: windowHeight * 0.7, width: windowWidth* 0.85, marginTop: 20 }}>
            <SafeAreaView style={{flex: 1}}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  value={searchText}
                  onChangeText={handleSearchTextChange}
                />
              </View>
            
              
              <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.productList}
              />
              </SafeAreaView>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addToCartButtonText}>Place Order</Text>
              </TouchableOpacity>
          

            {/* <Text style={styles.head}>Your Medicine</Text>
          {// Medicines Rendering Code }
          <View style={styles.container1}>
            {med &&
              Object.keys(med).map((key, index) => (
                <MyButton
                  key={parseInt(key)}
                  index={index}
                  isPressed={pressedButtons[index]}
                  onPress={() => handlePress(index)}
                  txt1={`${medAlphabets[parseInt(key)]}] ${med[parseInt(key)]}`}
                  // txt2={'After Breakfast ....After Dinner'}
                  txt2={`${medTime[parseInt(key)]}`}
                  txt3={`${medDays[parseInt(key)]}`}
                />
              ))}
          </View>

          {// Order Now and Calling Code }
          <View style={styles.container2}>
            {// IF Medicines are available, show medicines, ELSE, show NO Medicines Available.}
            {isMedicineAvailable ? (
              <TouchableOpacity onPress={handleOrder} style={styles.button4}>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "PT Sans",
                    fontSize: 15,
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  Order Now
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  backgroundColor: "#DBEFEA",
                  borderRadius: 10,
                  width: "90%",
                  height: "30%",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 25,
                    color: "#2D5A4C",
                    fontWeight: 700,
                  }}
                >
                  No Medicines Available
                </Text>
              </View>
            )}{" "}
          */}
            <View>
              <SuccessModal
                visible={isSuccessModalVisible}
                onClose={handleCloseSuccessModal}
                massage1={"Your order placed successfully!"}
                massage2={"Our pharmacist will call you shortly.."}
              />
            </View>
            {callLoading ? (
              <ActivityIndicator
                style={styles.indicator}
                color="#1b6844"
                size="large"
              />
            ) : (
              
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  
                  
                }}
              >
                <TouchableOpacity onPress={handlePhoneCall}>
                  <Image
                    source={require("../../assets/images/callcircle.png")}
                    style={{ width: 65, height: 65 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    color: "#000000",
                    fontSize: 10,
                    fontWeight: 300,
                  }}
                >
                  {" "}
                  You Can Also Call For Other Medicine
                </Text>
              </View>
              
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  head: {
    color: "#000000",
    alignSelf: "center",
    marginTop: "5%",
    fontWeight: 400,
    lineHeight: 29.76,
    fontSize: 23,
  },
  // text:{
  //     color:'black',
  //     fontSize:20,
  //     position:'absolute'
  // },
  container1: {
    // borderWidth:1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 316,
    marginTop: 20,
  },
  button: {
    padding: 5,
    borderRadius: 15,
    margin: 10,
    width: "100%",
    height: 43,
  },
  text1: {
    color: "#000000",
    fontFamily: "Inter",
    fontWeight: "300",
    fontSize: 13,
    textAlign: "center",
    left: 55,
    top: "0%",
    position: "absolute",
  },
  text2: {
    fontFamily: "Inter",
    color: "#535353",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 10,
    left: 10,

    //position:'absolute',
  },
  tickcircle: {
    height: 43,
    width: 37,
    borderWidth: 1,
    borderColor: "#376858",
    borderRadius: 40,
    position: "absolute",
  },
  tick: {
    left: 9,
    height: 14.98,
    width: 21.04,
    top: "54%",
    position: "absolute",
    // backgroundColor:'black'
  },
  container2: {
    height: 300,
    alignItems: "center",
    //justifyContent:'center'
  },
  button4: {
    alignItems: "center",
    backgroundColor: "#478772",
    justifyContent: "center",
    alignSelf: "center",
    width: 138,

    borderRadius: 20,
    height: 40,
    marginTop: 40,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Listcontainer: {
    
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#555555'
  },
  productList: {
    flex: 1,
    marginBottom: 10,
    
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#555555'
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#555555',
  },
  quantityText: {
    fontSize: 18,
    color: '#555555',
  },
  addToCartButton: {
    backgroundColor: "gold",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#222222",
    fontSize: 22,
    fontWeight: "bold",
  },
});

//make this component available to the app
// export default call;
