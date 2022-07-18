const getRandomString = require("../../utility/get-random-string");
module.exports = class AnnoModel {
	constructor(data) {
		if (!data) {
			throw new Error("No video data provided");
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
		if (!data.AnnoHash) {
			this.AnnoHash = getRandomString(11);
		} else if (data.AnnoHash.length !== 11) {
			throw new Error("AnnoHash must be 11 characters");
		} else {
			this.AnnoHash = data.VideoHash;
		}
		if (!data.syncNum) {
			throw new Error("syncNum must be provided");
		} else {
			this.syncNum = data.syncNum;
		}

		if (!data.Entries.startTime) {
			throw new Error(" start times must be included");
		}
        if (!data.Entries.endTime) {
			throw new Error(" end times must be included");
		}
        if (!data.Entries.textEntry) {
			throw new Error(" entry1 not filled ");
		}
        if (!data.eventNumber) {
			throw new Error(" eventNumber not filled ");
		}
        if (!data.KidNumber) {
			throw new Error(" KidNumber not filled ");
		}


		this.startTime = data.Entries.startTime ;
		this.endTime = data.Entries.endTime;
		this.textEntry = data.Entries.textEntry;
		this.eventNumber = data.eventNumber;
		this.KidNumber = data.KidNumber;


		// this.Comments = data.Comments;
	}
};
