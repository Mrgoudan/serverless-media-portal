const { DataBrew } = require("aws-sdk");
const Dynamo = require("../storage/DynamoDb");

const PRIMARY_KEY = "VideoHash";

module.exports = class VideoDao {
	static async GetVideo(videoHash) {
		return new Dynamo().GetRecordFromTable(
			process.env.videoTableName,
			PRIMARY_KEY,
			videoHash
		);
	}

	static async ListAllVideos() {
		return new Dynamo().GetAllRowsFromTable(
			process.env.videoTableName
		);
	}

	static async GetVideosVisibleWithTags(tagList) {
		//
	}

	static async DeleteVideo(videoHash) {
		return new Dynamo().DeleteRowFromTable(
			process.env.videoTableName,
			PRIMARY_KEY,
			videoHash
		);
	}

	static async AddVideo(videoModel) {
		return new Dynamo().AddItemToTable(
			process.env.videoTableName,
			videoModel
		);
	}
	static async VideoNameExits(name){
		console.log(name);
		const exitstence = {
			TableName: process.env.videoTableName,
        	FilterExpression: 'VideoFileName = :V',
        	ExpressionAttributeValues: {
         		 ":V": {S:name}
        		},
			};
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			return result && result.Count>0;

		}catch(e){
			console.log("error when quering in videoDao",e);
		}


		};
	
	static async GetVideoHash(name){		
		console.log(name,"in video dao");
		const exitstence = {
			TableName: process.env.videoTableName,
        	FilterExpression: 'VideoFileName = :V',
        	ExpressionAttributeValues: {
         		 ":V": {S:name}
        		},
			};
		try{
			const result = await new Dynamo().sdk.scan(exitstence).promise();
			return result;

		}catch(e){
			console.log("error when quering in videoDao",e);
		}
	}

}