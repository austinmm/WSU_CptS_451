const url = require("url");
const path = require("path");
const { ipcRenderer } = require("electron");
var mainView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};
	var selectedOptions = {};

	// Data
	var states = [];
	var cities = [];
	var zipcodes = ["98682", "99163", "83701", "98684"];
	var catagories = ["Restaruant", "Cars", "Groceries", "Fast Food"];
	var businesses = [];

	// cache DOM elements
	function cacheDom() {
		DOM.$businessTable = $("#business-table");
		DOM.$businessTableColumns = $("#business-table-columns");
		DOM.$businessTableEntries = $("#business-table-entries");
		DOM.$states = $("#states");
		DOM.$cities = $("#cities");
		DOM.$zipcode = $("#zipcodes");
		DOM.$catagories = $("#catagories");
	}
	// bind events
	function bindEvents() {
		DOM.$states.change(handleStateSelection);
		DOM.$cities.change(handleCitySelection);
		DOM.$zipcode.change(handleZipCodeSelection);
		DOM.$catagories.change(handleCatagoriesSelection);
		DOM.$businessTable.on("click", "tr", handleBusinessSelection);
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
	// render DOM
	function renderStates() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getStates"
		}).then(function(response) {
			states = [];
			for (var entry in response) {
				states.push(response[entry].state);
			}
			for (var stateIndex in states) {
				console.log(states[stateIndex]);
				DOM.$states.append(
					$("<option/>", {
						text: states[stateIndex],
						value: states[stateIndex]
					})
				);
			}
		});
		selectedOptions = {};
	}

	function renderCities() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getCities",
			data: { state: selectedOptions.state }
		}).then(function(response) {
			cities = [];
			for (var entry in response) {
				cities.push(response[entry].city);
			}
			for (var cityIndex in cities) {
				console.log(cities[cityIndex]);
				DOM.$cities.append(
					$("<option/>", {
						text: cities[cityIndex],
						value: cities[cityIndex]
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
			data: { state: selectedOptions.state, city: selectedOptions.city }
		}).then(function(response) {
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
						value: zipcodes[zipcodeIndex]
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
				postal_code: selectedOptions.zipcode
			}
		}).then(function(response) {
			catagories = [];
			for (var entry in response) {
				catagories.push(response[entry].category);
			}
			for (var catagoryIndex in catagories) {
				console.log(catagories[catagoryIndex]);
				DOM.$catagories.append(
					$("<option/>", {
						text: catagories[catagoryIndex],
						value: catagories[catagoryIndex]
					})
				);
			}
		});
	}

	function renderBusinessTableHeaders() {
		var mock_headers = [
			"#",
			"business name",
			"stars",
			"num tips",
			"num checkin"
		];
		for (var headerIndex in mock_headers) {
			console.log(mock_headers[headerIndex]);
			DOM.$businessTableColumns.append(
				$("<th/>", {
					text: mock_headers[headerIndex],
					value: mock_headers[headerIndex],
					scope: "col"
				})
			);
		}
	}

	function renderBusinessTable() {
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/getBusinesses",
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

	function renderDetails() {
		const remote = require("electron").remote;
		const BrowserWindow = remote.BrowserWindow;

		// Synchronous message emmiter and handler
		ipcRenderer.send("set-business-data", { selectedOptions });

		// Async message handler
		ipcRenderer.on("reply-business-data", (event, arg) => {
			console.log(arg);
		});

		const win = new BrowserWindow({
			height: 600,
			width: 800,
			webPreferences: {
				nodeIntegration: true
			}
		});

		win.loadURL(
			url.format({
				pathname: path.join(__dirname, "details.html"),
				protocol: "file:",
				slashes: true
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
			DOM.$businessTableEntries
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
		console.log("mainView init...");
		cacheDom();
		bindEvents();
		$(document).ready(function() {
			// document is loaded and DOM is ready
			renderStates();
			renderBusinessTableHeaders();
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init
	};
})();
