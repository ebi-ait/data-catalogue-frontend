import {ColumnConfiguration} from "./types";
import {shouldHideColumn} from "./Util";

test('test column hiding', () => {
  expect(shouldHideColumn("x")).toBeFalsy();
  expect(shouldHideColumn("description")).toBeTruthy();
  expect(shouldHideColumn("title")).toBeFalsy();
});
