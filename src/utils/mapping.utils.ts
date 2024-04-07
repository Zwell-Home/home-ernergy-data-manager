export const mapFieldNames = <T>(source: any): T | any => {
  const result: { [key: string]: any } = {};
  for (const key in source) {
    const formattedKey = key.toLowerCase().replaceAll(' ', '_');
    result[formattedKey] = {
      ...determineType(source[key])
    }
  }
  return result;
}

const determineType = (o: any): any => {
  const type = typeof o;
  switch (type) {
    case 'string':
      return { S: o }
    case 'number':
      return { N: `${o}` }
    case 'object':
      if (Array.isArray(o)) {
        return { L: o.map(item => determineType(item))}
      } else { // if json object
        return { M: mapFieldNames(o)}
      }
  }
}