const AnnoDao = require("../../persistence/daos/AnnoDao")

module.exports = async(formData)=>{
    return await AnnoDao.GetAnnoData(formData);
}