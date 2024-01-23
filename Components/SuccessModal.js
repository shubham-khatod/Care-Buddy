import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from "react-native";

export const SuccessModal = ({ visible, onClose, massage1, massage2 }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingHorizontal: 10,
          width: "100%",
        }}
      >
        <ImageBackground
          source={require("../assets/images/popup-bg.jpg")}
          style={{
            paddingVertical: 20,

            borderRadius: 10,
            borderWidth: 3,
            borderColor: "gold",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#376858",
                fontFamily: "Roboto-Medium",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                paddingHorizontal: 5,
                paddingBottom: 10,
              }}
            >
              {massage1}
            </Text>

            <View
              style={{
                borderTopWidth: 1,
                borderStyle: "dashed",
                borderColor: "#376858",
                width: "95%",
              }}
            ></View>

            <Text
              style={{
                fontSize: 16,
                color: "#376858",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto-Medium",
                paddingTop: 10,
                paddingHorizontal: 5,
              }}
            >
              {massage2}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#FFD700",

                width: 100,
                padding: 5,
                borderRadius: 5,
                marginTop: 15,
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: 14,
                  fontFamily: "Roboto-Medium",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};
