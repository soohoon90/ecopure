
var app = {
	model: {
		claims: [],
		loadState: function(){
			this.state = JSON.parse(localStorage.getItem("state"));
			if (!this.state) this.state = {};
			if (!this.state.selectedClaim) this.state.selectedClaim = this.claims.length-1;
		},
		loadItemData: function(){
			this.items = iData;
			this.localItems = JSON.parse(localStorage.getItem("localItemData"));
			
			if (this.localItems){
				for (var c in localItems){
					for (var i in localItems[c]){
						this.items[c][i] = localItems[c][i];
					}
				}
			}
		},
		saveItemData: function(){
			localStorage.setItem("localItemData", this.localItems);
		}
	},
	view: {
		
	},
}


function Claim(name){
	this.name = name;
	this.created = new Date();
	this.rooms = [];
	this.addRoom = function(name){
		this.rooms.push(new Room(name));
	}
}

function Room(name){
	this.name = name;
	this.created = new Date();
	this.categorizedItems = {};
	this.addItem = function(c, i, n){
		if (!this.categorizedItems[c]) this.categorizedItems[c] = {};
		this.categorizedItems[c][i] += n;
	}

	this.removeItem = function(c, i){
		delete this.categorizedItems[c][i];
	}
}

var appModel = {
	claims: [],
	addClaim: function(name){
		claims.push(new Claim(name));
	},
	selectLatestClaim: function(){
		this.selectedClaim = claims[claims.length-1];
	},
};

var appView ={
	claimView: $("#claimsList"),
	roomView: $("#roomsList"),
	categoryView: $("#mainSideItems"),
	itemsView: $("#mainContentItems"),
	renderModalClaim: function(){

	},
	renderClaims: function(){
		claims = appm.claims;
		claimView.html("");
		var u = $("<ul>").appendTo(claimView);
		for (i in claims){
			var claim = claims[i];
			var dstring = claim.date.toDateString();
			$("<li>").html(claim.name + dstring)
		}
	},
	renderRooms: function(){

	},
	renderCategory: function(){

	},
	renderItems: function(){

	},
}
