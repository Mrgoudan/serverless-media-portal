import React from "react";
import { authGet } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

export default function SyncVideos(){
    const onSubmit = async(e)=>{
        e.preventDefault();
        const res = await authGet("http://localhost:3001/dev/syncVideo");
        if(!res){
            console.log("not working out with auth get");
        }
        alert("Videos Syncronized!");
    };

    return(
        <Button onClick={onSubmit}>SyncVideos</Button>
    );
}