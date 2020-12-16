import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { Button } from 'react-native-paper'

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

interface PropsType {
  navigation: any;
}

const HomeScreen: React.FC<PropsType> = ({ navigation }: PropsType) => {
  return (
    <View style={style.container}>
      <Text>Home Screen</Text>
      <Button
        mode='contained'
        onPress={() => navigation.navigate('Summary')}
      >Go to Summary</Button>
    </View>
  )
}

export default HomeScreen

