import React from 'react'

import {
  View, Text
} from 'react-native'

export default function SettingScreen({ navigation, route }) {
  return (
    <View>
      <Text>SETTING</Text>
      <Text>This is {route.params.name}'s profile</Text>
    </View>
  )
}
