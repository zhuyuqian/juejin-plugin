import { pageChange } from "./utils";
import "../../style/common.less";


chrome.runtime.onMessage.addListener(async (request, callback) => {
	let { from, event, data } = request;
	if (from !== "background") return;
	if (event === "page-change-complete") {
		pageChange();
	}
});
