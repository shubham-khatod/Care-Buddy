

export const SuccessModal = ({ modalVisible, setModalVisible, modalMessage }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBox: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalMessage: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
  });



// {
//     loading ?
//     (
//     <ActivityIndicator
//       style={styles.indicator}
//       color="#1b6844"
//       size="large"
//     />
//     ) 
   
//     :
  
//     (
    
//         <FlatList  data={DATA}  
//         renderItem = { ({item, index}) => {
       
//             return (
          
//                 <>
//                 <PainAssessmentItem  
//                     number={item.number}
//                     number2={item.number2}
//                     message={item.message}
//                     src={item.src}
//                     desc={item.desc}
//                     assesspain={item.assesspain}
//                     index={index}
//                     onClick={onClick}
//                     isPress={clickedindex == index}
//                     setIndex={setIndex}
//                 />

//                 <View style={{height: 1, backgroundColor: 'green', width: 380, marginLeft: 15}} />
//                 </>
//             )
//       } }
//       keyExtractor={item => item.id} />
  
//       )
//     };

