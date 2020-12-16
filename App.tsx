import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AppRegistry,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SQLite, { SQLError } from 'react-native-sqlite-storage'

import CustomNavBar from './components/CustomNavBar';
import HomeScreen from './components/HomeScreen';
import SummaryScreen from './components/SummaryScreen';
import { SummaryType } from './types/common';

const Stack = createStackNavigator();

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const App: React.FC = () => {
  const [db, setDb] = React.useState<SQLite.SQLiteDatabase | null>(null)
  const [summary, setSummary] = React.useState<SummaryType | null>(null)

  const errorCB = (err: SQLError) => console.log("SQL Error: " + err)
  const successCB = () => console.log("SQL executed find")

  React.useEffect(() => {
    const database = SQLite.openDatabase(
      {
        name: 'BudgetDB.db',
        location: 'default',
        createFromLocation: '~www/BudgetDB.db',
      },
      successCB, errorCB)

    database.transaction((tx) => {
      const thisMonth = `${new Date().getFullYear()}` + `${new Date().getMonth()}` // TODO
      let selectSummaryQuery = `SELECT * FROM SUMMARY WHERE MONTH=${thisMonth};`
      tx.executeSql(selectSummaryQuery, [], (tx, result) => {
        console.log("Query completed")
        console.log(result.rows.item(0))
        const temp: SummaryType = {
          id: result.rows.item(0).ID,
          settingId: result.rows.item(0).SETTING_ID,
          month: result.rows.item(0).MONTH,
          budget: result.rows.item(0).BUDGET,
          spendMoney: result.rows.item(0).SPEND_MONEY,
          remainMoney: result.rows.item(0).REMAIN_MONEY,
        }
        setSummary(temp)
      }, err => console.error(err))
    })

    setDb(database)

    return () => {
      db && db.close()
    }
  }, [])

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{ header: props => <CustomNavBar {...props}/>}}
        >
        <Stack.Screen name='Home'>
          {props => db && summary && <HomeScreen {...props} database={db} summary={summary} />}
        </Stack.Screen>
        <Stack.Screen name='Summary' component={SummaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

AppRegistry.registerComponent('LunchBudget', () => App)

export default App;
