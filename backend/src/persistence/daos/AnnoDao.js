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

	static async AddAnno(annoModel) {
		return new Dynamo().AddItemToTable(
			process.env.annoTableName,
			annoModel
		);
	}
};
