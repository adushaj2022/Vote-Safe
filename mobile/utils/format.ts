export const formatDate = (val: Date): string =>
  `${val.getMonth() + 1}/${val.getDate()}/${val.getFullYear()}`;

// reference for this helper method
//https://stackoverflow.com/questions/21147832/convert-camel-case-to-human-readable-string
export const formatCamelCase = (str: string) => {
  return str
    .match(/^[a-z]+|[A-Z][a-z]*/g)!
    .join(" ")
    .toLowerCase();
};
