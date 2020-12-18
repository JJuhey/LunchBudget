import React from 'react';
import SQLite from 'react-native-sqlite-storage'
import {
  View, Text, StyleSheet,
} from 'react-native';
import { Button, DataTable, Divider } from 'react-native-paper'

import { DetailType, SummaryType } from '../types/common';
import AddDetailForm from './AddDetailForm';
import { ScrollView } from 'react-native-gesture-handler';
import { showComma } from '../common/util';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: 'left',
  },
  content: {
    marginVertical: 10,
    paddingHorizontal: 10,
  }
})

interface PropsType {
  navigation: any;
  database: SQLite.SQLiteDatabase;
  summary: SummaryType;
  onChangeSummary(partial: Partial<SummaryType>): void;
}

const HomeScreen: React.FC<PropsType> = ({
  navigation,
  database,
  summary,
  onChangeSummary,
}: PropsType) => {
  const [details, setDetails] = React.useState<DetailType[]>([])
  const [month, setMonth] =  React.useState(`${new Date().getFullYear()}.${new Date().getMonth()+1}`) // TODO
  const [selectedDetail, setSelectedDetail] = React.useState<DetailType | undefined>(undefined)

  const fetchDetails = () => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM DETAIL WHERE SUMMARY_ID=? ORDER BY DATE DESC',
        [summary.id], (tx, result) => {
          const rows = result.rows;
          let detailList = []
          let tempRemain = summary.remainMoney
    
          for(let i=0; i<rows.length; i++) {
            const detail: DetailType = {
              id: rows.item(i).ID,
              date: rows.item(i).DATE,
              menu: rows.item(i).MENU,
              amount: rows.item(i).MONEY,
              remain: tempRemain,
              summaryId: rows.item(i).SUMMARY_ID,
            }
            tempRemain += rows.item(i).MONEY
            detailList.push(detail)
          }

          setDetails(detailList)
        }, err => console.error(err)) // end select details
    }, err => console.error(err), () => console.log('Successful Transaction'))
  }

  React.useEffect(() => {
    // console.log('HomeScreen useEffect...')
    if (summary.month !== month) {
      const sumYear = summary.month.substring(0, 4)
      const sumMonth = summary.month.substring(4, 6)
      setMonth(`${sumYear}년 ${sumMonth}월`)
    }


    fetchDetails()
  }, [summary])

  const onPressDetail = (detailId: number) => {
    const selected = details.find(detail => detail.id === detailId)
    selected && setSelectedDetail(selected)
  }

  return (
    <View style={style.container}>
      <View style={style.content}>
        <Text style={style.title}>{month}</Text>
        <Text>남은돈: ￦{showComma(summary.remainMoney)} / 예산: ￦{showComma(summary.budget)}</Text>
      </View>
      <View style={style.content}>
        <AddDetailForm
          database={database}
          selectedDetail={selectedDetail}
          summary={summary}
          onChangeSummary={onChangeSummary}/>
      </View>
      <Divider />
      <ScrollView>
        <DataTable style={style.content}>
          <DataTable.Header>
            <DataTable.Title>날짜</DataTable.Title>
            <DataTable.Title>메뉴</DataTable.Title>
            <DataTable.Title numeric>가격 (원)</DataTable.Title>
            <DataTable.Title numeric>남은돈 (원)</DataTable.Title>
          </DataTable.Header>
            {details.map(data => (
              <DataTable.Row key={`detail-${data.id}`} onPress={() => onPressDetail(data.id)}>
                <DataTable.Cell>{data.date}</DataTable.Cell>
                <DataTable.Cell>{data.menu}</DataTable.Cell>
                <DataTable.Cell numeric>￦ {showComma(data.amount)}</DataTable.Cell>
                <DataTable.Cell numeric>￦ {data.remain && showComma(data.remain)}</DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Row key={`detail-init`} >
                <DataTable.Cell>-</DataTable.Cell>
                <DataTable.Cell>Initial Budget</DataTable.Cell>
                <DataTable.Cell numeric>-</DataTable.Cell>
                <DataTable.Cell numeric>￦ {showComma(summary.budget)}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
        {/* <View style={style.content}>
          <Button
            mode='contained'
            onPress={fetchDetails}
          >Load Data</Button>
        </View> */}
      </ScrollView>
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