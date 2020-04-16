$(document).ready(function(e) {
	if (this.URL.includes("userView.html")){
		userView.init();
	}
	else if (this.URL.includes("businessView.html")){
		businessView.init();
	}
});
