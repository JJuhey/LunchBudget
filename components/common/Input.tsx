import React from 'react'
import {
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native'

interface PropsType {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  customStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<PropsType> = (props: PropsType) => {
  const { value, defaultValue, placeholder, customStyle } = props

  return (
    <TextInput
      style={[styles.textStyle, customStyle]}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
    />
  )
}

export default Input

const styles = StyleSheet.create({
  textStyle: {
    height: 40,
    width: 200,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  }
})