import React from 'react'
import SQLite from 'react-native-sqlite-storage'
import { View, StyleSheet, Text } from 'react-native'
import { Title, Dialog, Portal, Button, TextInput } from 'react-native-paper'

import { SummaryType } from '../types/common';

interface PropsType {
  summary: SummaryType;
  showSummary: boolean;
  database: SQLite.SQLiteDatabase;
  setShowSummary(show: boolean) : void;
  goToDetailList(): void;
  onChangeSummary(sum: Partial<SummaryType>): void;
}

const style = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: 70,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    margin: 2,
  },
  input: {
    width: '29%',
    margin: 2,
    fontSize: 15,
  },
})

const UpdateSummaryForm = ({
  summary,
  database,
  showSummary,
  setShowSummary,
  goToDetailList,
  onChangeSummary,
}: PropsType) => {
  const [tempSummary, setTempSummary] = React.useState<SummaryType>(summary)
  const [isChangable, setIsChangable] = React.useState<boolean>(false)
  const onChange = () => {
    if (!tempSummary.budget) return

    if (tempSummary.budget === 910815) {
      setIsChangable(true)
      return
    }

    // console.log('수정할게요...')
    database.transaction(tx => {
      tx.executeSql(
        'UPDATE SUMMARY SET BUDGET=?, SPEND_MONEY=?, REMAIN_MONEY=? WHERE ID=?',
        [tempSummary.budget, tempSummary.spendMoney, tempSummary.remainMoney, tempSummary.id],
        () => {
          console.log('success Update!')
          onChangeSummary(tempSummary)
          setShowSummary(false)
        }, (err) => console.error(err))
    })
  }

  const goDetailPage = () => {
    setShowSummary(false)
    goToDetailList()
  }

  const onChangeTempSummary = (change: Partial<SummaryType>) => {
    setTempSummary({
      ...tempSummary,
      ...change,
    })
  }
  const onChangeBudget = (amount: string) => {
    const budget = Number(amount)
    const remainMoney = budget - tempSummary.spendMoney
    onChangeTempSummary({ budget, remainMoney })
  }

  const onDelete = () => {
    // console.log('delete')
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM SUMMARY WHERE ID=?',
        [tempSummary.id],
        () => {
          console.log('success Delete!')
          const thisMonth = `${new Date().getFullYear()}` + `${new Date().getMonth()+1}` // TODO
          // 현재월..
          tx.executeSql('SELECT * FROM SUMMARY WHERE MONTH=?', [thisMonth], (tx, result) => {
            console.log('Select SUMMARY Query Completed')

            onChangeSummary({
              id: result.rows.item(0).ID,
              settingId: result.rows.item(0).SETTING_ID,
              month: result.rows.item(0).MONTH,
              budget: result.rows.item(0).BUDGET,
              spendMoney: result.rows.item(0).SPEND_MONEY,
              remainMoney: result.rows.item(0).REMAIN_MONEY,
            })
          }, (err) => console.error(err)) // end fetch summary

          setShowSummary(false)
        }, (err) => console.error(err))
    })
  }

  return (
    <Portal>
      <Dialog visible={showSummary} onDismiss={() => setShowSummary(false)}>
        <Dialog.Content>
          <Title>{`${summary.month.substring(0,4)}년 ${summary.month.substring(4,6)}월`}</Title>
          <View style={style.inputContainer}>
            <TextInput
              style={style.input}
              keyboardType='number-pad'
              label="예산"
              value={(typeof tempSummary.budget === 'undefined') ? '' : `${tempSummary.budget}`}
              onChangeText={isChangable ? (amount) => onChangeTempSummary({ budget: Number(amount)}) : onChangeBudget}
            />
            <Text style={{marginTop: 30}}>=</Text>
            <TextInput
              style={style.input}
              keyboardType='number-pad'
              label='쓴돈'
              disabled={!isChangable}
              value={(typeof tempSummary.spendMoney === 'undefined') ? '' : `${tempSummary.spendMoney}`}
              onChangeText={(amount) => onChangeTempSummary({ spendMoney: Number(amount)})}
            />
            <Text style={{marginTop: 30}}>+</Text>
            <TextInput
              style={style.input}
              keyboardType='number-pad'
              label='남은돈'
              disabled={!isChangable}
              value={(typeof tempSummary.remainMoney === 'undefined') ? '' : `${tempSummary.remainMoney}`}
              onChangeText={(amount) => onChangeTempSummary({ remainMoney: Number(amount)})}
            />
          </View>
          <Text style={{ marginHorizontal: 10 }}> * 쓴돈은 바꿀 수 없습니다.</Text>
          <View style={style.buttonContainer}>
            <Button style={style.button} mode='contained' onPress={onChange}>수정하기</Button>
            <Button style={style.button} mode='outlined' onPress={goDetailPage}>내역보기</Button>
          </View>
          {isChangable && <Button style={style.button} mode='contained' onPress={onDelete} dark color='black'>삭제하기</Button>}
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

export default UpdateSummaryForm
