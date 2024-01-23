module.exports = {
  dependencies: {
    ...(process.env.NO_FLIPPER
      ? { "react-native-flipper": { platforms: { ios: null } } }
      : {}),
    "react-native-video": {
      platforms: {
        android: {
          sourceDir: "../node_modules/react-native-video/android-exoplayer",
        },
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ["./assets/fonts"],
};
