const csv=require('csvtojson');
function getJazzIndex(csvFilePath,callback){
	console.log("the csv file is",csvFilePath)
	csv()
	.fromFile(csvFilePath)
	.then((jazzIndex)=>{
		console.log("returning index")
		callback(jazzIndex);
	})
}

module.exports = {getJazzIndex}