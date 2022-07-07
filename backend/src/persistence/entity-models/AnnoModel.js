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
		if (!data.VideoHash) {
			throw new Error("Video hash must be an provided");
		} else if (data.VideoHash.length !== 11) {
			throw new Error("VideoHash must be 11 characters");
		} else {
			this.VideoHash = data.VideoHash;
		}

		if (!data.Times.startTime) {
			throw new Error(" start times must be included");
		}
        if (!data.Times.endTime) {
			throw new Error(" end times must be included");
		}
        if (!data.CommentText.entry1) {
			throw new Error(" entry1 not filled ");
		}
        if (!data.CommentText.entry2) {
			throw new Error(" entry2 not filled ");
		}
        if (!data.CommentText.entry3) {
			throw new Error(" entry3 not filled ");
		}
        if (!data.CommentText.entry4) {
			throw new Error(" entry4 not filled ");
		}
        if (!data.CommentText.entry5) {
			throw new Error(" entry5 not filled ");
		}
        if (!data.CommentText.entry6) {
			throw new Error(" entry6 not filled ");
		}


		this.startTime = data.Times.startTime ;
		this.endTime = data.Times.endTime;
		this.entry1 = data.CommentText.entry1 ;
        this.entry2 = data.CommentText.entry2 ;
        this.entry3 = data.CommentText.entry3 ;
        this.entry4 = data.CommentText.entry4 ;
        this.entry5 = data.CommentText.entry5 ;
        this.entry6 = data.CommentText.entry6 ;

		// this.Comments = data.Comments;
	}
};
