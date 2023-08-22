import React,{useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

export const SuccessModal = ({ visible, onClose, massage1, massage2 }) => {
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 21, color: 'green', justifyContent: 'center', textAlign: 'center', alignItems: 'center', fontWeight: 'bold', marginBottom: 10 }}>{massage1}</Text>
          <Text style={{ fontSize: 19, color: 'green', textAlign: 'justify' ,justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginBottom: 10 }}>{massage2}</Text>
          <TouchableOpacity style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20 }} onPress={onClose}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


 
