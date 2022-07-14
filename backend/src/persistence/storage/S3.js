const AWS = require("aws-sdk");

module.exports = class S3 {
	constructor() {
		this.sdk = new AWS.S3();
	}

	GetSdk() {
		return this.sdk;
	}

	async GetPresignedUrlForVideoUpload(fileNameWithExtension) {
		const s3Params = {
			Bucket: process.env.videoBucketName,
			Key: fileNameWithExtension,
			Expires: 300,
			ContentType: "video/mp4",
			ACL: "public-read"
		};
		const uploadUrl = await this.sdk.getSignedUrlPromise("putObject", s3Params);

		return uploadUrl;
	}

	async DeleteVideo(fileNameWithExtension) {
		await this.sdk.deleteObject({
			Bucket: process.env.videoBucketName,
			Key: fileNameWithExtension
		}).promise();
	}

	async DeleteThumbnail(fileNameWithExtension) {
		await this.sdk.deleteObject({
			Bucket: process.env.imageBucketName,
			Key: fileNameWithExtension
		}).promise();
	}
	async GetAllFileFromVideoBicket(){
		const params ={
			Bucket: process.env.videoBucketName,
		}
		var allKeys = []

		await this.sdk.listObjectsV2(params, function(err, data) {
			console.log("alldata:",data);
			if (err){console.log(err, err.stack);} // an error occurred
			else{ var contents = data.Contents;
				contents.forEach(function (content) {
					allKeys.push(content.Key);
					console.log(content.Key);
				});
	
				

			}
		}).promise();
		console.log("all files:",allKeys);
		return allKeys;


	}

};
