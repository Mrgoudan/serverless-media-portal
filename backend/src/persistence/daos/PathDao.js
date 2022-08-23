const Dynamo = require("../storage/DynamoDb");


module.exports = class PathDao {
	static async Addpath(pathModel) {
		console.log(pathModel);
		const exitstence = {
			TableName: process.env.pathTableName,
        	FilterExpression: 'date = :V AND syncNum =:A AND videoName = :X',
        	ExpressionAttributeValues: {
         		 ":V": {S:pathModel["date"]},
				 ":A":{S:pathModel["syncNum"]},
				 ":X":{S:pathModel["videoName"]},
        		},
			};
		console.log(exitstence);
		try{
			console.log("in try statement");
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			console.log(result);
			// return result;
			if(result.Count!=0){
				var hs = result.Items[0].PathHash["S"]
				var params = {
					Key: {
					 "PathHash": {
					   S: hs
					  }, 
					 
					}, 
					TableName:process.env.pathTableName
				   };
				    new Dynamo().sdk.deleteItem(params, function(err, data) {
					 if (err) console.log(err, err.stack); // an error occurred
					 else     console.log(data); })

			}else{}
			return new Dynamo().AddItemToTable(
				process.env.pathTableName,
				pathModel
			);
		// const params = {
		// 	Item: {
		// 		"date":{
		// 			S:pathModel["date"]
		// 		},
		// 		"syncNum":{
		// 			S:pathModel["syncNum"]
		// 		},
		// 		"videoName":{
		// 			S:pathModel["videoName"]
		// 		}
		// 	},
		// 	TableName: process.env.pathTableName,
		// 	ReturnConsumedCapacity: "TOTAL", 
		// };
		// const out = await new Dynamo().GetSdk().putItem(params, function(err, data) {
		// 	console.log(err,data);
		// 	if (err) console.log(err, err.stack); // an error occurred
		// 	else     console.log(data);}).promise();
		// console.log(out);
			
		}catch(e){
			console.log("error when quering in videoDao",e);
		}
		
	}
}