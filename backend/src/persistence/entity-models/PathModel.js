const getRandomString = require("../../utility/get-random-string");
module.exports = class PathModel {
	constructor(data) {
		if (!data) {
			throw new Error("No path data provided");
		}

		// if (!data.Title || data.Title.length <= 0 || data.Title.length > 50) {
		// 	throw new Error("A valid title with max 50 chars must be provided");
		// }

		// if (!data.ViewCount) {
		// 	this.ViewCount = 0;
		// } else if (!Number.isInteger(Number(data.ViewCount)) || Number(data.ViewCount) < 0) {
		// 	throw new Error("View count must be an integer >= 0");
		// } else {
		// 	this.ViewCount = data.ViewCount;
		// }
		if (!data.PathHash) {
			this.PathHash = getRandomString(11);
		} else if (data.PathHash.length !== 11) {
            this.PathHash = getRandomString(11);
			// PathHash new Error("AnnoHash must be 11 characters");
		} else {
			this.PathHash = data.VideoHash;
		}
		if (!data.date) {
			throw new Error("syncNum must be provided");
		} else {
			this.date = data.date;
		}

		if (!data.syncNum) {
			throw new Error(" start times must be included");
		}
        if (!data.videoName) {
			throw new Error(" end times must be included");
		}



		this.syncNum = data.syncNum;
		this.videoName = data.videoName;



		// this.Comments = data.Comments;
	}
};
