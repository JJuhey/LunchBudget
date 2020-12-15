import React from 'react'
import {
  View, Text, StyleSheet, TextInput
} from 'react-native'

import Button from './common/Button'
import Input from './common/Input'
import DetailTable from './common/DetailTable'


export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>HOME</Text>
      <Button
        customStyle={styles.buttonStyle}
        title='SETTING'
        onClick={() => navigation.navigate('Setting', { name: 'Jane' })}
      />
      <Input
        placeholder='placeholder'
        defaultValue='default'
      />
      <DetailTable />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 20,
  },
  buttonStyle: {
    // width: 100,
  }
})