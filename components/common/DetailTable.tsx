import React from 'react'
import {
  View, StyleSheet, Text
} from 'react-native'

import DetailTableItem from './DetailTableItem'

interface PropsType {
  items?: any[];
}

const dummyArr = [
  { id: 1, date: '11-01', menu: 'menu1', money: 10000 },
  { id: 2, date: '11-05', menu: 'menu2', money: 8000 },
  { id: 3, date: '11-11', menu: 'menu3', money: 23000 },
  { id: 4, date: '11-23', menu: 'menu4', money: 2000 },
]

const DetailTable: React.FC<PropsType> = (props: PropsType) => {
  const { items } = props

  const tempItems = items || dummyArr

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerContent}>ID</Text>
        <Text style={styles.headerContent}>DATE</Text>
        <Text style={styles.headerContent}>MENU</Text>
        <Text style={styles.headerContent}>AMOUNT</Text>
      </View>
      <View style={styles.body}></View>
      {tempItems.map(item => <DetailTableItem item={item} key={item.id} />)}
    </View>
  )
}

export default DetailTable

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  headerContent: {
    marginHorizontal: 5,
    fontSize: 20,
  },
  body: {
    
  }
})