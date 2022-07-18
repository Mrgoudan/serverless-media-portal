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
		return new Dynamo().AddItemToTable(
			process.env.annoTableName,
			annoModel
		);
	}
};
