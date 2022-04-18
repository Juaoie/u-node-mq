import { isString } from "../../index";
const stringType = "s###";
const nostringType = "n###";

//编码
export function envalue(value: any): string {
  if (isString(value)) return stringType + value;
  else return nostringType + JSON.stringify(value);
}

//解密
export function devalue(value: string) {
  const type = value.slice(0, 4);
  if (type === stringType) {
    return value.slice(4);
  } else if (type === nostringType) {
    try {
      return JSON.parse(value.slice(4));
    } catch (error) {
      console.log("JSON.pares error");
      return "";
    }
  }
}
