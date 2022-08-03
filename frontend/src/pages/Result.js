import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authPost } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Table from 'react-bootstrap/Table';
import { Row, Col } from "react-bootstrap";
import "./Result.css";

export default function Result() {
    const [kid, setKid] = useState();
    const [annos, setAnnos] = useState([]);
    const [kidAnnos, setKidAnnos] = useState([]);
    const [kidNames, setKidNames] = useState({});

    const { key } = useParams(); // date 

    useEffect(() => {
        getRes();       
        getKidInfo();
    }, []);

    const getKidInfo = async() => {
        const res = await authPost("http://localhost:3001/dev/getKidText", {
            formData: {
                date: key,
            }         
        });
        setKidNames(res["Text"]);
    };

    const selectKid = (e)=>{
        setKid(e.target.value);
    };

    useEffect(() => {
        setKidAnnos(filterByKid(annos, kid));
    }, [kid]);

    const getRes = async () => {
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: key,
			}
		});
        var list = changeToJSON(res);
        console.log(list);
        setAnnos(list);
        setKidAnnos(list);
	};

	const changeToJSON = (res) => {
		var list = [];
		for (let i in res) {
			if (i === "success") continue;
			list.push(res[i]);
		}
		return list;
	};

    const filterByKid = (list, kidName) => {
        var kidList = [];
        for (let i in list) {
            if (list[i]["Kid"] === kidName) {
                kidList.push(list[i]);
            }
        }
        return kidList;
    };

    return (
        <div style={{padding: "2rem"}}>
            <Row style={{padding: "0 0 2rem 0"}}>
                {!kid && <h5 style={{ fontStyle: "italic" }}>Annotations on {key}</h5>}
                {kid && <h5 style={{ fontStyle: "italic" }}>Annotations of {kid} on {key}</h5>}                
            </Row>
            <Row>
                <Col className="selectKid">
                    <div>
                        <img width={120} height={150} src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${key}/mvt/${kidNames[kid]}`}  alt="kid"  style={{ display: typeof(kid)=="undefined" ? "none" : "block", border: "2px solid #7abaff" }}/>
                        <h5 style={{ fontStyle: "italic" }}>{kid}</h5>
                        <select id="SelectKids" size="5" onChange={(e) => selectKid(e)}>
                            {Object.keys(kidNames).map((name) => {
                                return (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </Col>

                <Col className="result">
                    <div>
                        <Table size="sm" hover bordered responsive className="table-light">
                            <thead>
                                <tr className="table-primary">
                                    {!kid && <th style={{width: "5rem"}}>Name</th>}
                                    <th style={{width: "5rem"}}>Sync #</th>
                                    <th style={{width: "5rem"}}>Event #</th>
                                    <th style={{width: "8rem"}}>Timestamp</th>
                                    <th>Annotation</th>
                                </tr>
                            </thead>
                            <tbody>                
                                {kidAnnos.map((anno) =>
                                    <tr key={(anno["Kid"] + anno["Annotation"]).toString()}>
                                        {!kid && <td>{anno["Kid"]}</td>}
                                        <td>{anno["syncNum"].split("/")[1]}</td>
                                        <td>{anno["Event"]}</td>
                                        <td>{anno["startTime"]} ~ {anno["endTime"]}</td>
                                        <td>{anno["Annotation"]}</td>                                    
                                    </tr>                
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>        

        </div>
    );
}