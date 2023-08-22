import HomeScreen from "../src/screens/HomeScreen";
import OptionPage from "../src/screens/OptionPage";
import Outpatient from "../src/screens/OutPatientDepartment";
import Form from "../src/screens/Form";
import VideoLibrary from "../src/screens/VideoLibrary";
import { createStackNavigator } from "@react-navigation/stack";
import Routes from "./Routes";

const Stack = createStackNavigator();
const StackNavigation=()=>{
    return(
<Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OptionPage"
          component={OptionPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Outpatient"
          component={Outpatient}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Form"
          component={Form}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoLibrary" component={VideoLibrary} options={{ headerShown: false }}/>
        <Stack.Screen
          name="Routes"
          component={Routes}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
}
export default StackNavigation;