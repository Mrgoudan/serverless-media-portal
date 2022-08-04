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
	async getKidText(formData){
		console.log(formData);
		const params ={
			Bucket: process.env.videoBucketName,
			Key:formData["date"]+"/mvt/map.txt",
		}
		console.log(params);
		var obj = {};
		const out = await this.sdk.getObject(params, function(err, data) {
			if (err) {console.log(err, err.stack);}
			else{
				var strData = data.Body.toString('ascii');
				console.log("Raw text:\n" + strData);
				
				var kids = strData.split("\n");
				for(let i in kids){
					var temp = kids[i].trim().split(" ");
					console.log(temp);
					obj[temp[0]] = temp[1];
				}
				console.log(obj);
				

		};
		
		}).promise();
		// console.log(out);
		return obj;
	}
};
