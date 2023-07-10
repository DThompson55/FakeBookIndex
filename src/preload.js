const electron = require('electron')
const ipc = electron.ipcRenderer;

window.addEventListener('DOMContentLoaded', () => {

	var dict = [];
	var keys = [];
	var searchLimit = 25;
	var books = [];
	books["NEWREAL1"] = {'offset':15};
	books["REALBK2"]  = {'offset':7};
	books["REALBK1"]  = {'offset':13};
	books["NEWREAL2"] = {'offset':12};
	books["LIBRARY"]  = {'offset':4};
	books["JAZZLTD"]  = {'offset':7};
	books["JAZZFAKE"] = {'offset':-1};
	books["EVANSBK"]  = {'offset':3};
	books["COLOBK"]   = {'offset':3};
	books["NEWREAL3"] = {'offset':10};
	books["REALBK3"]  = {'offset':5};
	books["CUBANBK1"]  = {'offset':8};


	const songLabel = document.querySelector("#songLabel");
	console.log(songLabel);
	songLabel.addEventListener('click', (event) => {
			const input = document.querySelector('#song_name');
			input.value = "";
			updateValues();
		}, false); 


	function getRealPage(book,page){
		var index = book.toUpperCase()
		if ( books[index] ) {
			console.log((books[index].offset)+parseInt(page));
			return ((books[index].offset)+parseInt(page));
		}
		return page;
	}

	const updateValues = () => {
		const input = document.querySelector('#song_name');

		var matches = [];
		for (var i = 0; i < keys.length; i++){
			if (keys[i].includes((input.value).toUpperCase())){
				matches.push(dict[keys[i]])
			}
		} 

		const r = document.getElementById("#songRow");

		clearSongText();

		if (matches.length == 0 ) {
			setSongMsg("No Matches");
		} else {
			if (matches.length == 1){
				if (matches[0].length == 0) {
					setSongMsg("BINGO!!!");
				} else {
					setSongMsg("BINGO - "+matches[0].length+" versions!!!");
				}

				for (var n = 0; n < matches[0].length; n++){
					setSongText(matches[0][n].title, matches[0][n].book, matches[0][n].page)
				}
			} else {
				if (matches.length < 6){
						var total = 0;
						for (i = 0 ; i < matches.length; i++ ){
							total += matches[i].length
						}
						setSongMsg(total+" matches/versions")
					for (i = 0 ; i < matches.length; i++ ){
						for (var n = 0; n < matches[i].length; n++){
							setSongText(matches[i][n].title, matches[i][n].book, matches[i][n].page)
						}
					}
		   		} else {
					if (matches.length <= searchLimit) {
						setSongMsg(matches.length+" matches",("(of "+matches.length+")"));
						for (i = 0 ; i < matches.length; i++ ){
							var s = "("+matches[i].length+")";
							setSongText((matches[i][0].title),s);
						}						
					} else {
						setSongMsg(matches.length+" matches",("(showing "+searchLimit+")"))
						for (i = 0 ; i < searchLimit; i++ ){
							var s = "("+matches[i].length+")";
							setSongText((matches[i][0].title),s);
						}												
					}
				}
			}
		}
	}

	const setSongText = (text,file=null,page=null) => {
		const t = document.querySelector("#songs");
		let r = document.createElement("div")// class="column">") 
		r.setAttribute("class", "trow");

		let c1 = document.createElement("span")// class="column">") 
			c1.innerHTML = (text);
			c1.setAttribute("class", "tcol_1");
			c1.addEventListener('click', (event) => {
				console.log("click 1")
				const input = document.querySelector('#song_name');
				input.value = text;
				updateValues();
			}, false);     

			r.appendChild(c1);

		// if (page != null){
		// let c3 = document.createElement("span")// class="column">") 
		// 	c3.innerHTML = page;
		// 	c3.setAttribute("class", "tcol");
		// 	c3.addEventListener('click', (event) => {
		// 		console.log('click c3');
		// 	}, false);     

		// 	r.appendChild(c3);
		// }

		let c2 = document.createElement("span")// class="column">") 
			c2.innerHTML = (file);
			c2.setAttribute("class", "tcol");
			let a1 = document.createElement('a'); 
				a1.setAttribute('href', "resources/"+file+".PDF#page="+getRealPage(file,page));
				a1.setAttribute('target', "_blank");
			a1.appendChild(c2);
			r.appendChild(a1);


		t.appendChild(r);

	}

	const clearSongText = () => {
		const r = document.querySelector("#songs");
		while (r.hasChildNodes()) {
				r.removeChild(r.firstChild);
		}
	}

	const setSongMsg = (text,limit=null) => {
		const r = document.querySelector("#songMsg");
		if (limit == null){
		r.innerHTML = (text);
		} else {
		r.innerHTML = (text+" "+limit);			
		}
		}

	ipc.on('load_index', (event, message) => {

		var jsonObj = JSON.parse(message);
	    for (var i = 0 ; i < jsonObj.length; i++){
	    	var key = (jsonObj[i].title).toUpperCase();
	    	if (!(dict[key])){
	 			dict[key] = [];
	   		}
			dict[key].push (jsonObj[i]);
	    }
	    keys = Object.keys(dict);

	    const msg = document.querySelector("#songMsg");
		msg.addEventListener('click', (event) => {
			var msg = document.querySelector("#songMsg").innerHTML;
			var n = msg.indexOf("matches");
			if (n>0){
				var s = msg.substr(0,n-1)
				if (searchLimit == parseInt(s)) {
					searchLimit = 25;
				} else {
					searchLimit = parseInt(s);
					if (searchLimit > 100) searchLimit = 25;
				}
				updateValues();
			}
			}, false);     

		const input = document.querySelector('#song_name');

		input.addEventListener("keyup", (event) => {
			if (event.isComposing || event.keyCode === 229) {
			return;
			}
			updateValues();

		})
	})
})

