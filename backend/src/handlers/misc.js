const makeThumbnail = require("../application/misc/thumbnail-generation/make-thumbnail");
const runAfterDeploy = require("../use-cases/misc/run-after-deploy");
const ResponseFactory = require("../utility/factories/ResponseFactory");
const addUnkownVideo = require("../../src/application/misc/Unkown-video-in-video-bucket")
const S3 = require("../../src/persistence/storage/S3")
module.exports.handshake = async () => {
	return ResponseFactory.getSuccessResponse();
};

module.exports.thumbnailMaker = async event => {
	await makeThumbnail(event);
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
