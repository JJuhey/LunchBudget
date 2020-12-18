import 'react-native-gesture-handler';
import React from 'react';
import { 
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage'

import CustomNavBar from './components/CustomNavBar';
import HomeScreen from './components/HomeScreen';
import SummaryScreen from './components/SummaryScreen';
import SettingScreen from './components/SettingScreen';
import { SummaryType, SettingType } from './types/common';

const Stack = createStackNavigator();

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  }
}
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  }
}


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
  id: 1,
  userName: 'dummy',
  budgetAmount: 300000,
  category: 'default',
}

const App: React.FC = () => {
  const [db, setDb] = React.useState<SQLite.SQLiteDatabase | null>(null)
  const [summary, setSummary] = React.useState<SummaryType>(dummySummary)
  const [setting, setSetting] = React.useState<SettingType>(dummySetting)
  const [isThemeDark, setIsThemeDark] = React.useState(false)
  const [needFetchAgain, SetNeedFetchAgain] = React.useState<boolean>(false)

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
        fetchData(database)

      }, errorCB) // end database connection
    setDb(database)
  }

  const fetchData = (database: SQLite.SQLiteDatabase) => {
    database.transaction((tx) => {
      // fetch basic setting
      tx.executeSql('SELECT * FROM SETTING WHERE ID=1', [], (tx, result) => {
        // console.log('Select SETTING Query Completed')
        const tempSetting = {
          id: result.rows.item(0).ID,
          userName: result.rows.item(0).USER_NAME,
          budgetAmount: result.rows.item(0).BUDGET_AMOUNT,
          category: result.rows.item(0).CATEGORY,
        }
        setSetting(tempSetting)

        // fetch one summary of this month
        const thisMonth = `${new Date().getFullYear()}` + `${new Date().getMonth()+1}` // TODO
        console.log(`thisMonth: ${thisMonth}`)
        tx.executeSql('SELECT * FROM SUMMARY WHERE MONTH=?', [thisMonth], (tx, result) => {
          // console.log('Select SUMMARY Query Completed')
          // 생성된 현재달의 summary가 없다면, 다시 생성해준다.
          console.log(result.rows.length)
          if (result.rows.length === 0) {
            tx.executeSql(
              'INSERT INTO SUMMARY (SETTING_ID, MONTH, BUDGET, REMAIN_MONEY) VALUES (?, ?, ?, ?)',
              [tempSetting.id, thisMonth, tempSetting.budgetAmount, tempSetting.budgetAmount],
              () => {
                // console.log('Success Insert!')
                SetNeedFetchAgain(true)
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
  }

  React.useEffect(() => {
    openDatabase()

    return () => {
      db && db.close()
    }
  }, [])

  React.useEffect(() => {
    if (needFetchAgain && db) {
      fetchData(db)
      SetNeedFetchAgain(false)
    }
  }, [needFetchAgain])

  const onChangeSummary = (partial: Partial<SummaryType>) => {
    setSummary({
      ...summary,
      ...partial,
    })
  }

  const onChangeSetting = (partial: Partial<SettingType>) => {
    setSetting({
      ...setting,
      ...partial
    })
  }

  const onToggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark)
  }, [isThemeDark])

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{ header: props => 
            <CustomNavBar {...props}
              onToggleTheme={onToggleTheme}
              isThemeDark={isThemeDark}
              fetchData={fetchData}
              db={db}
            />
          }}
        >
        <Stack.Screen name='Home'>
          {props => db && <HomeScreen {...props} database={db} summary={summary} onChangeSummary={onChangeSummary} />}
        </Stack.Screen>
        <Stack.Screen name='Summary'>
          {props => db && <SummaryScreen {...props} database={db} summary={summary} onChangeSummary={onChangeSummary} />}
        </Stack.Screen>
        <Stack.Screen name='Setting'>
          {props => db && <SettingScreen {...props} database={db} setting={setting} onChangeSetting={onChangeSetting} />}
        </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

AppRegistry.registerComponent('LunchBudget', () => App)

export default App;
