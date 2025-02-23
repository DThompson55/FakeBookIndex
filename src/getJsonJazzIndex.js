const fs = require('fs')

function getJazzIndex(jsonFilePath,callback){
//	console.log("the json file is",jsonFilePath)
	
	fs.readFile(jsonFilePath,(err,data)=>{
		const jsonData = JSON.parse(data);
		jsonData.forEach((song)=>{

			var first = true;
			try {
				if (song.attribution !== "") song.attribution = "";
				song.annotation.works[0].relations.forEach((relation)=>{
					let name = relation.artist.name
					song.attribution += ((first)?(name):(", "+name));
					first = false;
				})
			} catch (error){
//				xxlog("error",error.msg,song,JSON.stringify(song.annotation,null,2));
				song.attribution += "no composer listed";
			}
		})
		callback(jsonData);		
	});
}


function tester(){
	getJazzIndex('resources/merged.json', (jsonData) =>{
		jsonData.forEach((i)=>{
			i.books.forEach((book)=>{

				console.log(book.book.padEnd(10, ' '),book.page.toString().padStart(3, '0'),i.title,"|",i.attribution);
			})
		})
	})
}


//tester();



module.exports = {getJazzIndex}