import React from 'react'
import { Text } from 'react-native'
import { Appbar } from 'react-native-paper'
import { Platform } from 'react-native'

interface PropsType {

}

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

const CustomNavBar: React.FC<PropsType> = (props: PropsType) => {
  return (
    <Appbar.Header>
      {/* <Appbar.BackAction onPress={() => {}} disabled /> */}
      <Appbar.Content title='Lunch Budget' />
      <Appbar.Action icon='magnify' onPress={() => {}} />
      <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
    </Appbar.Header>
  )
}

export default CustomNavBar
