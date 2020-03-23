var mainView = (function() {
	// placeholder for cached DOM elements
	var DOM = {};
	var selectedOptions = {};

	// Mock Data
	var states = ["WA", "OR", "CA", "ID"];
	var cities = ["Portland", "Salem", "Hillsboro", "Beaverton"];
	var zipcodes = ["98682", "99163", "83701", "98684"];
	var catagories = ["Restaruant", "Cars", "Groceries", "Fast Food"];

	// cache DOM elements
	function cacheDom() {
		DOM.$businessTable = $("#business-table");
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
		renderCities();
	}

	function handleCitySelection(e) {
		selectedOptions.city = $(this).val();
		renderZipCodes();
	}

	function handleZipCodeSelection(e) {
		selectedOptions.zipcode = $(this).val();
		renderCatagories();
	}

	function handleCatagoriesSelection(e) {
		selectedOptions.catagories = $(this).val();
		console.log(selectedOptions);
	}

	function handleBusinessSelection(e) {
		console.log($(this));
		renderDetails();
	}
	// render DOM
	function renderStates() {
		for (var stateIndex in states) {
			console.log(states[stateIndex]);
			DOM.$states.append(
				$("<option/>", {
					text: states[stateIndex],
					value: states[stateIndex]
				})
			);
		}
	}

	function renderCities() {
		for (var cityIndex in cities) {
			console.log(cities[cityIndex]);
			DOM.$cities.append(
				$("<option/>", {
					text: cities[cityIndex],
					value: cities[cityIndex]
				})
			);
		}
	}

	function renderZipCodes() {
		for (var zipcodeIndex in zipcodes) {
			console.log(zipcodes[zipcodeIndex]);
			DOM.$zipcode.append(
				$("<option/>", {
					text: zipcodes[zipcodeIndex],
					value: zipcodes[zipcodeIndex]
				})
			);
		}
	}

	function renderCatagories() {
		for (var catagoryIndex in catagories) {
			console.log(catagories[catagoryIndex]);
			DOM.$catagories.append(
				$("<option/>", {
					text: catagories[catagoryIndex],
					value: catagories[catagoryIndex]
				})
			);
		}
	}

	function renderDetails() {
		const remote = require("electron").remote;
		const BrowserWindow = remote.BrowserWindow;
		const win = new BrowserWindow({
			height: 600,
			width: 800
		});

		win.loadFile("details.html");
	}

	/* =================== public methods ================== */
	// main init method
	function init() {
		console.log("mainView init...");
		cacheDom();
		console.log("DOM CACHED...");
		bindEvents();
		console.log("EVENTS Bounded...");
		$(document).ready(function() {
			// document is loaded and DOM is ready
			renderStates();
		});
	}
	/* =============== export public methods =============== */
	return {
		init: init
	};
})();
