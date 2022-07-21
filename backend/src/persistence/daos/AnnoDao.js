const Dynamo = require("../storage/DynamoDb");

const PRIMARY_KEY = "AnnooHash";

module.exports = class AnnoDao {
	// static async GetVideo(videoHash) {
	// 	return new Dynamo().GetRecordFromTable(
	// 		process.env.videoTableName,
	// 		PRIMARY_KEY,
	// 		videoHash
	// 	);
	// }

	// static async ListAllVideos() {
	// 	return new Dynamo().GetAllRowsFromTable(
	// 		process.env.videoTableName
	// 	);
	// }

	// static async GetVideosVisibleWithTags(tagList) {
	// 	//
	// }

	// static async DeleteVideo(videoHash) {
	// 	return new Dynamo().DeleteRowFromTable(
	// 		process.env.videoTableName,
	// 		PRIMARY_KEY,
	// 		videoHash
	// 	);
	// }
	static async GetAnnoData(FormData){
		console.log(FormData,"in Anno dao");
		const exitstence = {
			TableName: process.env.annoTableName,
        	FilterExpression: 'KidNumber = :V AND syncNum =:A AND eventNumber = :X',
        	ExpressionAttributeValues: {
         		 ":V": {S:FormData["KidNumber"]},
				 ":A":{S:FormData["syncNum"]},
				 ":X":{S:FormData["eventNumber"]},
        		},
			};
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			console.log(result);
			return result;

		}catch(e){
			console.log("error when quering in videoDao",e);
		}
	
	}
	static async AddAnno(annoModel) {
		const exitstence = {
			TableName: process.env.annoTableName,
        	FilterExpression: 'KidNumber = :V AND syncNum =:A AND eventNumber = :X',
        	ExpressionAttributeValues: {
         		 ":V": {S:annoModel.KidNumber},
				 ":A":{S:annoModel.syncNum},
				 ":X":{S:annoModel.eventNumber},
        		},
			};
		console.log(exitstence);
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			console.log(result);
			// return result;
			if(result.Count!=0){
				var hs = result.Items[0].AnnoHash["S"]
				// console.log(hs)
				// var params = {
				// 	ExpressionAttributeNames: {
				// 	 "#ST": "startTime", 
				// 	 "#ET": "endTime",
				// 	 "#TE":"textEntry"
				// 	}, 
				// 	ExpressionAttributeValues: {
				// 	 ":et": {
				// 	   S: annoModel.endTime
				// 	  }, 
				// 	 ":st": {
				// 	   S: annoModel.startTime
				// 	  },
				// 	  ":te": {
				// 		S: annoModel.textEntry
				// 	   }
				// 	}, 
					
				// 	Key: {
				// 	 "AnnoHash": hs 
			
				// 	}, 
				// 	ReturnValues: "ALL_NEW", 
				// 	TableName: process.env.annoTableName, 
				// 	UpdateExpression: "SET #ET = :ET, #ST = :st,#TE = :te",
				//    };
				//    console.log(params);
				//    return new Dynamo().sdk.updateItem(params);
				var params = {
					Key: {
					 "AnnoHash": {
					   S: hs
					  }, 
					 
					}, 
					TableName:process.env.annoTableName
				   };
				   new Dynamo().sdk.deleteItem(params, function(err, data) {
					 if (err) console.log(err, err.stack); // an error occurred
					 else     console.log(data); })

			}else{
				
			}
			return new Dynamo().AddItemToTable(
								process.env.annoTableName,
								annoModel
							);
		}catch(e){
			console.log("error when quering in videoDao",e);
		}
		
	}
};
