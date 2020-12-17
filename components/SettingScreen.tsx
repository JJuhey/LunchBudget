import React from 'react';
import {
  View, Text, StyleSheet
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

const SettingScreen: React.FC<PropsType> = ({ navigation }: PropsType) => {


  return (
    <View style={style.container}>
      <Text>Setting Screen</Text>
    </View>
  )
}

export default SettingScreen
