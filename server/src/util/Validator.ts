export function passCheck(str: string) {
  /*
    Regex pattern to check if the password has:
    At least 1 capital letter
    At least 1 special character
    At least 1 number
    */
  const pattern = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
  );

  return pattern.test(str);
}

export const specialCharacters = "!@#$%^&*()-_+='?><?`~";
