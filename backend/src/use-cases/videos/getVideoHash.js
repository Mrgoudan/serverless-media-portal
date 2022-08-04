const VideoDao = require("../../persistence/daos/VideoDao");

module.exports = async (formData) => {
	const name = formData["name"];
	console.log("in get Video hash");
	const videoHash = await VideoDao.GetVideoHash(name);

	return videoHash;
}