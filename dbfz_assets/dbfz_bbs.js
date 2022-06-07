var tagsListed=["all", "movement", "position", "meter", "assist", "attack", "hitstop", "super", "defense", "armor", "flow", "conditional", "sound", "ground", "camera", "cinematic", "ui", "model", "animation"];
var tags=[];
var searchables=[];
var searchablesOneColumnHack;

window.addEventListener('load', (event) => {
	fetch("https://dobosken.github.io/dbfz_bbs_lookup/dbfz_assets/function_database.json")
		.then(response => response.json())
		.then(json => init(json));
});

function init(t1) {
	//load tag buttons
	var tagBar = document.getElementById("alltags");
	for (i=0; i<tagsListed.length; ++i) {
		var newElement = document.createElement("a");
		newElement.href = "#";
		newElement.setAttribute("onclick","tagDisplay('" + tagsListed[i] + "')");
		newElement.innerHTML = tagsListed[i];
		tagBar.appendChild(newElement);
	}
	
	//populate table
	for (i=0; i<t1.length; ++i) {
		var row = document.createElement("tr");
		
		//populate table: name_raw
		var newElement = document.createElement("td");
		newElement.classList.add("bbs_name_raw");
		newElement.textContent = Object.values(t1[i])[1];
		row.appendChild(newElement);
		
		//populate table: id
		var newElement = document.createElement("td");
		newElement.classList.add("bbs_id");
		newElement.textContent = Object.values(t1[i])[0];
		row.appendChild(newElement);
		
		//populate table: name_given
		var newElement = document.createElement("td");
		newElement.classList.add("bbs_name_given");
		newElement.textContent = Object.values(t1[i])[2];
		row.appendChild(newElement);
		
		//populate table: description
		var newElement = document.createElement("td");
		newElement.classList.add("bbs_text");
		newElement.textContent = Object.values(t1[i])[4];
		row.appendChild(newElement);
		
		//populate table: example and args block
		var newElement = document.createElement("td");
		var extraCheck = document.createElement("input");
		newElement.classList.add("bbs_extra");
		if ( Object.values(t1[i])[3] || Object.values(t1[i])[5] ) {
			var extraCheck = document.createElement("input");
			extraCheck.type = "checkbox";
			newElement.appendChild(extraCheck);
			var block = document.createElement("div");
			block.classList.add("bbs_block");
			if ( Object.values(t1[i])[3] ) {
				var newElement_1 = document.createElement("pre");
				newElement_1.classList.add("bbs_args");
				newElement_1.textContent = Object.values(t1[i])[3];
				block.appendChild(newElement_1);
			}
			if ( Object.values(t1[i])[5] ) {
				var newElement_1 = document.createElement("pre");
				newElement_1.classList.add("bbs_example");
				newElement_1.textContent = Object.values(t1[i])[5];
				block.appendChild(newElement_1);
			}
			newElement.appendChild(block);
		} else {
			var extraCheck = document.createElement("input");
			extraCheck.type = "checkbox";
			extraCheck.disabled = "true";
			newElement.appendChild(extraCheck);
		}
		row.appendChild(newElement);
		
		//populate table: tags
		var newElement = document.createElement("td");
		newElement.classList.add("bbs_tags");
		newElement.textContent = Object.values(t1[i])[6];
		row.appendChild(newElement);
		
		//push table data to document
		document.getElementsByTagName("tbody")[0].appendChild(row);
	}
	
	//prepare data for tagDisplay and interactiveSearch	functions
	tags = 	document.getElementsByClassName("bbs_tags");

	searchables = Array.from(document.getElementsByClassName('bbs_name_raw'));
	searchables = searchables.concat(Array.from(document.getElementsByClassName('bbs_id')));
	searchables = searchables.concat(Array.from(document.getElementsByClassName('bbs_name_given')));
	
	//speedhax
	searchablesOneColumnHack = searchables.length / 3;
	for (i=0; i<searchables.length; ++i) {
		searchables[i].dataset.searchstring = searchables[i].innerHTML.toLowerCase();
	}
	
	//display all hidden table rows
	interactiveSearch("");
	
	//hide loading message
	document.getElementById("loading").style.display = "none";
}

function tagDisplay(tag) {
	//"all" was selected. Just display all data, then exit this function
	if ( tag == "all" ) {
		for (i=0; i<tags.length; ++i) {
			tags[i].parentNode.style.display = "table-row";
		}
		return;
	}
	
	//tag chosen. Hide any table rows that don't include it
	for (i=0; i<tags.length; ++i) {
		if(tags[i].innerHTML.includes(tag)) {
			tags[i].parentNode.style.display = "table-row";
		} else {
			tags[i].parentNode.style.display = "none";
		}
	}
}

function interactiveSearch(searchval) {
	//search is empty. Just display all data, then exit this function
	if ( searchval == "" ) {
		for (i=0; i<searchablesOneColumnHack; ++i) {
			searchables[i].parentNode.style.display = "table-row";
		}
		return;
	}
		
	//actual search. Hide everything, then selectively display matching rows
	searchval = searchval.replace(/\W/g, '');
	searchval = searchval.toLowerCase();
	for (i=0; i<searchablesOneColumnHack; ++i) {
		searchables[i].parentNode.style.display = "none";
	}
	for (i=0; i<searchables.length; ++i) {
		if(searchables[i].dataset.searchstring.includes(searchval)) {
			searchables[i].parentNode.style.display = "table-row";
		}
	}
}