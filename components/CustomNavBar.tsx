import React from 'react'
import SQLite from 'react-native-sqlite-storage'
import { Appbar, Menu, Button } from 'react-native-paper'
import { Platform } from 'react-native'

interface PropsType {
  navigation: any;
  previous: any;
  isThemeDark: boolean;
  db: SQLite.SQLiteDatabase;
  onToggleTheme(): void;
  fetchData(database: SQLite.SQLiteDatabase): void;
}

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

const CustomNavBar: React.FC<PropsType> = ({ navigation, previous, fetchData, db }: PropsType) => {
  const [visible, setVisible] = React.useState<boolean>(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const onPressSummary = () => {
    navigation.navigate('Summary')
    closeMenu()
  }

  const onPressSetting = () => {
    navigation.navigate('Setting')
    closeMenu()
  }

  return (
    <Appbar.Header>
      { previous? <Appbar.BackAction onPress={navigation.goBack}/> : null }
      <Appbar.Content title='Lunch Budget' />
      {/* <TouchableRipple onPress={() => onToggleTheme()}>
        <Switch
          color='red'
          value={isThemeDark}
        />
      </TouchableRipple> */}
      <Appbar.Action icon='refresh' color='white' onPress={() => fetchData(db)} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon='menu' color='white' onPress={openMenu}/>
        }
      >
        <Menu.Item onPress={onPressSummary} title='Summary'/>
        <Menu.Item onPress={onPressSetting} title='Setting'/>
        {/* <Menu.Item onPress={() => console.log('Option 3 was pressed')} title='Developer'/> */}
      </Menu>
    </Appbar.Header>
  )
}

export default CustomNavBar
