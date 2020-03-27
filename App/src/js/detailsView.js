const { ipcRenderer } = require("electron");
var detailsView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};
	var local_data = {};
	// Mock Data
	var tips = [];
	var business_id = "";
	var user_id = "J9HamWsxKorlPGUAXy-M9Q";

	// cache DOM elements
	function cacheDom() {
		DOM.$tipList = $("#tip-list");
		DOM.$submitTip = $("#submit-tip");
		DOM.$businessName = $("#business-name");
	}
	// bind events
	function bindEvents() {
		DOM.$submitTip.click(handleSubmit);
	}

	// handle click events
	function handleSubmit(e) {
		console.log("Sumbit!");
		let tip_text = $("textarea").val();
		console.log(business_id, user_id, tip_text);
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/postTip",
			data: {
				user_id: user_id,
				business_id: business_id,
				tip_text: tip_text
			}
		}).then(function(response) {
			console.log(response);
		});
	}
	// render DOM
	function renderName() {
		console.log("Local Data");
		console.log(local_data);
		DOM.$businessName.append(local_data.info.selectedOptions.business[1]);
	}

	function renderTips() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinessID",
			data: {
				state: local_data.info.selectedOptions.state,
				city: local_data.info.selectedOptions.city,
				postal_code: local_data.info.selectedOptions.zipcode,
				business_name: local_data.info.selectedOptions.business[1]
			}
		}).then(function(response) {
			business_id = response[0].business_id;
			console.log(business_id);
			$.ajax({
				method: "GET",
				url: "http://localhost:3000/getTips",
				data: {
					business_id: response[0].business_id
				}
			}).then(function(res) {
				console.log(res);
				for (var entry in res) {
					tips.push(res[entry].tip_text);
				}
				for (var tipIndex in tips) {
					console.log(tips[tipIndex]);
					var contentIndex = parseInt(tipIndex) + 1;
					DOM.$tipList.append(
						$("<h4/>", {
							text: contentIndex + ". " + tips[tipIndex]
						})
					);
				}
			});
			/*for (var tipIndex in tips) {
				console.log(tips[tipIndex]);
				var contentIndex = parseInt(tipIndex) + 1;
				DOM.$tipList.append(
					$("<h4/>", {
						text: contentIndex + ". " + tips[tipIndex]
					})
				);
			}*/
		});
	}
	/* =================== public methods ================== */
	// main init method
	function init() {
		cacheDom();
		bindEvents();
		ipcRenderer.send("get-business-data", "");

		// Async message handler
		ipcRenderer.on("listen-business-data", (event, arg) => {
			local_data = arg;
		});

		$(document).ready(function() {
			// document is loaded and DOM is ready
			renderName();
			renderTips();
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init
	};
})();
