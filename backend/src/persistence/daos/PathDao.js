const Dynamo = require("../storage/DynamoDb");


module.exports = class PathDao {
	static async Addpath(pathModel) {
		console.log(pathModel);
		// const exitstence = {
		// 	TableName: process.env.pathTableName,
        // 	FilterExpression: 'date = :V AND syncNum =:A AND videoName = :X',
        // 	ExpressionAttributeValues: {
        //  		 ":V": {S:pathModel["date"]},
		// 		 ":A":{S:pathModel["syncNum"]},
		// 		 ":X":{S:pathModel["videoName"]},
        // 		},
		// 	};
		// console.log(exitstence);
		// try{
		// 	console.log("in try statement");
		// 	const result = await new Dynamo().sdk.scan(exitstence).promise();
		// 	console.log(result);
		// 	// return result;
		// 	if(result.Count!=0){
		// 		var hs = result.Items[0].PathHash["S"]
		// 		var params = {
		// 			Key: {
		// 			 "PathHash": {
		// 			   S: hs
		// 			  }, 
					 
		// 			}, 
		// 			TableName:process.env.pathTableName
		// 		   };
		// 		    new Dynamo().sdk.deleteItem(params, function(err, data) {
		// 			 if (err) console.log(err, err.stack); // an error occurred
		// 			 else     console.log(data); })

		// 	}
		var params = {
			Item: {
				"date":{
					S:pathModel["date"]
				},
				"syncNum":{
					S:pathModel["syncNum"]
				},
				"videoName":{
					S:pathModel["videoName"]
				}
			},
			TableName: process.env.pathTableName
		};
		const out = await new Dynamo().sdk.putItem(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else     console.log(data);}).promise();
		console.log(out);
			
		// }catch(e){
		// 	console.log("error when quering in videoDao",e);
		// }
		
	}
}