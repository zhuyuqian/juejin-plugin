import { pageChange } from "./pageChange";
import "../../style/common.less";
import "../../style/theme.less";

chrome.runtime.onMessage.addListener(async (request, callback) => {
	let { from, event, data } = request;
	if (from !== "background") return;
	if (event === "page-change-complete") {
		await pageChange();
	}
});
