const { ipcRenderer } = require("electron");
var detailsView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};

	// Mock Data
	var tips = ["It was good", "it was bad", "it was good"];

	// cache DOM elements
	function cacheDom() {
		DOM.$tipList = $("#tip-list");
		DOM.$submitTip = $("#submit-tip");
	}
	// bind events
	function bindEvents() {
		DOM.$submitTip.click(handleSubmit);
	}

	// handle click events
	function handleSubmit(e) {
		console.log("Sumbit!");
		console.log($("textarea").val());
	}
	// render DOM
	function renderTips() {
		for (var tipIndex in tips) {
			console.log(tips[tipIndex]);
			var contentIndex = parseInt(tipIndex) + 1;
			DOM.$tipList.append(
				$("<h4/>", {
					text: contentIndex + ". " + tips[tipIndex]
				})
			);
		}
	}
	/* =================== public methods ================== */
	// main init method
	function init() {
		cacheDom();
		bindEvents();
		renderTips();
		ipcRenderer.send("get-business-data", "");

		// Async message handler
		ipcRenderer.on("listen-business-data", (event, arg) => {
			console.log(arg);
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init
	};
})();
