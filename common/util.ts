
export function showComma(n: number): string{
  if(n==0) return '0'

  const reg = /(^[+-]?\d+)(\d{3})/;
  let str = n + ''

  while (reg.test(str)) str = str.replace(reg, '$1' + ',' + '$2');

  return str
}
