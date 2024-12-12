export const encodeString = (str: string) => {
  return str.replace(/ /g, '%20');
}