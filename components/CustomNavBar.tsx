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

  const onPressSummary = () => {
    navigation.navigate('Summary')
    closeMenu()
  }

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
          <Menu.Item onPress={onPressSummary} title='Summary'/>
          <Menu.Item onPress={() => console.log('Option 3 was pressed')} title='Option 2'/>
          <Menu.Item onPress={() => console.log('Option 3 was pressed')} title='Option 3'/>
        </Menu>
      ): null}
    </Appbar.Header>
  )
}

export default CustomNavBar
