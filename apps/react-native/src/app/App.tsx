import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';;
import HomeScreen from './home';
import AboutScreen from './about';

const bottomTabNavigator = createBottomTabNavigator({
  screenOptions: {
    tabBarActiveTintColor: '#ffd333',
    tabBarStyle: {
      backgroundColor: '#25292e',
    },
    headerTintColor: '#fff',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#25292e',
        }
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          return <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={size} color={color} />;
        },
      },
    },
    About: {
      screen: AboutScreen,
      options: {
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          return <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={size} color={color} />;
        },
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Main',
  screens: {
    Main: {
      screen: bottomTabNavigator,
      options: {
        headerShown: false,
      }
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}