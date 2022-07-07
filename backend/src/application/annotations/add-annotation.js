const AnnoDao = require("../../persistence/daos/AnnoDao");

module.exports = async addAnnoModel => {
	return AnnoDao.AddAnno(addAnnoModel);
};
