const makeThumbnail = require("../application/misc/thumbnail-generation/make-thumbnail");
const runAfterDeploy = require("../use-cases/misc/run-after-deploy");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const addUnkownVideo = require("../../src/application/misc/Unkown-video-in-video-bucket")
const S3 = require("../../src/persistence/storage/S3")
const addPathToDb = require("../../src/use-cases/videos/addPathtoDb");

module.exports.handshake = async () => {
	return ResponseFactory.getSuccessResponse();
};

module.exports.thumbnailMaker = async event => {
	await makeThumbnail(event);
};
module.exports.VideoConverter = async event => {
	console.log("converter log",event);
	console.log(JSON.stringify(event));
	try{
		var config = event["Records"][0]["s3"]["object"]["key"];
		var conList = config.split("/");
		console.log(conList)

		await new S3().converteMedia(conList);
		// console.log(Text);
		return ResponseFactory.getSuccessResponse();
	}catch(e){
		return console.log("Error in mis/video converter ",e);
	}
	
	// await makeThumbnail(event);

};
module.exports.bucketMVT = async event => {
	console.log("converter log",event);
	console.log(JSON.stringify(event));
	try{
		var config = event["Records"][0]["s3"]["object"]["key"];
		var conList = config.split("/");

		var out = addPathToDb(conList);




		// console.log(Text);
		// return ResponseFactory.getSuccessResponse();
	}catch(e){
		console.log("Error in mis/video converter ",e);
	}
	
	// await makeThumbnail(event);

};


module.exports.syncVideo = async ()=>{
	console.log("reached herede");
	await addUnkownVideo();
	return ResponseFactory.getSuccessResponse();
}

module.exports.getFilePath = async()=>{
	try{
		const filePath =  await new S3().GetAllFileFromVideoBicket();
		return ResponseFactory.getSuccessResponse({filePath});
	}catch(e){
		return handleErrors("Error in mis/getFile path");
	}
}

module.exports.getSyncNum = async event=>{
	try{
		const { formData } = JSON.parse(event.body);
		const syncNum =  await new S3().getSyncNum(formData);
		console.log(syncNum)
		return ResponseFactory.getSuccessResponse({syncNum});
	}catch(e){
		return handleErrors("Error in mis/getFile path");
	}
}
module.exports.getVideoFileName = async event=>{
	try{
		const { formData } = JSON.parse(event.body);
		const syncNum =  await new S3().getVideoFileName(formData);
		console.log(syncNum)
		return ResponseFactory.getSuccessResponse({syncNum});
	}catch(e){
		return handleErrors("Error in mis/getFile path");
	}
}
module.exports.getKidText = async event=>{
	try{
		
		const{formData} = JSON.parse(event.body);
		const Text =  await new S3().getKidText(formData);
		console.log(Text);
		return ResponseFactory.getSuccessResponse({Text});
	}catch(e){
		return handleErrors("Error in mis/getText path");
	}
	

}

module.exports.runAfterDeploy = async event => {
	await runAfterDeploy();

	return {
		Message: "Below are the 3 properties you'll need to add to the frontend's .env file:",
		// ImageCloudfrontDomain: process.env.imageCloudfrontDomain,
		VideoCloudfrontDomain: process.env.videoCloudfrontDomain,
		ApiGatewayUrl: process.env.apiGatewayUrl
	};
};
