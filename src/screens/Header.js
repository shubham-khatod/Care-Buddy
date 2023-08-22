import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from "./Profile";
import { Text } from "react-native";
import {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header=( props)=>{

  const [name, setName]= useState();
  const navigator= useNavigation();
    const HandleProfileNavigation=()=>{
        navigator.navigate('Profile');
    }
  useEffect(() => {
    const temp = async () => {
      // Local Async Storage Data Fetching.
      await AsyncStorage.getItem("userSession")
        .then((data) => {
          if (data) {
            userInfo = JSON.parse(data);
            console.log("Data of AsyncStorage: ", userInfo.name);
            // Setting user data in the local states.
            let str=userInfo.name;
            setName(str.split(' ')[0]);
          }});
        }
        temp();
      },[]);
    
    return <View style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        height: 70,
        //backgroundColor:'gray',
        padding:10,
        backgroundColor: 'white'
      }}>
        <View style={{ height: 50, width:"10%", alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={HandleProfileNavigation}>
        <Image
                  style={{
                    height: 38,
                    width: 38,
                
                  }}
                  source={require('../../assets/images/profile.png')}
                />
        
            </TouchableOpacity>
            
        </View>
        <View style={{ height: 50, width:"80%", alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 5}}>
            <Text style={{ fontSize:16, fontWeight: 400, color: '#376858'}}>{"Hi,"+name}</Text>
        </View>
        <View style={{ height: 50, width:"10%", alignItems: 'center' }}>
        
        <Image
                  style={{
                    height: 60,
                    width: 90,
                  }}
                  source={require('../../assets/images/grayLogo.png')}
                />
        
        
        
        </View>
        
    </View>
};

export default Header;