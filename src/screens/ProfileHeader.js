import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from "./Profile";
import { Text } from "react-native";
import { useEffect } from "react";
import { LogBox } from "react-native";

const ProfileHeader=( props)=>{
    const navigator= useNavigation();
    const HandleProfileNavigation=()=>{
        navigator.navigate("Routes");
    }
    useEffect(()=>{
      LogBox.ignoreLogs([
        'Require cycle:'
    ]);
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
        <View style={{ height: 50, width:50, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={HandleProfileNavigation}>
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
        {/*<View style={{ height: 50, width:250, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{paddingTop:5, fontSize:22, fontWeight: 600, color: 'black'}}>{props.title}</Text>
                </View>*/}
        <View style={{ height: 50, width:50, alignItems: 'center'}}>
        
        <Image
                  style={{
                    height: 60,
                    width: 90,
                    padding:0,
                    
                  }}
                  source={require('../../assets/images/grayLogo.png')}
                />
        
        
        
        </View>
        
    </View>
};

export default ProfileHeader;