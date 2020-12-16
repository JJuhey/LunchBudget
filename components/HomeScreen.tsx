import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { Button, DataTable } from 'react-native-paper'

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
  },
  content: {
    marginVertical: 10,
  }
})

interface PropsType {
  navigation: any;
}

const HomeScreen: React.FC<PropsType> = ({ navigation }: PropsType) => {
  return (
    <View style={style.container}>
      <Text style={[style.content, style.title]}>10월 | 53,000원 남았음</Text>
      <DataTable style={style.content}>
        <DataTable.Header>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Menu</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title numeric>Remains</DataTable.Title>
        </DataTable.Header>
          {dummyData.map(data => (
            <DataTable.Row>
              <DataTable.Cell>{data.date}</DataTable.Cell>
              <DataTable.Cell>{data.menu}</DataTable.Cell>
              <DataTable.Cell numeric>￦ {data.amount}</DataTable.Cell>
              <DataTable.Cell numeric>￦ {data.remains}</DataTable.Cell>
            </DataTable.Row>
          ))}
      </DataTable>
      <View style={style.content}>
        <Button
          mode='contained'
          onPress={() => navigation.navigate('Summary')}
        >Go to Summary</Button>
      </View>
    </View>
  )
}

export default HomeScreen

const dummyData = [
  {
    id: 5,
    date: '10-25',
    menu: '떡볶이',
    amount: 10000,
    remains: 53000,
  },
  {
    id: 4,
    date: '10-22',
    menu: '제육볶음',
    amount: 9000,
    remains: 63000,
  },
  {
    id: 3,
    date: '10-21',
    menu: '떡볶이',
    amount: 6000,
    remains: 72000,
  },
  {
    id: 2,
    date: '10-14',
    menu: '파스타',
    amount: 12000,
    remains: 78000,
  },
  {
    id: 1,
    date: '10-11',
    menu: '김치찌개',
    amount: 10000,
    remains: 90000,
  },
]