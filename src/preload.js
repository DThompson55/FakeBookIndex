const electron = require("electron");
const ipc = electron.ipcRenderer;

var synonyms;

window.addEventListener("DOMContentLoaded", () => {
	var dict = [];
	var keys = [];
	var searchLimit = 25;
	var books = [];
	books.NEWREAL1 = {"offset":15};
	books.REALBK2  = {"offset":7};
	books.REALBK1  = {"offset":13};
	books.NEWREAL2 = {"offset":12};
	books.LIBRARY  = {"offset":4};
	books.JAZZLTD  = {"offset":7};
	books.JAZZFAKE = {"offset":-1};
	books.EVANSBK  = {"offset":3};
	books.COLOBK   = {"offset":3};
	books.NEWREAL3 = {"offset":10};
	books.REALBK3  = {"offset":5};
	books.CUBANBK1  = {"offset":8};
	books.THEBOOK  = {"offset":0};
	books.STANDARD  = {"offset":0};
	books.BLUESBK  = {"offset":0};
	books.OPENBK  = {"offset":0};
	books.HLBOOK  = {"offset":-2};


	const songLabel = document.querySelector("#songLabel");
	songLabel.addEventListener("click", (event) => {
			const input = document.querySelector("#song_name");
			input.value = "";
			updateValues(false);
		}, false); 


	function getRealPage(book,page){
		var index = book.toUpperCase();
		if ( books[index] ) {
			return ((books[index].offset)+parseInt(page));
		}
		return page;
	}

	function wasMachts(matches, style=0){
//		console.log("wasMachts",style)
			var total = 0;
			var limit = searchLimit;
			matches.forEach((match)=>{
				match.forEach((subMatch)=>{
					if (subMatch.books) {
						total += subMatch.books.length;
					}
				});
			});
		
		matches.forEach((match)=>{
			match.forEach((subMatch)=>{
				if (style == 1) {
					if (subMatch.books) {
						subMatch.books.forEach((book)=>{
								setSongText(subMatch.title, subMatch.attribution, book.book, book.page);
						});
					}
				}
				if (style == 2) {
					
					if (subMatch.books) {
						setSongText(subMatch.title, subMatch.attribution, ("("+subMatch.books.length+")"));
						// subMatch.books.forEach((book)=>{
						// 		setSongText(subMatch.title, book.book, book.page);
						// });
					} else {
						setSongText(subMatch.title, subMatch.attribution);						
					}
				}
				if (style == 3){
						if (limit > 0){
						//if (subMatch.books) {
							setSongText(subMatch.title, subMatch.attribution, ("("+subMatch.books.length+")"));
							limit--;
//							setSongText(subMatch.title);
						}
					// if (subMatch.books) {
					// 	subMatch.books.forEach((book)=>{
					// 		setSongText(subMatch.title, "(xxx)");
					// 	});
					// }
				}
			
			});
		});
		return total;
	}

	function updateValues(exact=false) {
		const input = document.querySelector("#song_name");

		var matchSet = new Set();

		// for (var i = 0; i < keys.length; i++){
		// 	if (keys[i].includes((input.value).toUpperCase())){
		// 		console.log("x",keys[i],dict[keys[i]]);
		// 		matchSet.add(dict[keys[i]]);
		// 		count++;
		// 		if ( count > 10) break;
		// 	}
		//}
		var value = (input.value).toUpperCase();
		value = value.replace(/[!"#$%&"()*+,-./:;<=>?@[\]^_`{|}~]/g, "");

		if (exact){
			let i = 0;
			for (i = 0; i < keys.length; i++){
				if (keys[i] == (value ) ) {
					matchSet.add(dict[keys[i]]);
					break;
				} 
			}
			if (i == keys.length){
//					console.log("No Exact Match Found",i,keys.length);
			} else {
//					console.log("Exact Match Found",i,keys.length);
			}
		} else {
			let i = 0;
			var prevTitle = "";
			for (i = 0; i < keys.length; i++){
				if (keys[i].includes(value)){
						if (prevTitle !== dict[keys[i]][0].title)
							matchSet.add(dict[keys[i]]);
						prevTitle = dict[keys[i]][0].title;
						if (synonyms[keys[i]] !== undefined){
//							console.log(keys[i],synonyms[keys[i]]);
							synonyms[keys[i]].forEach((key)=>{
									if (dict[key] != undefined) { // old synonmym stuff might no longer be in the dictionary
										matchSet.add(dict[key]);
									}
							});
						}
						//}
				}
//				console.log(titleSet)
				// let titles = Array.from(titleSet);
				// for (i = 0 ; i < titles.length; i++){
				// 		let title = titles[i];
				// 		matchSet.add(dict[title]);					
				// }
			}
		}

		const r = document.getElementById("#songRow");

		clearSongText();

		let matches = Array.from(matchSet);

		if (matches.length == 0 ) {
			setSongMsg("No Matches");
		} else {
			if (matches.length == 1){
				if (matches[0][0].books.length == 0) {
					setSongMsg("BINGO!!!");
				} else {
					setSongMsg("BINGO - "+matches[0][0].books.length+" versions!!!");
				}
				matches[0].forEach((subMatch)=>{
					if (subMatch.books) {
						subMatch.books.forEach((book)=>{
							setSongText(subMatch.title, subMatch.attribution, book.book, book.page);
						});
					}
				});

			} else {
				if (matches.length < 6){
					let total = wasMachts(matches,1);
					setSongMsg(total+" matches/versions");
		   		} else {
					if (matches.length <= searchLimit) {
						let total = wasMachts(matches,2);
						setSongMsg(matches.length+" matches",("(of "+total+")"));
					} else {
						// console.log(matches[0])
						// console.log(matches[1])
						let total = wasMachts(matches,3);
						setSongMsg(total+" matches",("(showing "+searchLimit+")"));

					}
				}
			}
		}
	}



function setSongText(text, attribution="", file=null,page=null) {
	try{
//		console.log(text,file,page)
		const t = document.querySelector("#songs");
		let r = document.createElement("div")// class="column">") 
		r.setAttribute("class", "trow");

		let c1 = document.createElement("span")// class="column">") 
			c1.innerHTML = text+" / "+attribution;
			c1.setAttribute("class", "tcol_1");
			c1.addEventListener("click", (event) => {
//				console.log("click 1")
				const input = document.querySelector("#song_name");
				input.value = text;
				updateValues(true);
			}, false);     

			r.appendChild(c1);

			// if (page != null){
			// let c3 = document.createElement("span")// class="column">") 
			// 	c3.innerHTML = page;
			// 	c3.setAttribute("class", "tcol");
			// 	c3.addEventListener("click", (event) => {
			// 		console.log("click c3");
			// 	}, false);     

			// 	r.appendChild(c3);
			// }


			let c2 = document.createElement("span")// class="column">") 
				c2.innerHTML = (file || "XXX");
				c2.setAttribute("class", "tcol");

				if (page == null) {
					if (file != null){
						c2.addEventListener("click", (event) => {
							const input = document.querySelector("#song_name");
							input.value = text;
							updateValues(true);
						}, false);
						r.appendChild(c2);
					}
				} else	{
					let a1 = document.createElement("a"); 
						a1.setAttribute("href", "resources/"+file+".PDF#page="+getRealPage(file,page));
						a1.setAttribute("target", "_blank");
						c2.innerHTML = (file+"."+getRealPage(file,page));
					a1.appendChild(c2);
					r.appendChild(a1);
				}
				t.appendChild(r);
		}catch(error){
			console.log(error)
		}
	}

	function clearSongText() {
//		console.log("Clear")
		const r = document.querySelector("#songs");
		while (r.hasChildNodes()) {
				r.removeChild(r.firstChild);
	}}

	function setSongMsg(text,limit=null){
		const r = document.querySelector("#songMsg");
		if (limit == null){
			r.innerHTML = (text);
		} else {
			r.innerHTML = (text+" "+limit);			
		}
	}

	ipc.on("load_index", (event, message) => {

		var jsonObj = JSON.parse(message);
		let i = 0;
	    for (i = 0 ; i < jsonObj.length; i++){

	    	var key = (jsonObj[i].title).toUpperCase();
	    	key =key.replace(/[!"#$%&"()*+,-./:;<=>?@[\]^_`{|}~]/g, "");

	    	if (!(dict[key])){
	 			dict[key] = [];
	   		}
			dict[key].push (jsonObj[i]);
			key = (jsonObj[i].attribution).toUpperCase();
	    	if (!(dict[key])){
	 			dict[key] = [];
	   		}
			dict[key].push (jsonObj[i]);

	    }
	    keys = Object.keys(dict);

	    //console.log(dict)

	    const msg = document.querySelector("#songMsg");
		msg.addEventListener("click", (event) => {
			var msg = document.querySelector("#songMsg").innerHTML;
			var n = msg.indexOf("matches");
			if (n>0){
				var s = msg.substr(0,n-1)
				if (searchLimit == parseInt(s)) {
					searchLimit = 25;
				} else {
					searchLimit = parseInt(s);
					if (searchLimit > 100) {
						searchLimit = 25;
					}
				}
				updateValues(false);
			}
			}, false);     

		const input = document.querySelector("#song_name");

		input.addEventListener("keyup", (event) => {
			if (event.isComposing || event.keyCode === 229) {
			return;
			}
			updateValues(false);

		});

	});
});


ipc.on("load_synonyms", (event, message) => {
		synonyms = message;
});

function findPotentialMatches(input, list, threshold) {
  // Create an array to store potential matches
  const potentialMatches = [];

  // Iterate over each item in the list
  for (let i = 0; i < list.length; i++) {
    const listItem = list[i];

		const parts = listItem.split(" / "); // Note the double backslash to escape it
  	let shortListItem = (parts.length > 1)?parts[0]:listItem;

    if (shortListItem == input){ // don"t calculate the L-number for the original input value, which is part of the list
      continue;
    }
    
    if (Math.abs(input.length - listItem.length) > threshold ) continue;

    potentialMatches.push(listItem);
  }
  
  return potentialMatches;
}

