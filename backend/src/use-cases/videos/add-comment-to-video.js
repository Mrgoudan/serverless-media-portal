// const addVideo = require("../../application/videos/add-video");
// const getVideo = require("../../application/videos/get-video");
const isUserAuthorizedToViewVideo = require("../../application/videos/is-user-authorized-to-view-video");
// const VideoModel = require("../../persistence/entity-models/VideoModel");
const getRandomString = require("../../utility/get-random-string");
const AnnoModel = require("../../persistence/entity-models/AnnoModel");
const addAnno = require("../../application/annotations/add-annotation")


module.exports = async (formData, user) => {
	// const existingVideo = await getExistingVideo(formData.VideoHash, user);
	// const newComment = createNewComment(formData, user);
	// const newVideo = createVideoWithNewComment(existingVideo, newComment);

	// await addVideo(newVideo);
	console.log(formData);
	const newAnno = new AnnoModel(formData);
	await addAnno(newAnno);
};

// const getExistingVideo = async (videoHash, user) => {
// 	const existingVideo = await getVideo(videoHash);

// 	if (!isUserAuthorizedToViewVideo(existingVideo, user)) {
// 		throw new Error(`User is not authorized to interact with video ${videoHash}`);
// 	} else if (!existingVideo) {
// 		throw new Error(`No video found with hash ${videoHash}`);
// 	}

// 	return existingVideo;
// };

// const createNewComment = (formData, user) => {
// 	return {
// 		CommentHash: getRandomString(11),
// 		CommentText: formData.CommentText,
// 		UserDisplayName: user.DisplayName,
// 		UserHash: user.UserHash,
// 		CreatedOn: new Date().toISOString()
// 	};
// };

// const createVideoWithNewComment = (existingVideo, newComment) => {
// 	return new VideoModel({
// 		...existingVideo,
// 		Comments: [
// 			...existingVideo.Comments ?? [],
// 			newComment
// 		]
// 	});
// };
