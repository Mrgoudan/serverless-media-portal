const AnnoDao = require("../../persistence/daos/AnnoDao");

module.exports = async (formData) => {
    const data =  await AnnoDao.getKidsEvent(formData);

    return data;
    
}