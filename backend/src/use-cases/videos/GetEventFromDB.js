const AnnoDao = require("../../persistence/daos/AnnoDao")

module.exports = async(formData)=>{
    return await AnnoDao.getEvent(formData);
}