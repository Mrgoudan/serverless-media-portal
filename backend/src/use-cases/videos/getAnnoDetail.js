const AnnoDao = require("../../persistence/daos/AnnoDao");

module.exports = async (formData) => {
    console.log(formData)
	const data = await AnnoDao.GetAnnoWithData(formData);
    // console.log(data);
    var out= [];
    for (let i =0;i<8;i++){
        out.push({});
    }
    for(let i in data){
        console.log(i);
        console.log(data[i])
        if(data[i].length!=0){
            for(let j in data[i]){
                if (data[i][j]["KidNumber"]["S"] in out[i]){
                    out[i].push(data[i][j]["KidNumber"]["S"],{"EventNumber":1});
                }else{
                    // out[i][]
                }
                console.log(data[i][j]);
            }
        }
    }    
    console.log("out",out);

    console.log("in get anno details",data);
    return data;
};
