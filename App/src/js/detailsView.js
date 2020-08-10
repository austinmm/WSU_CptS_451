const { ipcRenderer } = require("electron");
var Chart = require("chart.js");

var detailsView = (function () {
	// placeholder for cached DOM elements
	var DOM = {};
	var local_data = {};
	var business_data = {};
	var selectedTip = {};
	// Mock Data
	var tips = [];
	var friendTips = [];
	var business_id = "";
	var user_id = "J9HamWsxKorlPGUAXy-M9Q";

	// cache DOM elements
	function cacheDom() {
		//DOM.$tipList = $("#tip-list");
		DOM.$submitTip = $("#submit-tip");
		DOM.$businessName = $("#business-name");
		DOM.$businessAddress = $("#business-address");
		DOM.$businessOpen = $("#business-open");
		DOM.$businessClose = $("#business-close");
		DOM.$businessCatagories = $("#business-catagories");
		DOM.$allTipsTable = $("#all-tips-table");
		DOM.$friendTipsTable = $("#friend-tips-table");
		DOM.$allTipsTableEntries = $("#all-tips-table-entries");
		DOM.$friendTipsTableEntries = $("#friend-tips-table-entries");
		DOM.$checkinChart = $("#checkins-chart");
		DOM.$submitCheckin = $("#submit-checkin");
		DOM.$submitLike = $("#submit-like");
	}

	// bind events
	function bindEvents() {
		DOM.$submitTip.click(handleSubmit);
		DOM.$submitLike.click(handleLike);
		DOM.$submitCheckin.click(handleCheckin);
		DOM.$allTipsTable.on("click", "tr", handleAllTipSelection);
		DOM.$friendTipsTable.on("click", "tr", handleFriendTipSelection);
	}

	// data retrevial
	function getBusinessData() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinessID",
			data: {
				state: local_data.info.selectedOptions.state,
				city: local_data.info.selectedOptions.city,
				postal_code: local_data.info.selectedOptions.zipcode,
				business_name: local_data.info.selectedOptions.business[1],
			},
		}).then(function (response) {
			business_data = response[0];
			console.log(`business_data: ${business_data}`);
			var selectedTip = {};
			var tips = [];
			var friendTips = [];
			renderDetails();
			renderTips();
			renderCheckins();
		});
	}

	// handle click events
	function handleSubmit(e) {
		console.log("Sumbit!");
		let tip_text = $("textarea").val();
		console.log({
			user_id: user_id,
			business_id: business_data.business_id,
			tip_text: tip_text,
		});
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/postTip",
			data: {
				user_id: user_id,
				business_id: business_data.business_id,
				tip_text: tip_text,
			},
		}).then(function (response) {
			console.log(`RESPONSE: ${response}`);
			renderTips();
		});
	}

	function handleLike(e) {
		console.log("Like!");
		console.log(selectedTip);
		if (selectedTip == {}) {
			return;
		}
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/likeTip",
			data: {
				business_id: business_data.business_id,
				user_id: selectedTip.user_id,
				like_count: selectedTip.like_count,
				tip_text: selectedTip.tip_text,
			},
		}).then(function (response) {
			location.reload(true);
		});
	}

	function handleCheckin(e) {
		console.log("Checkin!");
		$.ajax({
			method: "POST",
			url: "http://localhost:3000/postBusinessCheckin",
			data: {
				business_id: business_data.business_id,
			},
		}).then(function (response) {
			location.reload(true);
		});
	}

	function handleAllTipSelection(e) {
		console.log("Tip Selected");
		console.log(e);

		var user_id = $(this)[0].childNodes[2].attributes[0].value;
		var like_count = $(this)[0].children[3].innerText;
		var tip_text = $(this)[0].children[4].innerText;
		selectedTip = {
			user_id: user_id,
			like_count: like_count,
			tip_text: tip_text,
		};
	}

	function handleFriendTipSelection(e) {
		console.log("Tip Selected");
		console.log(e);

		var user_id = $(this)[0].childNodes[1].attributes[0].value;
		var tip_text = $(this)[0].children[3].innerText;
		var like_count = $(this)[0].children[2].innerText;
		selectedTip = {
			user_id: user_id,
			like_count: like_count,
			tip_text: tip_text,
		};
	}

	// render DOM
	function renderDetails() {
		DOM.$businessName.append(local_data.info.selectedOptions.business[1]);
		DOM.$businessAddress.append(business_data.address);

		// Get Date for open close times
		var date = new Date();
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		var current_day = days[date.getDay()];

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinessOpenCloseTime",
			data: {
				business_id: business_data.business_id,
				day_of_week: current_day,
			},
		}).then(function (response) {
			//console.log(response);
			if (response.length == 0) {
				DOM.$businessOpen.append("Not today");
				DOM.$businessClose.append("All Day");
			} else {
				DOM.$businessOpen.append(response[0].opens_at.split("-")[0]);
				DOM.$businessClose.append(response[0].closes_at.split("-")[0]);
			}
		});

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinessCategories",
			data: {
				business_id: business_data.business_id,
			},
		}).then(function (response) {
			//console.log(response);
			for (var category in response) {
				//console.log(response[category].category);
				DOM.$businessCatagories.append(
					$("<li/>", { text: response[category].category })
				);
			}
		});
	}

	function renderTips() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getTips",
			data: {
				business_id: business_data.business_id,
			},
		}).then(function (res) {
			console.log("Get Tips:");
			console.log(res);
			for (var entry in res) {
				var tip = {};
				var date_created = res[entry].date_created.split("T")[0];
				tip.date = date_created;
				tip.user_name = res[entry].user_name;
				tip.user_id = res[entry].user_id;
				tip.like_count = res[entry].like_count;
				tip.tip_text = res[entry].tip_text;
				tips.push(tip);
			}

			var entry = DOM.$allTipsTableEntries;
			let i = 1;
			for (var entryIndex in tips) {
				var $row = $("<tr></tr>");
				var $index = $("<td></td>").html(i);
				var $date = $("<td></td>").html(tips[entryIndex].date);
				var $user_name = $("<td></td>", {
					text: tips[entryIndex].user_name,
					value: tips[entryIndex].user_id,
				});
				var $like_count = $("<td></td>").html(tips[entryIndex].like_count);
				var $tip_text = $("<td></td>").html(tips[entryIndex].tip_text);
				var $user_id = $('<td style="display:none;"></td>').html(
					tips[entryIndex].user_id
				);

				$row.append([
					$index,
					$date,
					$user_name,
					$like_count,
					$tip_text,
					$user_id,
				]);
				entry.append($row);
				i += 1;
			}
		});

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getTipsFromFriends",
			data: {
				business_id: business_data.business_id,
				user_id: user_id,
			},
		}).then(function (res) {
			console.log("Get Tips Friends:");
			console.log(res);

			for (var entry in res) {
				var friendTip = {};
				var date_created = res[entry].date_created.split("T")[0];
				friendTip.date = date_created;
				friendTip.user_name = res[entry].user_name;
				friendTip.user_id = res[entry].user_id;
				friendTip.like_count = res[entry].like_count;
				friendTip.tip_text = res[entry].tip_text;
				friendTips.push(friendTip);
			}
			console.log(friendTips);

			var entryFriend = DOM.$friendTipsTableEntries;
			for (var entryIndex in friendTips) {
				var $rowFriend = $("<tr></tr>");
				var $dateFriend = $("<td></td>").html(friendTips[entryIndex].date);
				var $user_nameFriend = $("<td></td>", {
					text: friendTips[entryIndex].user_name,
					value: friendTips[entryIndex].user_id,
				});
				var $tip_textFriend = $("<td></td>").html(
					friendTips[entryIndex].tip_text
				);
				var $like_countFriend = $("<td></td>").html(
					friendTips[entryIndex].like_count
				);

				$rowFriend.append([
					$user_nameFriend,
					$dateFriend,
					$like_countFriend,
					$tip_textFriend,
				]);
				entryFriend.append($rowFriend);
			}
		});
	}

	function renderCheckins() {
		// TODO: Get Checkin data and render graph
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinessCheckins",
			data: {
				business_id: business_data.business_id,
			},
		}).then(function (res) {
			data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var index = 0; index < res.length; index++) {
				var entry = res[index];
				var month = entry.checkin_date.split("T")[0];
				month = month.split("-")[1];
				data[parseInt(month) - 1] += 1;
			}
			var chart = new Chart(DOM.$checkinChart, {
				type: "bar",
				data: {
					labels: [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"Octobor",
						"November",
						"December",
					],
					datasets: [
						{
							label: "# of Checkins Per Month",
							data: data,
							backgroundColor: [
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
								"rgba(54, 162, 235, 0.2)",
							],
							borderColor: [
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
								"rgba(54, 162, 235, 1)",
							],
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
								},
							},
						],
					},
				},
			});
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
			if (Object.keys(local_data).length == 2) {
				console.log(local_data);
				console.log(Object.keys(local_data).length);
				user_id = local_data.user.user_info.user_id;
			}
		});

		$(document).ready(function () {
			// document is loaded and DOM is ready
			getBusinessData();
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init,
	};
})();
