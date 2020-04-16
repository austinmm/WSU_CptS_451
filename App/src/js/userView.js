const url = require("url");
const path = require("path");
const { ipcRenderer } = require("electron");
const { BrowserWindow } = require("electron").remote;


var userView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};

	// cache DOM elements
	function cacheDom() {
		DOM.$businessViewLink = $("#businessView_link");
		DOM.$searchUsers = $("#search_users");
		DOM.$selectUser = $("#search_users_results");
		DOM.$editUserLocation = $("#edit_location");
		DOM.$updateUserLocation = $("#update_location");
		DOM.$friendsTable = $("#friends_table_entries");
		DOM.$friendsTipTable = $("#friends_tip_table_entries");

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
		DOM.$editUserLocation.click(handleUserLocationEdit);
		DOM.$updateUserLocation.click(handleUserLocationUpdate);
		DOM.$businessViewLink.click(renderBusinessView);
	}
	

	function handleUserSearch(e) {
		const user_name = $(this).val();
		renderUserIDs(user_name);
	}

	function handleUserSelection(e) {
		 const user_id = $(this).val();
		renderUserInformation(user_id);
		renderFriends(user_id);
		renderFriendsTips(user_id);
	}

	function handleUserLocationEdit(e) {
		$("#longitude").prop("disabled", false);
		$("#latitude").prop("disabled", false);
	}

	function handleUserLocationUpdate(e) {
		const user_id = DOM.$selectUser.val();
		const long = $("#longitude").val();
		const lat = $("#latitude").val();
		$("#longitude").prop("disabled", true);
		$("#latitude").prop("disabled", true);
		updateUserLocation(user_id, long, lat);
	}
	
	// render DOM
	function renderUserIDs(user_name) {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getUserIDs",
			data: {
				user_name: user_name
			}
		}).then(function(response) {
			DOM.$selectUser.html("");
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
	}

	function renderUserInformation(user_id) {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getUser",
			data: {
				user_id: user_id
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
	}

	function updateUserLocation(user_id, long, lat) {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/updateUserLocation",
			data: {
				user_id: user_id,
				long: long,
				lat: lat
			}
		}).then(function(response) {
			renderUserInformation(user_id);
		});
	}

	function renderFriends(user_id) {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getFriends",
			data: {
				user_id: user_id
			}
		}).then(function(response) {
			DOM.$friendsTable.html("");
			for (var entry in response) {
				user_info = response[entry];
				DOM.$friendsTable.append(
					`
					<tr>
						<td scope="col">${user_info.user_name}</td><!--Name-->
						<td scope="col">${user_info.total_likes}</td><!--Total Likes-->
						<td scope="col">${user_info.average_stars}</td><!--Avg Stars-->
						<td scope="col">${user_info.yelping_since}</td><!--Yelping Since-->
					</tr>
					`
				)
			}
		});
	}

	function renderFriendsTips(user_id) {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getFriendsTips",
			data: {
				user_id: user_id
			}
		}).then(function(response) {
			DOM.$friendsTipTable.html("");
			for (var entry in response) {
				tip_info = response[entry];
				DOM.$friendsTipTable.append(
					`
					<tr>
						<td scope="col">${tip_info.user_name}</td><!--Name-->
						<td scope="col">${tip_info.business_name}</td><!--Business-->
						<td scope="col">${tip_info.city}</td><!--City-->
						<td scope="col">${tip_info.tip_text}</td><!--Text-->
						<td scope="col">${tip_info.date_created}</td><!--Date-->
					</tr>
					`
				)
			}
		});
	}

	function renderBusinessView(e) {
		let win = BrowserWindow.getFocusedWindow();
		win.loadURL(
			url.format({
				pathname: path.join(__dirname, "businessView.html"),
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
