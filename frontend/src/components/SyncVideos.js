import React from "react";
import { authGet } from "../lib/auth-fetch";

export default function SyncVideos(){
    const onSubmit = async(e)=>{
        e.preventDefault();
        const res = await authGet("http://localhost:3001/dev/syncVideo");
        if(!res){
            console.log("not working out with auth get");
        }
    };

    return(
        <button onClick={onSubmit}>SyncVideos</button>
    );
}