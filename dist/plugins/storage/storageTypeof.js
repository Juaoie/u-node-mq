import { isString } from "../../index";
var stringType = "s###";
var nostringType = "n###";
export function envalue(value) {
    if (isString(value))
        return stringType + value;
    else
        return nostringType + JSON.stringify(value);
}
export function devalue(value) {
    var type = value.slice(0, 4);
    if (type === stringType) {
        return value.slice(4);
    }
    else if (type === nostringType) {
        try {
            return JSON.parse(value.slice(4));
        }
        catch (error) {
            console.log("JSON.pares error");
            return "";
        }
    }
}
