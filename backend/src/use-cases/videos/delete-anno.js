const AnnoDao = require("../../persistence/daos/AnnoDao");

module.exports = async (formData) => {
	return AnnoDao.DeleteAnno(formData);
};
