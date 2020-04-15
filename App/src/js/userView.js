const url = require("url");
const path = require("path");
const { ipcRenderer } = require("electron");
const { BrowserWindow } = require("electron").remote;


var userView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};
	var selectedOptions = {};

	// cache DOM elements
	function cacheDom() {
		DOM.$businessViewLink = $("#businessView_link");
		DOM.$searchUsers = $("#search_users");
		DOM.$selectUser = $("#search_users_results");
		DOM.$friendsTable = $("#friends_table");
		DOM.$friendsTipTable = $("#friends_tip_table");

		DOM.$yelper_user_name= $("#user_name");
		DOM.$yelper_average_stars = $("#average_stars");
		DOM.$yelper_yelping_since = $("#yelping_since");
		DOM.$yelper_fans = $("#fans");
		DOM.$yelper_cool = $("#cool");
		DOM.$yelper_useful = $("#useful");
		DOM.$yelper_funny = $("#funny");
		DOM.$yelper_longitude = $("#longitude");
		DOM.$yelper_latitude = $("#latitude");
		DOM.$yelper_total_likes= $("#total_likes");
		DOM.$yelper_tip_count= $("#tip_count");
	}
	// bind events
	function bindEvents() {
		DOM.$searchUsers.change(handleUserSearch);
		DOM.$selectUser.change(handleUserSelection);
		DOM.$businessViewLink.click(renderBusinessView);
	}
	

	function handleUserSearch(e) {
		selectedOptions.user_name = $(this).val();
		renderUserIDs();
	}

	function handleUserSelection(e) {
		selectedOptions.user_id = $(this).val();
		renderUserInformation();
		//renderFriends();
		//renderFriendsTips();
	}
	
	// render DOM
	function renderUserIDs() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getUserIDs",
			data: {
				user_name: selectedOptions.user_name
			}
		}).then(function(response) {
			for (var entry in response) {
				user_id = response[entry].user_id;
				DOM.$selectUser.append(
					$("<option/>", {
						text: user_id,
						value: user_id
					})
				);
			}
		});
		selectedOptions = {};
	}

	function renderUserInformation() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getUser",
			data: {
				user_id: selectedOptions.user_id
			}
		}).then(function(response) {
			user_info = response[0];
			DOM.$yelper_user_name.val(user_info.user_name);
			DOM.$yelper_average_stars.val(user_info.average_stars);
			DOM.$yelper_yelping_since.val(user_info.yelping_since);
			DOM.$yelper_fans.val(user_info.fans);
			DOM.$yelper_cool.val(user_info.cool);
			DOM.$yelper_useful.val(user_info.useful);
			DOM.$yelper_funny.val(user_info.funny);
			DOM.$yelper_longitude.val(user_info.longitude);
			DOM.$yelper_latitude.val(user_info.latitude);
			DOM.$yelper_total_likes.val(user_info.total_likes);
			DOM.$yelper_tip_count.val(user_info.tip_count);
		});
		selectedOptions = {};
	}

	function renderFriends() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getFriends",
			data: {
				state: selectedOptions.state,
				city: selectedOptions.city,
				postal_code: selectedOptions.zipcode,
				catagories: selectedOptions.catagories
			}
		}).then(function(response) {
			console.log(response);
			businesses = [];
			for (var entry in response) {
				businesses.push(response[entry]);
			}

			DOM.$businessTableEntries.empty();
			var entry = DOM.$businessTableEntries;
			let i = 1;
			for (var entryIndex in businesses) {
				var $row = $("<tr></tr>");
				var $head = $("<td></td>").html(i);
				var $name = $("<td></td>").html(businesses[entryIndex].business_name);
				var $stars = $("<td></td>").html(businesses[entryIndex].stars);
				var $tips = $("<td></td>").html(businesses[entryIndex].num_tips);
				var $id = $('<td hidden="true"></td>').html(
					businesses[entryIndex].business_id
				);
				var $checkins = $("<td></td>").html(
					businesses[entryIndex].num_checkins
				);
				$row.append([$head, $name, $stars, $tips, $checkins, $id]);
				entry.append($row);
				i += 1;
			}
		});
	}

	function renderFriendsTips() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getFriendsTips",
			data: {
				state: selectedOptions.state,
				city: selectedOptions.city,
				postal_code: selectedOptions.zipcode,
				catagories: selectedOptions.catagories
			}
		}).then(function(response) {
			console.log(response);
			businesses = [];
			for (var entry in response) {
				businesses.push(response[entry]);
			}

			DOM.$businessTableEntries.empty();
			var entry = DOM.$businessTableEntries;
			let i = 1;
			for (var entryIndex in businesses) {
				var $row = $("<tr></tr>");
				var $head = $("<td></td>").html(i);
				var $name = $("<td></td>").html(businesses[entryIndex].business_name);
				var $stars = $("<td></td>").html(businesses[entryIndex].stars);
				var $tips = $("<td></td>").html(businesses[entryIndex].num_tips);
				var $id = $('<td hidden="true"></td>').html(
					businesses[entryIndex].business_id
				);
				var $checkins = $("<td></td>").html(
					businesses[entryIndex].num_checkins
				);
				$row.append([$head, $name, $stars, $tips, $checkins, $id]);
				entry.append($row);
				i += 1;
			}
		});
	}

	function renderBusinessView(e) {
		let win = BrowserWindow.getFocusedWindow();
		win.loadURL(
			url.format({
				pathname: path.join(__dirname, "userView.html"),
				protocol: "file:",
				slashes: true
			})
		);
	}

	/* =================== public methods ================== */
	// main init method
	function init() {
		console.log("userView init...");
		cacheDom();
		bindEvents();
		$(document).ready(function() {
			// document is loaded and DOM is ready

		});
	}
	/* =============== export public methods =============== */
	return {
		init: init
	};
})();
