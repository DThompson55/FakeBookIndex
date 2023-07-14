//TESTER
const l = require('./Levenshtein.js');
const c = require('./getJazzIndex.js');
const fs= require('fs');

console.log("here");

//
// tester.js is run from the src directory
//
const csvFilePath='./resources/jazz_index.csv';

c.getJazzIndex(csvFilePath, (jsonObj)=>{	
	buildDictionary(jsonObj, (dict) =>{
		var keys = Object.keys(dict);
		synonyms = {};
		keys.forEach(key => {
			var syns = l.findPotentialMatches(key, keys, 2)
			if (syns.length >0 ){
				synonyms[key] = syns;
			}
		})

		fs.writeFile('./resources/synonyms.json',JSON.stringify(synonyms),err => {
			console.log("Done",err);
	    })
	})
})

function buildDictionary (jsonObj, callback) {
var dict = [];
    for (var i = 0 ; i < jsonObj.length; i++){
    	var key = (jsonObj[i].title).toUpperCase();
    	if (!(dict[key])){
 			dict[key] = [];
   		}
		dict[key].push (jsonObj[i]);
    }
    callback(dict);
}

