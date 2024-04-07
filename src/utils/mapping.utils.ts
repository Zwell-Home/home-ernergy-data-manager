export const mapFieldNames = <T>(source: any): T | any => {
  const result: { [key: string]: any } = {};
  for (const key in source) {
    const formattedKey = key.toLowerCase().replaceAll(' ', '_');
    const type = typeof source[key] === 'string' ? 'S' : 'N';
    result[formattedKey] = {
      [type] : type === 'S' ? source[key] : `${source[key]}`
    }
  }
  return result;
}