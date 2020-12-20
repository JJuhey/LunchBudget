import React from 'react'
import SQLite from 'react-native-sqlite-storage'
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'

import { DetailType, SummaryType } from '../types/common'

interface PropsType {
  database: SQLite.SQLiteDatabase;
  selectedDetail?: DetailType;
  summary: SummaryType;
  onChangeSummary(partial: Partial<SummaryType>): void;
}

const initialDetail = {
  date: `${new Date().getMonth()+1}/${new Date().getDate()}`,
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
  const [detail, setDetail] = React.useState<Partial<DetailType>>(initialDetail)
  const [prevMoney, setPrevMoney] = React.useState<number | undefined>(undefined)
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(true)
  const [date, setDate] = React.useState<Date>(new Date())

  React.useEffect(() => {
    if (selectedDetail) {
      setPrevMoney(selectedDetail.amount)
      setDetail(selectedDetail)
      const selectedDate = new Date(`${summary.month.substr(0, 4)}-${summary.month.substr(4, 2)}-${(selectedDetail) ? selectedDetail.date.split('/')[1] : '1'}`)
      setDate(selectedDate)
    }
  }, [selectedDetail])

  const onChangeDetail = (partial: Partial<DetailType>) => {
    setDetail({
      ...detail,
      ...partial,
    })
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios')
    setDate(currentDate)

    const day = (currentDate.getDate() >= 10) ? `${currentDate.getDate()}` : `0${currentDate.getDate()}`
    onChangeDetail({date: `${currentDate.getMonth()+1}/${day}`})
  }

  const onSubmit = () => {
    if(typeof detail.amount === 'undefined') return
    if (detail.id) {
      // update
      database.transaction((tx) => {
        tx.executeSql(
          'UPDATE DETAIL SET DATE=?, MENU=?, MONEY=? WHERE ID=?',
          [detail.date, detail.menu, detail.amount, detail.id],
          () => {
            if(!detail.amount || !prevMoney) return
            const spendMoney = summary.spendMoney + detail.amount - prevMoney
            const remainMoney = summary.remainMoney - detail.amount + prevMoney

            // 2. Summary 항목의 쓴돈, 남은돈 업데이트
            tx.executeSql('UPDATE SUMMARY SET SPEND_MONEY=?, REMAIN_MONEY=? WHERE ID=?',
            [spendMoney, remainMoney, summary.id],
            () => {
              // 3. 현재 Summary 상태 수정, Detail 초기화
              onChangeSummary({ spendMoney, remainMoney })
              setDetail(initialDetail)
              setDate(new Date())
              Keyboard.dismiss()
            }, err => console.error(err)) // End Update Summary
          }
        )
      })
      return
    }
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
            Keyboard.dismiss()
          }, err => console.error(err)) // End Update Summary
        },
        err => console.error(err)) // End Insert Detail
    }, err => console.error(err), () => console.log('Success Transaction'))
  }

  const onDelete = () => {
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
    setDate(new Date())
  }

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
    <View style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          style={{ width: '40%', margin: 2 }}
          label="오늘의 메뉴"
          value={detail.menu}
          onChangeText={menu => onChangeDetail({ menu })}
        />
        <View style={{
          width: '30%', height: 65,
          justifyContent: 'center', backgroundColor: '#e0e0e2',
          padding: 4, marginVertical: 3,
          borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomWidth: 1, borderColor: 'gray',
        }}>
          <Text style={{ color: 'dodgerblue' }}>날짜</Text>
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode='date'
            display='compact'
            onChange={onChangeDate}
          />
        </View>
        <TextInput
          style={{ width: '25%', margin: 2 }}
          keyboardType='number-pad'
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
    </TouchableWithoutFeedback>
  )
}

export default AddDetailForm
