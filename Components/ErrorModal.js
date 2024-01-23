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

export const ErrorModal = ({ visible, onClose, massage1, massage2 }) => {
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
        }}
      >
        <ImageBackground
          source={require("../assets/images/error-bg.jpg")}
          style={{
            padding: 20,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "rgba(255,0,0, 0.5)",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "25%" }}>
            <Text> </Text>
          </View>
          <View
            style={{
              width: "75%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#376858",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",

                fontFamily: "Roboto-Medium",
                paddingBottom: 10,
              }}
            >
              {massage1}
            </Text>
            <View
              style={{
                borderTopWidth: 1,
                borderStyle: "dashed",
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
              }}
            >
              {massage2}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255,0,0, 0.5)",

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
                Okay
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};
