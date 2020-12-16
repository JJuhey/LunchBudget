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

const SummaryScreen: React.FC<PropsType> = (props: PropsType) => {


  return (
    <View style={style.container}>
      <Text>Summary Screen</Text>
    </View>
  )
}

export default SummaryScreen

