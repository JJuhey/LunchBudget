import React from 'react';
import SQLite from 'react-native-sqlite-storage'
import {
  View, Text, StyleSheet
} from 'react-native';
import { SettingType } from '../types/common';
import { Subheading, TextInput, Button } from 'react-native-paper';

interface PropsType {

}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingInfo: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'left',
  },
  content: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  line: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  lineInput: {
    width: '100%',
  }
})

interface PropsType {
  navigation: any;
  database: SQLite.SQLiteDatabase;
  setting: SettingType;
  onChangeSetting(change: Partial<SettingType>): void;
}

const SettingScreen: React.FC<PropsType> = ({ navigation, database, setting, onChangeSetting }: PropsType) => {
  const [userName, setUserName] = React.useState(setting.userName)
  const [budget, setBudget] = React.useState(setting.budgetAmount)

  React.useEffect(() => {
    setUserName(setting.userName)
    setBudget(setting.budgetAmount)
  }, [setting])

  const onChangeSettingBudget = () => {
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE SETTING SET USER_NAME=?, BUDGET_AMOUNT=? WHERE ID=1',
        [userName, budget],
        () => {
          onChangeSetting({ userName, budgetAmount: budget })
        },
        err => console.error(err),
      )
    }, err => console.error(err), () => console.log('Transaction Success!'))
    // console.log(userName)
    // console.log(budget)
  }

  return (
    <View style={style.container}>
      <View style={style.content}>
        <Text style={style.title}>SETTING</Text>
      </View>
      <View style={[style.content, style.settingInfo]}>
        <View style={style.line}>
          <TextInput
            label='user name'
            mode='outlined' 
            style={style.lineInput} 
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        <View style={style.line}>
          <TextInput
            label='basic budget'
            mode='outlined'
            keyboardType='number-pad'
            style={style.lineInput}
            value={`${budget}`}
            onChangeText={(amount) => setBudget(Number(amount))}
          />
        </View>
        <View style={style.line}>
          <Button
            mode='contained'
            style={style.lineInput}
            onPress={onChangeSettingBudget}
          >수정하기</Button>
        </View>
        <View style={style.line}>
          <Text>* 기본 예산은 새로 생기는 달에만 반영됩니다.</Text>
        </View>
      </View>
    </View>
  )
}

export default SettingScreen
