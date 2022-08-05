import { Exchange, Queue, createSingleUnmq } from "../../src/index";
import debounceTime from "../../src/operators/debounceTime";
import { expect, test, jest } from "@jest/globals";
import { promiseSetTimeout } from "../../src/utils/tools";

jest.useFakeTimers();

test("debounceTime", async function () {
  const singleUnomq1 = createSingleUnmq({ operators: [debounceTime(1000, false)] });

  const callback = jest.fn();
  singleUnomq1.emit(1, 2, 3);
  // setInterval(() => {
  // }, 100);

  singleUnomq1.on(() => {
    console.log("-------------");
    callback();
  });

  await promiseSetTimeout();

  expect(callback).not.toBeCalled();

  jest.runAllTimers();

  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
