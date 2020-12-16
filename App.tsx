import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'

import CustomNavBar from './components/CustomNavBar'

const App = () => {
  return (
    <PaperProvider>
      <CustomNavBar />
    </PaperProvider>
  );
};

AppRegistry.registerComponent('LunchBudget', () => App)

export default App;
