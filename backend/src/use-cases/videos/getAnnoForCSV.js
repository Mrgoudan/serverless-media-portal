const AnnoDao = require("../../persistence/daos/AnnoDao");

module.exports = async (formData) => {
    var out = [];
    const data =  await AnnoDao.GetAnnoWithData(formData);
    for( let i in data){
        console.log("first loop",data[i]);
        if(data[i].length!=0){
            for(let j in data[i]){
                

                console.log("data",data[i][j]);
                out.push({"syncNum":data[i][j]["syncNum"]["S"],"Kid":data[i][j]["KidNumber"]["S"],"Event":data[i][j]["eventNumber"]["S"],"startTime":data[i][j]["startTime"]["S"],"endTime":data[i][j]["endTime"]["S"],"Annotation":data[i][j]["textEntry"]["S"],})
            }
        }
    }
    console.log("final",out);
    return out;
    
}