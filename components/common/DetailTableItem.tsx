import React from 'react'
import {
  View, StyleSheet, Text
} from 'react-native'

interface PropsType {
  item: any;
}

const DetailTableItem: React.FC<PropsType> = ({ item }: PropsType) => {
  return (
    <View style={styles.container}>
    <Text style={styles.context}>{item.id}</Text>
    <Text style={styles.context}>{item.date}</Text>
    <Text style={styles.context}>{item.menu}</Text>
    <Text style={styles.context}>{item.money}원</Text>
    </View>
  )
}

export default DetailTableItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 5,
    paddingVertical: 5,
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },
  context: {
    marginHorizontal: 5,
    fontSize: 20,
  }
})