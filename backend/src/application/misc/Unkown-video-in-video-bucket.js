const Dynamo = require("../../persistence/storage/DynamoDb");
const S3 = require("../../persistence/storage/S3");
const videoDao = require("../../persistence/daos/VideoDao")
const videoModel = require("../../persistence/entity-models/VideoModel")

module.exports = async()=>{
    const keys = await new S3().GetAllFileFromVideoBicket();
    for (key in keys){
        const re = await videoDao.VideoNameExits(keys[key]);
        console.log("key",key);
        console.log("keys",keys);
        // const video = {
        //     Title,
        //     VideoFileName,
        //     Tags,
        // };
        if((!re && keys[key].includes(".mp4"))||(!re && keys[key].includes(".MP4"))){
            // var thumbnail = keys[key];
            // thumbnail = thumbnail.replace(".mp4","-0.jpg");
            
            const video ={
                Title:keys[key],
                VideoFileName:keys[key],
                Tags:["Admin","worker"],
                ThumbnailName:"thumbnail",
            };
        console.log("Video",video);
        const videoToBeadded = new videoModel(video);
        await videoDao.AddVideo(videoToBeadded);
        };
        
    };
}


