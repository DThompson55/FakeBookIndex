const csvFilePath='./src/resources/jazz index.csv'
const csv=require('csvtojson')


function getJazzIndex(callback){
	csv()
	.fromFile(csvFilePath)
	.then((jazzIndex)=>{
		callback(jazzIndex);
	})
}

module.exports = {getJazzIndex: getJazzIndex}