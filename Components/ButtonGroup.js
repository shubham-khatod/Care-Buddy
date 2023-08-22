import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React , { useState} from 'react'
import { Button } from 'react-native/Libraries/Components/Button';

export const  ButtonGroup = ({buttons, doSomethingAfterClick}) =>{
    const [clickedId,setClickedId]= useState(1);
    const [slot, setSlot] = useState();
    const handleClick = (item,id, label) =>{
        setClickedId(id)
        setSlot(label);
        // console.log('Slot: ', label);
        doSomethingAfterClick(item, id, label)
        console.log(clickedId);
    }

  return (
    <View style= {styles.container}>
      {
        buttons.map((buttonlable,index) => {
            return (
                <TouchableOpacity 
                 onPress={(item) => handleClick(item, index, buttonlable)}
                    key={index}
                    
                    style={[
                        index === clickedId ? styles.buttonActive : styles.button
                    ]}>
                    <Text
                    style= {index === clickedId ? styles.textActive : styles.text}
                    >
                        {buttonlable}
                    </Text>
                </TouchableOpacity>
            )
        })
      }
    </View>
  )
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        marginTop:10,
        //borderWidth:1,
        width:300,
        height:700,
        justifyContent:"space-around"
        
    },
    button:{
        flexDirection:'row',
        alignItems: "center",
        backgroundColor: "#DEDEDE63",
        justifyContent:'center',
        width:100,
       
        borderRadius:20,
        height:35,
        marginTop:25,
    
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1,
        elevation: 2
      },
    buttonActive:{
        flexDirection:'row',
        alignItems: "center",
        backgroundColor: "#DEF1EB",
        justifyContent:'center',
        
        width:100,
        
        borderRadius:20,
        height:35,
        marginTop:25,
        
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1,
        elevation: 2
    },
    text:{
        color:'black'
    },
    textActive:{
        color:'black'
    }

});