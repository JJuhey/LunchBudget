import React from 'react';
import {
  View, Text, Button, StyleSheet
} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const HomeScreen: React.FC = ({ navigation }) => {


  return (
    <View style={style.container}>
      <Text>Home Screen</Text>
      <Button
        title='Go to Summary'
        onPress={() => navigation.navigate('Summary')}
      />
    </View>
  )
}

export default HomeScreen

