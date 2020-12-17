import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage'

import CustomNavBar from './components/CustomNavBar';
import HomeScreen from './components/HomeScreen';
import SummaryScreen from './components/SummaryScreen';
import SettingScreen from './components/SettingScreen';
import { SummaryType, SettingType } from './types/common';

const Stack = createStackNavigator();

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const dummySummary: SummaryType = {
  id: 0,
  settingId: 0,
  month: '202000',
  budget: 100000,
  spendMoney: 0,
  remainMoney: 0,
}
const dummySetting: SettingType = {
  id: 0,
  userName: 'dummy',
  budgetAmount: 100000,
  category: 'default',
}

const App: React.FC = () => {
  const [db, setDb] = React.useState<SQLite.SQLiteDatabase | null>(null)
  const [summary, setSummary] = React.useState<SummaryType>(dummySummary)
  const [setting, setSetting] = React.useState<SettingType>(dummySetting)
  let needFetchAgain = 0

  const errorCB = (err: any) => console.error('SQL Error: ' + err)

  const openDatabase = () => {
    // console.log('openDatabase...')
    const database = db || SQLite.openDatabase(
      {
        name: 'BudgetDB.db',
        location: 'default',
        createFromLocation: '~www/BudgetDB.db',
      },
      () => {
        database.transaction((tx) => {
          // fetch basic setting
          tx.executeSql('SELECT * FROM SETTING WHERE ID=1', [], (tx, result) => {
            // console.log('Select SETTING Query Completed')
            setSetting({
              id: result.rows.item(0).ID,
              userName: result.rows.item(0).USER_NAME,
              budgetAmount: result.rows.item(0).BUDGET_AMOUNT,
              category: result.rows.item(0).CATEGORY,
            })

            // fetch one summary of this month
            const thisMonth = `${new Date().getFullYear()}` + `${new Date().getMonth()+1}` // TODO
            // console.log(`thisMonth: ${thisMonth}`)
            tx.executeSql('SELECT * FROM SUMMARY WHERE MONTH=?', [thisMonth], (tx, result) => {
              // console.log('Select SUMMARY Query Completed')
              // 생성된 현재달의 summary가 없다면, 다시 생성해준다.
              if (result.rows.length === 0) {
                tx.executeSql(
                  'INSERT INTO SUMMARY (SETTING_ID, MONTH, BUDGET, REMAIN_MONEY) VALUES (?, ?, ?, ?)',
                  [setting.id, thisMonth, setting.budgetAmount, setting.budgetAmount],
                  () => {
                    // console.log('Success Insert!')
                    needFetchAgain = 1
                  },
                  errorCB,
                )

                return
              }

              setSummary({
                id: result.rows.item(0).ID,
                settingId: result.rows.item(0).SETTING_ID,
                month: result.rows.item(0).MONTH,
                budget: result.rows.item(0).BUDGET,
                spendMoney: result.rows.item(0).SPEND_MONEY,
                remainMoney: result.rows.item(0).REMAIN_MONEY,
              })
            }, errorCB) // end fetch summary
          }, errorCB) // end fetch setting
        }, errorCB, () => console.log('Successful Transaction')) // end all transaction
      }, errorCB) // end database connection
    setDb(database)
  }

  React.useEffect(() => {
    console.log('App useEffect...')
    openDatabase()

    return () => {
      db && db.close()
    }
  }, [needFetchAgain])

  const onChangeSummary = (partial: Partial<SummaryType>) => {
    setSummary({
      ...summary,
      ...partial,
    })
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{ header: props => <CustomNavBar {...props}/>}}
        >
        <Stack.Screen name='Home'>
          {props => db && <HomeScreen {...props} database={db} summary={summary} onChangeSummary={onChangeSummary} />}
        </Stack.Screen>
        <Stack.Screen name='Summary' component={SummaryScreen} />
        <Stack.Screen name='Setting' component={SettingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

AppRegistry.registerComponent('LunchBudget', () => App)

export default App;
