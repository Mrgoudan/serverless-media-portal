const AWS = require("aws-sdk");
module.exports = class S3 {
	constructor() {
		this.sdk = new AWS.S3();
		this.mediaconvert = new AWS.MediaConvert();
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
			Prefix: "MVT-3/",
			MaxKeys: 9999,
			Delimiter:"/",
		}
		var allKeys = []

		await this.sdk.listObjectsV2(params, function(err, data) {
			// console.log("alldata:",data);
			if (err){console.log(err, err.stack);return {}} // an error occurred
			else{ var contents = data.CommonPrefixes;
				contents.forEach(function (content) {
					var temp = content.Prefix.split("/");
					allKeys.push(temp[1]);
				});
			}
		}).promise();
		return allKeys;
	}
	async getVideoFileName(formData){
		const params ={
			Bucket: process.env.videoBucketName,
			Prefix: "MVT-3/"+formData["syncNum"]+"/",
			MaxKeys: 9999,
			
		}
		var allKeys = []

		await this.sdk.listObjectsV2(params, function(err, data) {
			// console.log("alldata:",data);
			if (err){console.log(err, err.stack);return {}} // an error occurred
			else{ 
				// console.log(data);
				var contents = data.Contents;
				contents.forEach(function (content) {
					// console.log(content);
					var temp = content.Key.split("/");
					allKeys.push(temp[3]);
				});
			}
		}).promise();
		return allKeys;
	}
	async getSyncNum(formData){
		const params ={
			Bucket: process.env.videoBucketName,
			Prefix: "MVT-3/"+formData["syncNum"]+"/",
			MaxKeys: 9999,
			Delimiter:"/",
		}
		var eventNum = 0

		await this.sdk.listObjectsV2(params, function(err, data) {
			// console.log("alldata:",data);
			if (err){console.log(err, err.stack);return {}} // an error occurred
			else{  var contents = data.CommonPrefixes;
				contents.forEach(function (content) {
					if (content["Prefix"].includes("sync")){
						eventNum=eventNum+1;
					}
				});
		}
				
			
		}).promise();
		console.log(eventNum);
		return eventNum;
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

	
	async converteMedia(conList){
		console.log(conList);
		var params={
			"Name": "test",
			"Settings": {
			  "TimecodeConfig": {
				"Source": "ZEROBASED"
			  },
			  "OutputGroups": [
				{
				  "Name": "File Group",
				  "Outputs": [
					{
					  "ContainerSettings": {
						"Container": "MP4",
						"Mp4Settings": {}
					  },
					  "VideoDescription": {
						"CodecSettings": {
						  "Codec": "H_264",
						  "H264Settings": {
							"MaxBitrate": 5000000,
							"RateControlMode": "QVBR",
							"SceneChangeDetect": "TRANSITION_DETECTION"
						  }
						}
					  },
					  "AudioDescriptions": [
						{
						  "CodecSettings": {
							"Codec": "AAC",
							"AacSettings": {
							  "Bitrate": 96000,
							  "CodingMode": "CODING_MODE_2_0",
							  "SampleRate": 48000
							}
						  }
						}
					  ]
					}
				  ],
				  "OutputGroupSettings": {
					"Type": "FILE_GROUP_SETTINGS",
					"FileGroupSettings": {
					  "Destination": "s3://playtag-korea/MVT-3/"+conList[0]
					}
				  }
				}
			  ],
			  "Inputs": [
				{
				  "AudioSelectors": {
					"Audio Selector 1": {
					  "DefaultSelection": "DEFAULT"
					}
				  },
				  "VideoSelector": {},
				  "TimecodeSource": "ZEROBASED",
				  "FileInput": "s3://serverless-media-portal-production-videobucket-1th5gsz2vhtih/"+conList[0]+"/"+conList[1]

				}
			  ]
			},
			"AccelerationSettings": {
			  "Mode": "DISABLED"
			},
			"StatusUpdateInterval": "SECONDS_60",
			"Priority": 0,
			"HopDestinations": []
		  }
		  

		
		// console.log(JSON.stringify(params));
		this.mediaconvert.createJob(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else     console.log(data);           // successful response
		}).promise();

	}
};
