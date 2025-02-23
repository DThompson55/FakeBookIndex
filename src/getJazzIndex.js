const csv=require('csvtojson');
function getJazzIndex(csvFilePath,callback){
	console.log("the csv file is",csvFilePath)
	csv()
	.fromFile(csvFilePath)
	.then((jazzIndex)=>{
		var attrs = {};
		
		jazzIndex.forEach((i)=>{
			if (attrs[i.title]){

			} else {
				attrs[i.title] = i.attribution;
			}
		})

		var n = 0;
		jazzIndex.forEach((i)=>{
			i.attribution = attrs[i.title];
			if (i.attribution !== ''){
				i.title += ' / '+i.attribution;
			}
		})
		callback(jazzIndex);
	})
}


function fixAttributions(index){

}


module.exports = {getJazzIndex}