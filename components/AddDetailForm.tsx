import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'

import { DetailType } from '../types/common'

interface PropsType {

}

const initialDetail = {
  date: `${new Date().getMonth()+1}-${new Date().getDate()}`, // TODO
  menu: '',
  amount: 0,
}

const style = StyleSheet.create({
  container: {
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const AddDetailForm: React.FC = (props: PropsType) => {
  const [text, setText] = React.useState('')
  const [detail, setDetail] = React.useState<Partial<DetailType>>(initialDetail)

  const onChangeDetail = (partial: Partial<DetailType>) => {
    setDetail({
      ...detail,
      ...partial,
    })
  }

  const onSubmit = () => {
    console.log(detail)
  }

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
          value={`${detail.amount}`}
          onChangeText={amount => onChangeDetail({ amount: Number(amount) })}
        />
      </View>
      <Button 
        mode='contained'
        onPress={onSubmit}
      >SUBMIT</Button>
    </View>
  )
}

export default AddDetailForm
