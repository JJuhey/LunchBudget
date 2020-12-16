import React from 'react';
import {
  View, Text, Button, StyleSheet
} from 'react-native';

interface PropsType {

}

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

const SummaryScreen: React.FC<PropsType> = ({ navigation }: PropsType) => {


  return (
    <View style={style.container}>
      <Text>Summary Screen</Text>
    </View>
  )
}

export default SummaryScreen

