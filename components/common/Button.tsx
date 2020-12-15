import React from 'react'
import {
  View,
  Button as BaseButton,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  ViewStyle,
  StyleProp
} from 'react-native'

interface PropsType {
  title: string;
  onClick(ev: NativeSyntheticEvent<NativeTouchEvent>): void;
  color?: string;
  customStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function Button(props: PropsType) {
  const { title, onClick, color, customStyle, disabled } = props

  const style: any[] = [styles.buttonContainer]
  if (customStyle) style.push(customStyle)
  if (disabled) style.push(styles.disabled)

  return (
    <View style={style}>
      <BaseButton
        title={title}
        onPress={onClick}
        color={color || 'white'}
        disabled={disabled}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    width: 120,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center'
  },
  disabled: {
    backgroundColor: 'lightsteelblue',
    color: 'white',
  }
})