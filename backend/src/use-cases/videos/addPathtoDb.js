const PathDao = require("../../persistence/daos/PathDao")
const pathModel = require("../../persistence/entity-models/PathModel")

module.exports = async(config)=>{
    var data ={
        "date":config[1],
        "syncNum" : config[2],
        "videoName": config[3],
    }
    console.log(data);
    return PathDao.Addpath(new pathModel(data));
}