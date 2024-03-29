const Dynamo = require("../storage/DynamoDb");


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
	static async getEvent(formData){
		console.log(formData["KidNumber"]);
		console.log(formData[0]);
		const exitstence={
			TableName : process.env.annoTableName,
			FilterExpression: 'KidNumber = :V AND syncNum =:A',
			ExpressionAttributeValues:{
				":V":{S:formData["KidNumber"]},
				":A":{S:formData["syncNum"]},
			},
		};
		console.log(exitstence);
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			console.log(result.Count);
			return result.Count;
		}catch(e){
			console.log("error when quering in annoDao for event number");
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
	static async DeleteAnno(formData) {
		const exitstence = {
			TableName: process.env.annoTableName,
        	FilterExpression: 'KidNumber = :V AND syncNum =:A AND eventNumber = :X',
        	ExpressionAttributeValues: {
         		 ":V": {S:formData["KidNumber"]},
				 ":A":{S:formData["syncNum"]},
				 ":X":{S:formData["eventNumber"]},
        		},
			};
		console.log(exitstence);
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			// console.log(JSON.stringify(result));
			// return result;

			
				let hs = result.Items[0].AnnoHash["S"]
				let params = {
					Key: {
					 "AnnoHash": {
					   S: hs
					  }, 
					 
					}, 
					TableName:process.env.annoTableName
				   };
			 console.log(params);
			// console.log(result);
			return new Dynamo().sdk.deleteItem(params, function (err, data) {
				if (err)
					console.log(err, err.stack); // an error occurred
				else
					console.log(data);
			}).promise();

		}catch(e){
			console.log("error when quering in videoDao",e);
		}
		
	}
	static async GetAnnoDetail(formData){
		// console.log(formData["KidNumber"]);
		// console.log(formData[0]);
		const exitstence={
			TableName : process.env.annoTableName,
			FilterExpression: 'syncNum =:A',
			ExpressionAttributeValues:{
				":A":{S:formData["syncNum"]},
			},
		};
		console.log(exitstence);
		try{
			const res =  await new Dynamo().sdk.scan(exitstence).promise();
			console.log(JSON.stringify(res));
			// console.log({res});
			return {res};
		}catch(e){
			console.log("error when quering in annoDao for event number");
		}
		
	}
	// static async getSyncNum(formData){
	// 	// console.log(formData["KidNumber"]);
	// 	// console.log(formData[0]);
	// 	var i = 0;
	// 	while(true){
	// 		const exitstence={
	// 			TableName : process.env.annoTableName,
	// 			FilterExpression: 'syncNum =:A',
	// 			ExpressionAttributeValues:{
	// 				":A":{S:formData["syncNum"]+"/sync00"+i},
	// 			},
	// 		};
	// 		try{
	// 			const res =  await new Dynamo().sdk.scan(exitstence).promise();
	// 			console.log(res);
	// 			if (res.Count!=0){
	// 				i=i+1;
	// 			}else{
	// 				break;
	// 			}
	// 			// annos.push(res.Items);
	// 		}catch(e){
	// 			console.log("error when quering in annoDao for event number");
	// 		}
	// 	}
	// 	console.log(i-1);
	// 	return i-1;
	// }
	static async GetAnnoWithData(formData){
		// console.log(formData["KidNumber"]);
		// console.log(formData[0]);
		var annos =[]
		for(let i =0;i<13;i++){
			const exitstence={
				TableName : process.env.annoTableName,
				FilterExpression: 'syncNum =:A',
				ExpressionAttributeValues:{
					":A":{S:formData["syncNum"]+"/sync00"+i},
				},
			};
			// console.log(exitstence);
			try{
				const res =  await new Dynamo().sdk.scan(exitstence).promise();
				// console.log(JSON.stringify(res));
				// console.log({res});
				annos.push(res.Items);
			}catch(e){
				console.log("error when quering in annoDao for event number");
			}
		}
		return annos;
	}
	static async getKidsEvent(formData){
		// console.log(formData["KidNumber"]);
		// console.log(formData[0]);
		const exitstence={
			TableName : process.env.annoTableName,
			FilterExpression: 'syncNum =:A',
			ExpressionAttributeValues:{
				":A":{S:formData["syncNum"]},
			},
		};
		console.log(exitstence);
		try{
			const res =  await new Dynamo().sdk.scan(exitstence).promise();
			// console.log(JSON.stringify(res));
			out = {}
			console.log(res);
			// for(let i in res["Items"]){
			// 	console.log("indb",res["Items"][i]);
				
			// }

			return res;
		}catch(e){
			console.log("error when quering in annoDao for event number");
		}
		
	}
	

};
