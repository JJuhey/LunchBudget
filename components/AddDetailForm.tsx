import React from 'react'
import SQLite from 'react-native-sqlite-storage'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'

import { DetailType, SummaryType } from '../types/common'

interface PropsType {
  database: SQLite.SQLiteDatabase;
  selectedDetail?: DetailType;
  summary: SummaryType;
  onChangeSummary(partial: Partial<SummaryType>): void;
}

const initialDetail = {
  date: `${new Date().getMonth()+1}-${new Date().getDate()}`,
  menu: '',
  amount: undefined,
}

const style = StyleSheet.create({
  container: {
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

const AddDetailForm: React.FC<PropsType> = ({
  database, summary, onChangeSummary, selectedDetail,
}: PropsType) => {
  const [text, setText] = React.useState('')
  const [detail, setDetail] = React.useState<Partial<DetailType>>(initialDetail)

  const onChangeDetail = (partial: Partial<DetailType>) => {
    setDetail({
      ...detail,
      ...partial,
    })
  }

  const onSubmit = () => {
    if(typeof detail.amount === 'undefined') return
    database.transaction((tx) => {
      // 1. Detail 항목 삽입
      tx.executeSql(
        'INSERT INTO DETAIL (DATE, MENU, MONEY, SUMMARY_ID) VALUES (?, ?, ?, ?)',
        [detail.date, detail.menu, detail.amount, summary.id],
        (tx, result) => {
          if(!detail.amount) return
          const spendMoney = summary.spendMoney + detail.amount
          const remainMoney = summary.remainMoney - detail.amount

          // 2. Summary 항목의 쓴돈, 남은돈 업데이트
          tx.executeSql('UPDATE SUMMARY SET SPEND_MONEY=?, REMAIN_MONEY=? WHERE ID=?',
          [spendMoney, remainMoney, summary.id],
          () => {
            // 3. 현재 Summary 상태 수정, Detail 초기화
            onChangeSummary({ spendMoney, remainMoney })
            setDetail(initialDetail)
          }, err => console.error(err)) // End Update Summary
        },
        err => console.error(err)) // End Insert Detail
    }, err => console.error(err), () => console.log('Success Transaction'))
  }

  const onDelete = () => {
    console.log(detail)
    if (detail.id) {
      // 1. delete
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM DETAIL WHERE ID=?',
          [detail.id],
          () => {
            if(!detail.amount) return
            const spendMoney = summary.spendMoney - detail.amount
            const remainMoney = summary.remainMoney + detail.amount

            // 2. Summary 항목의 쓴돈, 남은돈 업데이트
            tx.executeSql('UPDATE SUMMARY SET SPEND_MONEY=?, REMAIN_MONEY=? WHERE ID=?',
            [spendMoney, remainMoney, summary.id],
            () => {
              // 3. 현재 Summary 상태 수정, Detail 초기화
              onChangeSummary({ spendMoney, remainMoney })
              setDetail(initialDetail)
            }, err => console.error(err)) // End Update Summary
          },
          err => console.error(err)
        )
      }, err => console.error(err), () => console.log('Success Delete'))
    } else {
      console.log('삭제할 내역이 없습니다.')
    }
  }
  const onReset = () => {
    setDetail(initialDetail)
  }

  React.useEffect(() => {
    if(selectedDetail) setDetail(selectedDetail)
  }, [selectedDetail])

  return (
    <View style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          style={{ width: '45%', margin: 2 }}
          label="오늘의 메뉴"
          value={detail.menu}
          onChangeText={menu => onChangeDetail({ menu })}
        />
        <TextInput
          style={{ width: '25%', margin: 2 }}
          label="날짜(M-D)"
          value={detail.date}
          onChangeText={date => onChangeDetail({ date })}
        />
        <TextInput
          style={{ width: '25%', margin: 2 }}
          label="금액(원)"
          value={(typeof detail.amount === 'undefined') ? '' : `${detail.amount}`}
          onChangeText={amount => onChangeDetail({ amount: Number(amount) })}
        />
      </View>
      <View style={style.buttonContainer}>
        <Button
          style={{ width: '30%', margin: 4 }}
          mode='contained'
          onPress={onSubmit}
        >SUBMIT</Button>
        <Button
          style={{ width: '30%', margin: 4 }}
          mode='outlined'
          onPress={onReset}
        >Reset</Button>
        {<Button
          style={{ width: '30%', margin: 4 }}
          mode='contained'
          disabled={!detail.id}
          onPress={onDelete}
        >Delete</Button>}
      </View>
    </View>
  )
}

export default AddDetailForm
