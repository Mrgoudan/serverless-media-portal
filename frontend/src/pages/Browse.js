import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { authPost, authGet } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";  
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import csvDownload from 'json-to-csv-export';

const VideoTitle = styled.div`
	font-weight: 600;
	font-size: 1em;
	line-height: 1.6;
	margin-top: 4px;
	display: inline;
`;


export default function Browse() {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoading2, setIsLoading2] = useState(true);
    const [paths] = useState([]);  // paths: {date: [path1, paths, ..], date2: [...], ...}
    const [numList, setNumList] = useState([]);


    useEffect(() => {
        loadOps();
    }, []);	

	// To get all the dates and syncs
    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");
		var prevPath = "";
        for (let obj in res.filePath) {
            const words = res.filePath[obj].split("/");
			if (words[1].startsWith("sync")) {
				var path = words[0] + "+" + words[1];
				
				if (words[0] in paths) {
					// pass
				} else {
					paths[words[0]] = [];
				}
				if (path != prevPath) {
					paths[words[0]].push(path);
					prevPath = path;
				}
			}
		}
        setIsLoading(false);
    };


	// To count the number of events for each kid on a specific date
	const getList = async (date) => {
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date["key"],
			}
		});
		var list = changeToJSON(res);
		console.log(list);
		setNumList(getKidEventNum(list, date));
		setIsLoading2(false);
	};


	const getKidEventNum = (list, date) => {
		var kidToEventNum = {};

		for (let j in paths[date["key"]]) {
			kidToEventNum[paths[date["key"]][j]] = {};
		}

		for (let i in list) {
			var syncName = list[i]["syncNum"].split("/")[0] + "+" + list[i]["syncNum"].split("/")[1];
			var kidName = list[i]["Kid"];

			if (kidName in kidToEventNum[syncName]) {
				kidToEventNum[syncName][kidName] += 1;
			} else {
				kidToEventNum[syncName][kidName] = 1;
			}
		}
		console.log(kidToEventNum);
		return kidToEventNum;
	};


	const downloadRes = async (date) => {
		console.log("Downloading the csv file for ", date["key"]);
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date["key"],
			}
		});
		var list = changeToJSON(res);
		console.log("The data we are downloading is", list);
		csvDownload(list);
	};

	const changeToJSON = (res) => {
		var list = [];
		for (let i in res) {
			if (i === "success") continue;
			list.push(res[i]);
		}
		return list;
	};


	return (

		<div style={{padding: "1rem"}}>
			{isLoading ? (
				<tr>
					<td colSpan="4" className="text-center">
						<Spinner animation="border" size="sm" />
					</td>
				</tr>
			) : (
				<Accordion>
				{
					Object.entries(paths).map(([key]) =>
					<Card key={key}>
						
						<Card.Header>
							<Accordion.Toggle as={Button} variant="link" eventKey={key} onClick={() => getList({key})}>
								<VideoTitle>{key}</VideoTitle>
							</Accordion.Toggle>
							<Button style={{margin: "0 6px"}} size="sm" variant="success" onClick={() => downloadRes({key})}>Download</Button>
							<Link to={`/result/${key}`}>
								<Button style={{margin: "0 6px"}} size="sm" variant="warning">Results</Button>
							</Link>
						</Card.Header>
							

						<Accordion.Collapse eventKey={key}>
							{isLoading2 ? (
								<div style={{padding: "2rem"}}>
									<tr>
										<td colSpan="4" className="text-center">
											<Spinner animation="border" size="sm" />
										</td>
									</tr>
								</div>
							) : (
								<Card.Body>
									{Object.keys(numList).map(path => {
										return (
											<div key={path} style={{padding: "10px"}}>
												<VideoTitle>
													{path.split("+")[1]}
												</VideoTitle>

												<Link to={`/main/${path}`} style={{padding: "6px"}}>
													{Object.keys(numList[path]).length > 0 && 
														<Button style={{width: "3.5rem"}} variant="info" size="sm">Edit</Button>
													}
													{Object.keys(numList[path]).length === 0 && 
														<Button style={{width: "3.5rem"}} size="sm">Work</Button>
													}
												</Link>				
											
												{Object.entries(numList[path]).map(([key, value]) => {
													return (
														<span key={key} style={{padding: "6px"}}>
															{key}: {value} 
														</span>		
													);
												})}	 

											</div>								
										);
									})}				
								</Card.Body>								
							)}

						</Accordion.Collapse>

					</Card> 
				)}
				</Accordion>				
			)}
		</div>								
	);
}

