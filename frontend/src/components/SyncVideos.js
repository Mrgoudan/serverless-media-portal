/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { authGet } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

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
    )
}