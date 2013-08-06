(function () {
    "use strict";
    
    var claimdata = {},
        itemData,
        localItemData = {},
        categorizedItems;
    
    function saveToSpreadsheet() {
        saveAs(
                  new Blob(
                        [itemsToCSV(false)]
                    , {type: "text/plain;charset=" + document.characterSet}
                )
                , "exported.csv"
            );
    }
    
    function saveToSpreadsheetWithPrice(){
        saveAs(
                  new Blob(
                      [itemsToCSV(true)]
                    , {type: "text/plain;charset=" + document.characterSet}
                )
                , "exported.csv"
            );
    }
    
    function saveItemsToCSV (){
        var rows = [];
    
        for (var c in itemData){
            for (var i in itemData[c]){
                var row = ""
                row += quoteString(c);
                row += ','+ quoteString(i);
                row += ','+ quoteString(itemData[c][i]);
                rows.push(row);
            }
        }
    
        var itemsDataBlob = rows.join("\r\n");
    
        saveAs(
              new Blob(
                  [itemsDataBlob]
                , {type: "text/plain;charset=" + document.characterSet}
            )
            , "itemDB_exported.csv"
        );
    }
    
    function loadItemsFromCSV(){
    
        // Get a reference to the fileList
        var files = !!this.files ? this.files : [];
        console.log(files);
    
        // If no files were selected, or no FileReader support, return
        if ( !files.length || !window.FileReader ) return;
    
           // Create a new instance of the FileReader
            var reader = new FileReader();
    
            // Read the local file as a DataURL
            reader.readAsText( files[0] );
    
            // When loaded, set image data as background of page
            reader.onloadend = function(){
                var csv = this.result;
                console.log(csv);
    
    
    
            }
    }
    
    function loadItemData(){
        itemData = iData;
        localItemData = JSON.parse(localStorage.getItem("localItemData"));
    
        if (!localItemData){
            localItemData = {};
        }
    
        for (var c in localItemData){
            for (var i in localItemData[c]){
                itemData[c][i] = localItemData[c][i];
            }
        }
    }
    
    function showCategories(){
        for (var c in iData){
            $("<a>").html(c).appendTo($("#categoryView"));
            //var items = iData[c];
        }
    };
    
    function showItemsForCategory(c){
        var items = itemData[c];
        var items2 = localItemData[c];
    
        // create div
        var u = $("<div>").attr("class", "items").addClass("clearfix");
        
        // populate div
        for (var i in items){
            var price = items[i];
            $("<a>").html("<p>"+i+"</p>").appendTo(u);
        }
    
        $("<a>").addClass("describeButton").html("<p>Add a new Item</p>").appendTo(u);
    
        // add div to dest
        $("#itemsView").html(u);
    }
    
    function setCategorizedItemCount( c, i, n ) {
    
        var claim = claimdata.claims[claimdata.selectedClaim];
        var r = claim.rooms[claimdata.selectedRoom];
    
        if (!r[c]) r[c] = {};
        if (!r[c][i]) r[c][i] = 0;
        var x = parseInt(n);
        
        if(x > 0){
            r[c][i] += x;
        }
        else {
            delete r[c][i];
        }
                
        saveClaimData();
        updateRoomlist();
    }
    
    function updateClaimlist(){
        var u = $("#claimList").html("");
        console.log("updating claim list");
        for (var i in claimdata.claims){
            var c = claimdata.claims[i];
            console.log(c);
            $("<div>").html( Date.parse(c.date) ).appendTo(u);
        }
    }
    
    function updateRoomlist(){
        var u = $("#roomList").html("");
        if (claimdata.selectedClaim){
            var claim = claimdata.claims[claimdata.selectedClaim];
    
            for (var i in claim.rooms){
                var r = claim.rooms[i];
                console.log(r);
                var totalItems = 0;
                var differentItems = 0;
                for (var c in r){
                    if (c != "name"){
                        for (var n in r[c]){
                            differentItems++;
                            totalItems += r[c][n];
                        }
                    }
                }
        
                var roomButtonText = "";
                roomButtonText += "Room #" + (parseInt(i)+1);
                if (r["name"]){
                    roomButtonText += "<br/>";
                    roomButtonText += r["name"];
                }
                roomButtonText += "<br/>";
                roomButtonText += "(" + differentItems + "/" + totalItems + ")";
        
        
                if (claimdata.selectedRoom == i){
                    $("<div>")
                    .html(roomButtonText)
                    .data("r", i)
                    .addClass("selected")
                    .appendTo(u);
                }else{
                    $("<div>")
                    .html(roomButtonText)
                    .data("r", i)
                    .appendTo(u);
                }
                
            }
        }
    }
    
    function updateSidebar(){
        var uu = $("#sidebar").html("");
        if (claimdata.selectedClaim){
            $("<h3>").html("Room #" + (parseInt(claimdata.selectedRoom)+1)).appendTo(uu);
        
            var claim = claimdata.claims[claimdata.selectedClaim];
            var room = claim.rooms[claimdata.selectedRoom];
        
            var totalItems = 0;
            var differentItems = 0;
            for (var c in room){
                if (c != "name"){
                    for (var n in room[c]){
                        differentItems++;
                        totalItems += room[c][n];
                    }
                }
            }
        
            // $("<h3>").html(differentItems + " different items. " + totalItems + " items total.").appendTo(uu);
        
            var u = $("<div>").appendTo(uu);
            var o = room;
        
            for (var c in o){
                if (c != "name"){
                    console.log(c);
                    $("<strong>").html(c).appendTo(u);
                    var uu = $("<ul>").appendTo(u);
                    for (var i in o[c]){
        
                        var num = o[c][i];
                        $("<li>")
                            .data("item", i)
                            .data("count", num)
                            .data("category", c)
                            .html("<span>"+num+"x </span> "+i)
                            .appendTo(uu);
                    }
                }
            }
        }
    }
    
    function quoteString(string){
        return '"'+string+'"';
    }
    
    function itemsToCSV(withPrice){
        var rows = [];
    
        var heading = "";
        heading += quoteString("Room Number");
        heading += "," + quoteString("Category");
        heading += "," + quoteString("Description");
        heading += "," + quoteString("Quantity");
        if (withPrice){
            heading += "," + quoteString("Price per Item");
            heading += "," + quoteString("Total Price");
        }
    
        rows.push(heading);
    
        var claim = claimdata.claims[claimdata.selectedClaim];
    
        for (var ri in claim.rooms){
            for (var c in claim.rooms[ri]){
                if (c != "name"){
                    for (var i in claim.rooms[ri][c]){
                        var row = ""
                        row += quoteString(parseInt(ri)+1);
                        row += ',' + quoteString(c);
                        row += ','+ quoteString(i);
                        row += ','+ quoteString(claim.rooms[ri][c][i]);
                        if (withPrice){
                            row += ',' + quoteString(itemData[c][i]);
                            row += ',' + quoteString(itemData[c][i] * claim.rooms[ri][c][i]);
                        }
    
                        rows.push(row);
                    }
                }
            }
        }
    
        return rows.join("\r\n");
    }
    
    function showModalForNewClaim(){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Creating new Claim")
            .appendTo(h);
    
        function doneThisModal(adjuster, company, insured, refn){
            if (!claimdata.claims) claimdata.claims = [];
    
            claimdata.claims.push({});
            claimdata.selectedClaim = claimdata.claims.length-1;
    
            var c = claimdata.claims[claimdata.selectedClaim];
    
            c.adjuster = adjuster;
            c.company = company;
            c.insured = insured;
            c.refn = refn;
            c.date = new Date();
            c.rooms = [];
    
            saveClaimData();
            updateRoomlist();
            updateSidebar();
            debug();
    
            $("#modal").hide();
            $(".contentView").hide();
            $("#itemizingView").show();
        }
    
        $("<label>").html("Adjuster<br/>").attr("for", "dainput1").appendTo(m);
    
        var dainput1 = $("<input>")
            .addClass("promptInput")
            .attr("id", "dainput1")
            .attr("placeholder", "adjuster")
            .appendTo(m);
    
        $("<label>").html("<br/>Company<br/>").attr("for", "dainput2").appendTo(m);
    
        var dainput2 = $("<input>")
            .attr("id", "dainput2")
            .addClass("promptInput")
            .attr("placeholder", "company")
            .appendTo(m);
    
        $("<label>").html("<br/>Insured<br/>").attr("for", "dainput3").appendTo(m);
    
        var dainput3 = $("<input>")
            .attr("id", "dainput3")
            .addClass("promptInput")
            .attr("placeholder", "insured")
            .appendTo(m);
    
        $("<label>").html("<br/>Ref #<br/>").attr("for", "dainput3").appendTo(m);
    
        var dainput4 = $("<input>")
            .attr("id", "dainput5")
            .addClass("promptInput")
            .attr("placeholder", "refn")
            .appendTo(m);
    
        $("<div>")
            .addClass("doneButton")
            .click(function(){ 
                doneThisModal(dainput1.val(),dainput2.val(),dainput3.val(),dainput4.val());
            })
            .html("add")
            .appendTo(f);
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
    }
    
    function showModalForNewRoom(){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Adding a New Room to this Claim")
            .appendTo(h);
    
        function doneThisModal(name){
                var c = claimdata.claims[claimdata.selectedClaim];
                console.log(c);
                c.rooms.push({});
                claimdata.selectedRoom = c.rooms.length-1;
                var r = c.rooms[claimdata.selectedRoom];
                r["name"] = name;
    
                saveClaimData();
                updateRoomlist();
                updateSidebar();
                $("#modal").hide();
        }
    
        var dainput = $("<input>")
            .addClass("promptInput")
            .attr("placeholder", "room description")
            .keypress(function(e){
                var key=e.keyCode || e.which;
                if (key==13){
                    doneThisModal(dainput.val());
                }
            })
            .appendTo(m);
    
        $("<div>")
            .addClass("doneButton")
            .click(function(){ 
                doneThisModal(dainput.val());
            })
            .html("add")
            .appendTo(f);
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
    }
    
    function showModalForSelectExistingClaim(){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Switch claim you are working on:")
            .appendTo(h);
    
        for (var i in claimdata.claims){
            
            var d = new Date(claimdata.claims[i].date);
            var s = "";
            s += "claim #:" + claimdata.claims[i].claimn + "";
            s += " by ref#:" + claimdata.claims[i].refn + "<br/>";
            s += "adjuster:" + claimdata.claims[i].adjuster + " company: " + claimdata.claims[i].company + "<br/>";
            s += " with " + claimdata.claims[i].rooms.length + " rooms <br/>";
            // s += "created at " + d.toUTCString();
            
    
            $("<div>")
                .addClass("claimButton")
                .html(s)
                .data("i", i)
                .click(function(){
                    claimdata.selectedClaim = $(this).data("i");
                    updateRoomlist();
                    claimdata.selectedRoom = claimdata.claims[claimdata.selectedClaim].rooms.length-1;
                    updateSidebar();
                    $("#modal").hide();
                })
                .appendTo(m);
        }
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
    }
    
    function showModalForSwitchingClaim(){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Switch claim you are working on:")
            .appendTo(h);
    
        for (var i in claimdata.claims){
            
            var d = new Date(claimdata.claims[i].date);
            var s = "";
            s += "claim #:" + claimdata.claims[i].claimn + "";
            s += " by ref#:" + claimdata.claims[i].refn + "<br/>";
            s += "adjuster:" + claimdata.claims[i].adjuster + " company: " + claimdata.claims[i].company + "<br/>";
            s += " with " + claimdata.claims[i].rooms.length + " rooms <br/>";
            // s += "created at " + d.toUTCString();
            
    
            $("<div>")
                .addClass("claimButton")
                .html(s)
                .data("i", i)
                .click(function(){
                    claimdata.selectedClaim = $(this).data("i");
                    updateRoomlist();
                    claimdata.selectedRoom = claimdata.claims[claimdata.selectedClaim].rooms.length-1;
                    updateSidebar();
                    $("#modal").hide();
                })
                .appendTo(m);
        }
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
    }
    
    function showModalForNewItem(c){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Adding a new item descryption for " + c + " category")
            .appendTo(h);
    
        var doneThisModal = function(i){
            var category = c;
            var item = i;
            if (confirm("add '" + item + "' for " + c + " category?")){
                if (!localItemData) localItemData = {};
                if (!localItemData[c]) localItemData[c] = {};
                localItemData[c][i] = daprice.val();
                console.log(localItemData);
    
                localStorage.setItem("localItemData", JSON.stringify(localItemData));
    
                showItemsForCategory(c,$("#itemsView"));
                $("#modal").hide();
                loadItemData();
                showItemsForCategory(c);
                showModalForAddItem(category,item);
            }
        }
    
        var dainput = $("<input>")
            .addClass("promptInput")
            .attr("placeholder", "item descryption")
            .data("c",c)
            .keypress(function(e){
                var key=e.keyCode || e.which;
                if (key==13){
                    doneThisModal(dainput.val());
                }
            })
            .appendTo(m);
    
        $("<br>").appendTo(m);
    
        $("<label>").html("$").appendTo(m);
    
        var daprice = $("<input>")
            .attr("type", "number")
            .val(10)
            .data("c",c)
            .appendTo(m);
    
        $("<div>")
            .addClass("doneButton")
            .click(function(){ 
                doneThisModal(dainput.val());
            })
            .html("add")
            .appendTo(f);
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
        dainput.focus();
    }
    
    function showModalForAddItem(c,i){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Adding how many " + i + " item (" + c + ")?")
            .appendTo(h);
    
        var dainput = $("<div>")
            .addClass("promptInput")
            .data("c",c)
            .data("i",i)
            .html("")
            .keypress(function(e){
                var key=e.keyCode || e.which;
                if (key==13){
                    var category = $(this).data("c");
                    var item = $(this).data("i");
                    var num = $(this).html();
                    if (num){
                        setCategorizedItemCount(category, item, num);
                        updateSidebar();
                    }
                    $("#modal").hide();
                }
            })
            .appendTo(m);
    
        for (var i=1; i <= 10; i++){
            var j;
            (i == 10) ? j = 0 : j = i;
    
            $("<div>")
                .addClass("numButton")
                .click(function(){
                    var d = dainput.html();
                    var dd = $(this).html();
                    dainput.html(d+dd);
                })
                .html(j)
                .appendTo(m);
    
            if (i % 3 == 0){
                $("<br>").appendTo(m);
            }
        }
    
        $("<div>")
            .addClass("numButton")
            .click(function(){
                dainput.html("");
            })
            .html("CLEAR")
            .appendTo(m);
    
        $("<div>")
            .addClass("doneButton")
            .click(function(){ 
                var inputElement = $("#modalContent .promptInput");
                var category = inputElement.data("c");
                var item = inputElement.data("i");
                var num = inputElement.html();
                if (num > 0){
                    setCategorizedItemCount(category, item, num);
                    updateSidebar();
                }
                $("#modal").hide();
            })
            .html("add")
            .appendTo(f);
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){ $("#modal").hide(); })
            .html("cancel")
            .appendTo(f);
    
        $("#modal").show();
        //$("#modalContent input").focus();
    
    }
    
    function showModalForChangeItem(c,i){
        var h = $("#modalHeader").html("");
        var m = $("#modalContent").html("");
        var f = $("#modalFooter").html("");
    
        $("<h2>")
            .html("Update number for " + i + " item (" + c + ")?")
            .appendTo(h);
    
        var dainput = $("<div>")
            .addClass("promptInput")
            .data("c",c)
            .data("i",i)
            .html("")
            .keypress(function(e){
                var key=e.keyCode || e.which;
                if (key==13){
                    var category = $(this).data("c");
                    var item = $(this).data("i");
                    var num = $(this).html();
                    if (num){
                        setCategorizedItemCount(category, item, num);
                        updateSidebar();
                    }
                    $("#modal").hide();
                }
            })
            .appendTo(m);
    
        for (var i=1; i <= 10; i++){
            var j;
            (i == 10) ? j = 0 : j = i;
    
            $("<div>")
                .addClass("numButton")
                .click(function(){
                    var d = dainput.html();
                    var dd = $(this).html();
                    dainput.html(d+dd);
                })
                .html(j)
                .appendTo(m);
    
            if (i % 3 == 0){
                $("<br>").appendTo(m);
            }
        }
    
        $("<div>")
            .addClass("numButton")
            .click(function(){
                dainput.html("");
            })
            .html("CLEAR")
            .appendTo(m);
    
        $("<div>")
            .addClass("doneButton")
            .click(function(){ 
                var inputElement = $("#modalContent .promptInput");
                var category = inputElement.data("c");
                var item = inputElement.data("i");
                var num = inputElement.html();
                if (num > 0){
                    setCategorizedItemCount(category, item, num);
                    updateSidebar();
                }
                $("#modal").hide();
            })
            .html("add")
            .appendTo(f);
    
        $("<div>")
            .addClass("cancelButton")
            .click(function(){
                var inputElement = $("#modalContent .promptInput");
                var category = inputElement.data("c");
                var item = inputElement.data("i");
                var num = inputElement.html();
                setCategorizedItemCount(category, item, 0);
                updateSidebar();
            })
            .html("delete")
            .appendTo(f);
        
        $("#modal").show();
        //$("#modalContent input").focus();
    }
    
    
    
    function promptForNumberOfItems(c,i){
    
        if (false) {
            var num = prompt("How many " + i + " (" + c + ")?", "");
        }else{
            showModalForPrompt(c,i);
        //	$("#modalContent input").focus();
        }
    
        return num;
    }
    
    function newClaim(name, address){
        if (!claimdata.claims) claimdata.claims = [];
    
        claimdata.claims.push({});
        claimdata.selectedClaim = claimdata.claims.length-1;
    
        var c = claimdata.claims[claimdata.selectedClaim];
        
        c.name = name;
        c.address = address;
    
        c.date = new Date();
        c.rooms = [];
        c.rooms.push({});
    
        claimdata.selectedRoom = 0;
    
        saveClaimData();
        updateRoomlist();
        updateSidebar();
        debug();
    }
    
    function newRoom(){
        var c = claimdata.claims[claimdata.selectedClaim];
        console.log(c);
        c.rooms.push({});
        claimdata.selectedRoom = c.rooms.length-1;
    
        saveClaimData();
        updateRoomlist();
        updateSidebar();
        debug();
    }
    
    function saveClaimData(){
        localStorage.setItem("claimdata", JSON.stringify(claimdata));
    }
    
    function debug(){
        console.log(claimdata);
    }
    
    function startItemizing(i){
        claimdata.selectedClaim = i;
        updateRoomlist();
        claimdata.selectedRoom = claimdata.claims[claimdata.selectedClaim].rooms.length-1;
        updateSidebar();
        
        showCategories();
    
        showItemsForCategory("Pants");
        $("#categoryView a:first-child").addClass("selected");
        
        $(".contentView").hide();
        $("#itemizingView").show();
    }
    
    function updateStartExistingClaims(){
        var u = $("#existingClaims").html("");
        for (var i in claimdata.claims){
            
            var d = new Date(claimdata.claims[i].date);
            var s = "";
            s += "for " + claimdata.claims[i].name;
            s += " at " + claimdata.claims[i].address;
            s += "with " + claimdata.claims[i].rooms.length + " rooms <br/>";
            
            // s += "created at " + d.toUTCString();
            
    
            $("<div>")
                .addClass("claimButton")
                .html(s)
                .data("i", i)
                .click(function(){
                    startItemizing(i);
                })
                .appendTo(u);
        }
    }
    
    $(function(){
    
        loadItemData();
        
        if (localStorage.getItem("claimdata")){
            claimdata = JSON.parse(localStorage.getItem("claimdata"));
            if (!claimdata.claims) claimdata.claims = [];
                
            debug();
        }
        /*
        else{
            newClaim();
            saveClaimData();	
        }
        */
        
        updateRoomlist();
    
        $("#newClaimButton").click(function(){
            var name = $("#newClaimName").val();
            var address = $("#newClaimAdress").val();
            
            if (confirm("new claim for " + name + " at " + address + "?")){
                newClaim(name, address);
                updateStartExistingClaims();
            }
        });
        
        $("#deleteLast").click(function(){
            currentItems.pop();
            updateItemsList();
        });
    
        $("#debugDelete").click(function(){
            if (confirm("delete everything and start over?")){
                claimdata = {};
                saveClaimData();
                showModalForNewClaim();
            }
        });
    
        $("#debugOut").click(function(){
            debug();
        });
    
        $("#addNewClaim").click(showModalForNewClaim);
        $("#selectExistingClaim").click(showModalForSelectExistingClaim);
        $("#switchClaim").click(showModalForSwitchingClaim);
        $("#newRoom").click(showModalForNewRoom);
        $("#exportData").click(saveToSpreadsheet);
        $("#exportDataWithPrice").click(saveToSpreadsheetWithPrice);
        $("#exportItems").click(saveItemsToCSV);
    
        $("#modalContent").click(function(e){ e.stopPropagation(); });
        $("#modal").click(function(){ $(this).hide(); });
    
        $("#importItemsFileSelect").on("change", loadItemsFromCSV);
    
        // Selecting item
        $(document).on("click","#itemsView .items a", function(){
            var item = $(this).text();
            var category = $("#categoryView a.selected").text();
            showModalForAddItem(category, item);
        });
    
        $(document).on("click","#itemsView .items a.describeButton", function(){
            var category = $("#categoryView a.selected").text();
            showModalForNewItem(category);
        });
    
        // Selecting category
        $(document).on("click","#categoryView a", function(){
            $("#categoryView a").removeClass("selected");
            $(this).addClass("selected");
            var t = $(this).html();
            showItemsForCategory(t);
        });
    
        $(document).on("click","#roomList div", function(){
            var r = $(this).data("r");
            console.log(r);
            claimdata.selectedRoom = r;
            saveClaimData();
            updateSidebar();
            updateRoomlist();
        });
    
    
        $(document).on("click", "#sidebar ul li", function(){
            var c = $(this).data("category");
            var i = $(this).data("item");
            var n = $(this).data("item");
            showModalForChangeItem(c, i);
        });
    
        $("#startView").show();
        updateStartExistingClaims();
    });

})();