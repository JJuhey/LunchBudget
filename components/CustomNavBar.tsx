import React from 'react'
import { Text } from 'react-native'
import { Appbar, Menu } from 'react-native-paper'
import { Platform } from 'react-native'

interface PropsType {
  navigation: any;
  previous: any;
}

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

const CustomNavBar: React.FC<PropsType> = ({ navigation, previous }: PropsType) => {
  const [visible, setVisible] = React.useState<boolean>(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Appbar.Header>
      { previous? <Appbar.BackAction onPress={navigation.goBack}/> : null }
      <Appbar.Content title='Lunch Budget' />
      {!previous ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon='menu' color='white' onPress={openMenu}/>
          }
        >
          <Menu.Item onPress={() => console.log('Option 1 was pressed')} title='Option 1'/>
          <Menu.Item onPress={() => console.log('Option 2 was pressed')} title='Option 2'/>
          <Menu.Item onPress={() => console.log('Option 3 was pressed')} title='Option 3'/>
        </Menu>
      ): null}
    </Appbar.Header>
  )
}

export default CustomNavBar
