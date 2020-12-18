import React from 'react';
import SQLite from 'react-native-sqlite-storage'
import {
  View, Text, StyleSheet
} from 'react-native';
import { Card, Paragraph, Title, Button } from 'react-native-paper';

import { SummaryType, SettingType } from '../types/common';
import UpdateSummaryForm from './UpdateSummaryForm';
import { showComma } from '../common/util';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    textAlign: 'left',
  },
  content: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  card: {
    margin: 5,
  }
})

interface PropsType {
  navigation: any;
  database: SQLite.SQLiteDatabase;
  summary: SummaryType;
  onChangeSummary(partial: Partial<SummaryType>): void;
}

const SummaryScreen: React.FC<PropsType> = ({
  navigation, database, summary, onChangeSummary,
}: PropsType) => {
  const [summaryList, setSummaryList] = React.useState<SummaryType[]>(dummyData)
  const [showSummary, setShowSummary] = React.useState<boolean>(false)

  const onPressSummary = (summaryId: number) => {
    const selectedSummary = summaryList.find(summary => summary.id === summaryId)
    // console.log(summaryList)
    selectedSummary && onChangeSummary(selectedSummary)
    setShowSummary(true)
  }

  const goToDetailList = () => {
    navigation.navigate('Home')
  }

  const fetchSummaryList = () => {
    database.transaction(tx => {
      // SummaryList를 불러온다. (setting id가 1(default)일때)
      tx.executeSql('SELECT * FROM SUMMARY WHERE SETTING_ID=1 ORDER BY ID DESC', [], (tx, result) => {
        const rows = result.rows
        let tempList = []

        for (let i=0; i<rows.length; i++) {
          const one: SummaryType = {
            id: rows.item(i).ID,
            settingId: rows.item(i).SETTING_ID,
            month: rows.item(i).MONTH,
            spendMoney: rows.item(i).SPEND_MONEY,
            remainMoney: rows.item(i).REMAIN_MONEY,
            budget: rows.item(i).BUDGET,
          }
          tempList.push(one)
        }

        setSummaryList(tempList)
      }, err => console.log(err))
    }, err => console.error(err), () => console.log('transaction success!'))
  }

  React.useEffect(() => {
    fetchSummaryList()
  }, [summary])

  return (
    <View style={style.container}>
      <View style={style.content}>
        <Text style={style.title}>SUMMARY</Text>
      </View>
      <View style={style.content}>
        {summaryList.map(data => (
          <Card
            style={style.card}
            key={`summary-${data.id}`}
            onPress={() => onPressSummary(data.id)}>
             <Card.Content>
              <Title>{data.month}</Title>
              <Paragraph>쓴돈: ￦{showComma(data.spendMoney)} / 예산: ￦{showComma(data.budget)}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
      {showSummary &&
        <UpdateSummaryForm 
          summary={summary}
          showSummary={showSummary}
          database={database}
          setShowSummary={setShowSummary}
          goToDetailList={goToDetailList}
          onChangeSummary={onChangeSummary}
        />}
    </View>
  )
}

export default SummaryScreen


const dummyData = [
  {
    id: 4,
    settingId: 0,
    month: '202012',
    budget: 100000,
    spendMoney: 100000,
    remainMoney: 0,
  },
  {
    id: 3,
    settingId: 0,
    month: '202011',
    budget: 100000,
    spendMoney: 100000,
    remainMoney: 0,
  },
  {
    id: 2,
    settingId: 0,
    month: '202010',
    budget: 100000,
    spendMoney: 60000,
    remainMoney: 40000,
  },
  {
    id: 1,
    settingId: 0,
    month: '202009',
    budget: 100000,
    spendMoney: 50000,
    remainMoney: 50000,
  },
]