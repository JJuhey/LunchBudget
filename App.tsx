import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AppRegistry,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import CustomNavBar from './components/CustomNavBar';
import HomeScreen from './components/HomeScreen';
import SummaryScreen from './components/SummaryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{ header: (props) => <CustomNavBar {...props}/>}}
        >
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Summary' component={SummaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

AppRegistry.registerComponent('LunchBudget', () => App)

export default App;
