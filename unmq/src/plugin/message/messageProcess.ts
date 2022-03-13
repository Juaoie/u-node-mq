import { Coordinate } from "./coordinate";
import { getIframeNodeFromCoordinate } from "./loader";
type Data = {
  message: any;
  transfer?: Transferable[];
};
/**
 * 发送消息
 * @param data
 * @param coordinate
 */
export function postMessage(data: Data, coordinate: Coordinate) {
  const currentWindow = getIframeNodeFromCoordinate(coordinate);
  currentWindow.postMessage(
    {
      message: data.message,
      fromName: coordinate.name,
      fromNameOrigin: window.origin,
    },
    coordinate.origin,
    data.transfer,
  );
}
