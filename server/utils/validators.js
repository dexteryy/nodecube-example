
export const RE_SPECIAL_CHAR = /[^0-9a-zA-Z\u4e00-\u9fa5]/;
export const RE_CHN_CHAR = /[\u4e00-\u9fa5]/g;
export const RE_COMMA_SEPARATOR = /\s*[,\uFF0C]\s*/;

export const stringLengthByDoubleByte = value => {
  return (
    value.replace(RE_CHN_CHAR, 'xx') || ''
  ).length / 2;
};

export const isUsername = value => {
  return !value || !/[^\w\-]/.test(value);
};

export const isPassword = value => {
  if (!value) {
    return false;
  }
  return value.length >= 6;
};
