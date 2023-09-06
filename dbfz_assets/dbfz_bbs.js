var tags=[];
var tagsListed=[];
var searchables=[];
var searchablesOneColumnHack;
var db='./dbfz_assets/db_functions.json'

window.addEventListener('load', (event) => {
	loaddb();
});

function loaddb() {
	fetch(db)
		.then(response => response.json())
		.then(json => init(json));	
}

function init(t1) {	
	//populate table
	for (i=0; i<t1.length; ++i) {
		var row = document.createElement('tr');
		row.tabIndex = '1';
		
		//populate table: name_raw
		var newElement = document.createElement('td');
		newElement.classList.add('bbs_name_raw');
		newElement.innerHTML = Object.values(t1[i])[1];
		row.appendChild(newElement);
		
		//populate table: id
		var newElement = document.createElement('td');
		newElement.classList.add('bbs_id');
		newElement.innerHTML = Object.values(t1[i])[0];
		row.appendChild(newElement);
		
		//populate table: name_given
		var newElement = document.createElement('td');
		newElement.classList.add('bbs_name_given');
		newElement.innerHTML = Object.values(t1[i])[2];
		row.appendChild(newElement);
		
		//populate table: description
		var newElement = document.createElement('td');
		newElement.classList.add('bbs_text');
		newElement.innerHTML = Object.values(t1[i])[4];
		row.appendChild(newElement);
		
		//populate table: example and args block
		var newElement = document.createElement('td');
		var extraCheck = document.createElement('input');
		newElement.classList.add('bbs_extra');
		if ( Object.values(t1[i])[3] || Object.values(t1[i])[5] ) {
			var extraCheck = document.createElement('input');
			extraCheck.type = 'checkbox';
			newElement.appendChild(extraCheck);
			var block = document.createElement('div');
			block.classList.add('bbs_block');
			if ( Object.values(t1[i])[3] ) {
				var newElement_1 = document.createElement('pre');
				newElement_1.classList.add('bbs_args');
				newElement_1.innerHTML = Object.values(t1[i])[3];
				block.appendChild(newElement_1);
			}
			if ( Object.values(t1[i])[5] ) {
				var newElement_1 = document.createElement('pre');
				newElement_1.classList.add('bbs_example');
				var extraText = Object.values(t1[i])[5].replace(/\[/g, '<span class="code">');
				extraText = extraText.replace(/\]/g, '</span>');
				newElement_1.innerHTML = extraText;
				block.appendChild(newElement_1);
			}
			newElement.appendChild(block);
		} else {
			var extraCheck = document.createElement('input');
			extraCheck.type = 'checkbox';
			extraCheck.disabled = 'true';
			newElement.appendChild(extraCheck);
		}
		row.appendChild(newElement);
		
		//populate table: tags
		var newElement = document.createElement('td');
		var tagValue = Object.values(t1[i])[6];
		newElement.classList.add('bbs_tags');
		newElement.innerHTML = tagValue;
		row.appendChild(newElement);
		
		//create list of all tags that are encountered
		var tagSeperated = tagValue.split(',');
		tagSeperated.forEach(function(a) {
			if (a == '') {
				return;
			}
			if (tagsListed.indexOf(a) === -1) {
				tagsListed.push(a);
			}
		});
		
		//push table data to document
		document.getElementsByTagName('tbody')[0].appendChild(row);
	}
	
	//load tag buttons
	var tagBar = document.getElementById('taglist');
	for (i=0; i<tagsListed.length; ++i) {
		var newElement = document.createElement('a');
		newElement.href = '#';
		newElement.setAttribute('onclick','tagDisplay(\'' + tagsListed[i] + '\')');
		newElement.innerHTML = tagsListed[i];
		tagBar.appendChild(newElement);
	}
	
	//prepare data for tagDisplay and interactiveSearch	functions
	tags = 	document.getElementsByClassName('bbs_tags');

	searchables = Array.from(document.getElementsByClassName('bbs_name_raw'));
	searchables = searchables.concat(Array.from(document.getElementsByClassName('bbs_id')));
	searchables = searchables.concat(Array.from(document.getElementsByClassName('bbs_name_given')));
	
	//speedhax
	searchablesOneColumnHack = searchables.length / 3;
	for (i=0; i<searchables.length; ++i) {
		searchables[i].dataset.searchstring = searchables[i].innerHTML.toLowerCase();
	}
	
	//display all hidden table rows
	interactiveSearch('');
	
	//hide loading message
	document.getElementById('loading').style.display = "none";
}

function tagDisplay(tag) {
	//"all" was selected. Just display all data, then exit this function
	if ( tag == 'all' ) {
		for (i=0; i<tags.length; ++i) {
			tags[i].parentNode.style.display = 'table-row';
		}
		return;
	}
	
	//tag chosen. Hide any table rows that don't include it
	for (i=0; i<tags.length; ++i) {
		if(tags[i].innerHTML.includes(tag)) {
			tags[i].parentNode.style.display = 'table-row';
		} else {
			tags[i].parentNode.style.display = 'none';
		}
	}
}

function interactiveSearch(searchval) {
	//search is empty. Just display all data, then exit this function
	if ( searchval == "" ) {
		for (i=0; i<searchablesOneColumnHack; ++i) {
			searchables[i].parentNode.style.display = 'table-row';
		}
		return;
	}
		
	//actual search. Hide everything, then selectively display matching rows
	searchval = searchval.replace(/\W/g, '');
	searchval = searchval.toLowerCase();
	for (i=0; i<searchablesOneColumnHack; ++i) {
		searchables[i].parentNode.style.display = 'none';
	}
	for (i=0; i<searchables.length; ++i) {
		if(searchables[i].dataset.searchstring.includes(searchval)) {
			searchables[i].parentNode.style.display = 'table-row';
		}
	}
}

function changeMode(mode, elem) {
	tags = 	document.getElementsByClassName('modeHighlight');
	tags[0].classList.remove('modeHighlight');

	switch(mode){
		//functions
		case 0:
			elem.classList.add('modeHighlight');
			db='./dbfz_assets/db_functions.json';
			break;
		//upons
		case 1:
			elem.classList.add('modeHighlight');
			db='./dbfz_assets/db_upon.json';
			break;
		//variables
		case 2:
			elem.classList.add('modeHighlight');
			db='./dbfz_assets/db_variables.json';
			break;
		//variables
		case 3:
			elem.classList.add('modeHighlight');
			db='./dbfz_assets/db_objects.json';
			break;
	}
	
	document.getElementById('loading').style.display = 'flex';
	document.getElementById('bbs_table').innerHTML = '';
	document.getElementById('taglist').innerHTML = '';
	tags=[];
	tagsListed=[];
	searchables=[];
	loaddb()
}
