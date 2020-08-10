const url = require("url");
const path = require("path");
const { ipcRenderer } = require("electron");
const { BrowserWindow } = require("electron").remote;

var businessView = (function () {
	// placeholder for cached DOM elements
	var DOM = {};
	var selectedOptions = { sortBy: "business_name" };
	var defaultOptions = { sortBy: "business_name" }; // set default sortBy
	// Data
	var states = [];
	var cities = [];
	var zipcodes = ["98682", "99163", "83701", "98684"];
	var catagories = ["Restaruant", "Cars", "Groceries", "Fast Food"];
	var businesses = [];
	var local_data = {};
	var getDistance = true;

	// cache DOM elements
	function cacheDom() {
		DOM.$userViewLink = $("#userView_link");
		DOM.$businessTable = $("#business-table");
		DOM.$businessTableColumns = $("#business-table-columns");
		DOM.$businessTableEntries = $("#business-table-entries");
		DOM.$states = $("#states");
		DOM.$cities = $("#cities");
		DOM.$zipcode = $("#zipcodes");
		DOM.$catagories = $("#catagories");
		DOM.$sortBy = $("#sortBy");
	}
	// bind events
	function bindEvents() {
		DOM.$states.change(handleStateSelection);
		DOM.$cities.change(handleCitySelection);
		DOM.$zipcode.change(handleZipCodeSelection);
		DOM.$catagories.change(handleCatagoriesSelection);
		DOM.$businessTable.on("click", "tr", handleBusinessSelection);
		DOM.$userViewLink.click(renderUserView);
		DOM.$sortBy.change(handleSortBySelection);
	}
	// handle click events
	function handleStateSelection(e) {
		selectedOptions.state = $(this).val();
		clearOptions(["cities", "zipcodes", "catagories", "businesses"]);
		renderCities();
	}

	function handleCitySelection(e) {
		selectedOptions.city = $(this).val();
		clearOptions(["zipcodes", "catagories", "businesses"]);
		renderZipCodes();
	}

	function handleZipCodeSelection(e) {
		selectedOptions.zipcode = $(this).val();
		clearOptions(["catagories", "businesses"]);
		renderCatagories();
	}

	function handleCatagoriesSelection(e) {
		selectedOptions.catagories = $(this).val();
		console.log(selectedOptions);
		clearOptions(["businesses"]);
		renderBusinessTable();
	}

	function handleBusinessSelection(e) {
		selectedOptions.business = $(this)[0].innerText.split("\t");
		renderDetails();
	}

	function handleSortBySelection(e) {
		selectedOptions.sortBy = $(this).val();
		if (Object.keys(selectedOptions).length >= 5) {
			renderBusinessTable();
		}
	}
	// render DOM
	function renderStates() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getStates",
		}).then(function (response) {
			states = [];
			for (var entry in response) {
				states.push(response[entry].state);
			}
			for (var stateIndex in states) {
				console.log(states[stateIndex]);
				DOM.$states.append(
					$("<option/>", {
						text: states[stateIndex],
						value: states[stateIndex],
					})
				);
			}
		});
		selectedOptions = defaultOptions;
	}

	function renderCities() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getCities",
			data: { state: selectedOptions.state },
		}).then(function (response) {
			cities = [];
			for (var entry in response) {
				cities.push(response[entry].city);
			}
			for (var cityIndex in cities) {
				console.log(cities[cityIndex]);
				DOM.$cities.append(
					$("<option/>", {
						text: cities[cityIndex],
						value: cities[cityIndex],
					})
				);
			}
		});
	}

	function renderZipCodes() {
		console.log("getting zips...");
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getZipcodes",
			data: { state: selectedOptions.state, city: selectedOptions.city },
		}).then(function (response) {
			zipcodes = [];
			console.log(response);
			for (var entry in response) {
				zipcodes.push(response[entry].postal_code);
			}
			for (var zipcodeIndex in zipcodes) {
				console.log(zipcodes[zipcodeIndex]);
				DOM.$zipcode.append(
					$("<option/>", {
						text: zipcodes[zipcodeIndex],
						value: zipcodes[zipcodeIndex],
					})
				);
			}
		});
	}

	function renderCatagories() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getCategories",
			data: {
				state: selectedOptions.state,
				city: selectedOptions.city,
				postal_code: selectedOptions.zipcode,
			},
		}).then(function (response) {
			catagories = [];
			for (var entry in response) {
				catagories.push(response[entry].category);
			}
			for (var catagoryIndex in catagories) {
				console.log(catagories[catagoryIndex]);
				DOM.$catagories.append(
					$("<option/>", {
						text: catagories[catagoryIndex],
						value: catagories[catagoryIndex],
					})
				);
			}
		});
	}

	function renderBusinessTableHeaders() {
		var mock_headers = [
			"#",
			"business name",
			"Address",
			"City",
			"State",
			"Distance",
			"Stars",
			"# Tips",
			"Total Checkin",
		];
		for (var headerIndex in mock_headers) {
			console.log(mock_headers[headerIndex]);
			DOM.$businessTableColumns.append(
				$("<th/>", {
					text: mock_headers[headerIndex],
					value: mock_headers[headerIndex],
					scope: "col",
				})
			);
		}
	}

	function renderBusinessTable() {
		console.log({
			state: selectedOptions.state,
			city: selectedOptions.city,
			postal_code: selectedOptions.zipcode,
			catagories: selectedOptions.catagories,
			sortBy: selectedOptions.sortBy,
		});

		if (getDistance == false) {
			$.ajax({
				method: "GET",
				url: "http://localhost:3000/getBusinesses",
				data: {
					state: selectedOptions.state,
					city: selectedOptions.city,
					postal_code: selectedOptions.zipcode,
					catagories: selectedOptions.catagories,
					sortBy: selectedOptions.sortBy,
				},
			}).then(function (response) {
				console.log(response);
				businesses = [];
				for (var entry in response) {
					businesses.push(response[entry]);
				}

				DOM.$businessTableEntries.empty();
				var entry = DOM.$businessTableEntries;
				let i = 1;
				for (var entryIndex in businesses) {
					distance = "N/A";
					console.log(getDistance);

					var $row = $("<tr></tr>");
					var $head = $("<td></td>").html(i);
					var $name = $("<td></td>").html(businesses[entryIndex].business_name);
					var $address = $("<td></td>").html(businesses[entryIndex].address);
					var $city = $("<td></td>").html(businesses[entryIndex].city);
					var $state = $("<td></td>").html(businesses[entryIndex].state);
					var $distance = $("<td></td>").html(distance);
					var $stars = $("<td></td>").html(businesses[entryIndex].stars);
					var $tips = $("<td></td>").html(businesses[entryIndex].num_tips);
					var $checkins = $("<td></td>").html(
						businesses[entryIndex].num_checkins
					);
					var $id = $('<td hidden="true"></td>').html(
						businesses[entryIndex].business_id
					);

					$row.append([
						$head,
						$name,
						$address,
						$city,
						$state,
						$distance,
						$stars,
						$tips,
						$checkins,
						$id,
					]);
					entry.append($row);
					i += 1;
				}
			});
		} else {
			$.ajax({
				method: "GET",
				url: "http://localhost:3000/getBusinessesWithDistance",
				data: {
					state: selectedOptions.state,
					city: selectedOptions.city,
					postal_code: selectedOptions.zipcode,
					catagories: selectedOptions.catagories,
					sortBy: selectedOptions.sortBy,
					user_id: local_data.user.user_info.user_id,
				},
			}).then(function (response) {
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
					var $address = $("<td></td>").html(businesses[entryIndex].address);
					var $city = $("<td></td>").html(businesses[entryIndex].city);
					var $state = $("<td></td>").html(businesses[entryIndex].state);
					var $distance = $("<td></td>").html(businesses[entryIndex].dist);
					var $stars = $("<td></td>").html(businesses[entryIndex].stars);
					var $tips = $("<td></td>").html(businesses[entryIndex].num_tips);
					var $checkins = $("<td></td>").html(
						businesses[entryIndex].num_checkins
					);
					var $id = $('<td hidden="true"></td>').html(
						businesses[entryIndex].business_id
					);

					$row.append([
						$head,
						$name,
						$address,
						$city,
						$state,
						$distance,
						$stars,
						$tips,
						$checkins,
						$id,
					]);
					entry.append($row);
					i += 1;
				}
			});
		}
	}

	function renderDetails() {
		// Synchronous message emmiter and handler
		ipcRenderer.send("set-business-data", { selectedOptions });

		// Async message handler
		ipcRenderer.on("reply-business-data", (event, arg) => {
			console.log("IPC Business RENDERER:");
			console.log(arg);
		});

		const win = new BrowserWindow({
			height: 600,
			width: 800,
			webPreferences: {
				nodeIntegration: true,
			},
		});

		win.loadURL(
			url.format({
				pathname: path.join(__dirname, "details.html"),
				protocol: "file:",
				slashes: true,
			})
		);
	}

	function renderUserView(e) {
		let win = BrowserWindow.getFocusedWindow();
		win.loadURL(
			url.format({
				pathname: path.join(__dirname, "userView.html"),
				protocol: "file:",
				slashes: true,
			})
		);
	}

	// Clear results
	function clearOptions(options) {
		tableOptions = ["cities", "zipcodes", "catagories", "businesses"]; // states always exists so they are excluded
		clearDOM = [
			DOM.$cities,
			DOM.$zipcode,
			DOM.$catagories,
			DOM.$businessTableEntries,
		];
		for (entry1 in options) {
			for (entry2 in tableOptions) {
				console.log(`${options[entry1]}, ${tableOptions[entry2]}`);
				if (options[entry1] == tableOptions[entry2]) {
					console.log(options[entry1] == tableOptions[entry2]);
					console.log(clearDOM[entry2]);
					clearDOM[entry2].empty();
					break;
				}
			}
		}
	}

	/* =================== public methods ================== */
	// main init method
	function init() {
		console.log("businessView init...");
		cacheDom();
		bindEvents();

		ipcRenderer.send("get-user-data", "");

		// Async message handler
		console.log("Getting user data:");
		ipcRenderer.on("listen-user-data", (event, arg) => {
			local_data = arg;
			if (
				Object.keys(local_data) == 0 ||
				arg.user.user_info.longitude == null ||
				arg.user.user_info.latitude == null
			) {
				getDistance = false;
			}
		});

		$(document).ready(function () {
			// document is loaded and DOM is ready
			renderStates();
			renderBusinessTableHeaders();
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init,
	};
})();
