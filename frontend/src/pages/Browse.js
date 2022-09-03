/* eslint-disable */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { authPost,authGet } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";  
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import csvDownload from 'json-to-csv-export';
// import {
//     S3Client,
//     ListObjectsCommand,
//   } from "@aws-sdk/client-s3";
// import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

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
	const [isLoading3, setIsLoading3] = useState(true);
    const [paths] = useState([]);  // paths: {date: [path1, paths, ..], date2: [...], ...}
    const [numList, setNumList] = useState([]);
	const bucketParams = { Bucket: "mvt-3" };
	const region = "ap-northeast-2";
    // const client = new S3Client({
    //   region,
    //   credentials: fromCognitoIdentityPool({
    //     client: new CognitoIdentityClient({ region }),
    //     // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    //     identityPoolId: 'ap-northeast-2:bd7a9c65-707d-4207-bc1d-fc8214075e23',
    //   }),
    // });
	// const listObj=async()=>{    
	// try {
	// 	const data = await client.send(new ListObjectsCommand(bucketParams));
	// 	console.log("Success", data);
	// 	return data; // For unit tests.
	//   } catch (err) {
	// 	console.log("Error", err);
	//   }
	// }


    useEffect(() => {
        loadOps();
    }, []);	

	// To get all the dates and syncs
    const loadOps = async () => {
		// listObj();
        const res = await authGet("http://localhost:3001/dev/getFilePath");
		console.log(res);

		// error handling
		if (typeof res === "undefined") {
			// console.log(res);
			console.log("Encountered an error, request again...");
			setTimeout(() => {
				loadOps();
			}, 1000);
		}

		for (let obj in res.filePath) {
			paths.push(res.filePath[obj]);
		}

		// getDate();

		console.log(paths);

        setIsLoading(false);
    };

	// const getDate = () => {
	// 	const d = new Date();
	// 	// ('000' + i).substr(-3)
	// 	let year = d.getFullYear();
	// 	let month = d.getMonth() + 1;
	// 	let date = d.getDate();
	// 	// 2022-04-14
	// 	for (let i = 0; i < 10; i++) {
	// 		let folderName = year + "-" + ("00" + month).substr(-2) + "-" + ("00" + date).substr(-2);
	// 		paths.push(folderName);
	// 		if (date > 1) {
	// 			date--;
	// 		} else {
	// 			d.setFullYear(year, month, 0);
	// 			year = d.getFullYear();
	// 			month = d.getMonth() + 1;
	// 			date = d.getDate();
	// 		}
	// 	}
	// 	console.log("paths:" + paths);
	// };

	const getSyncNum = async (date) => {
		const res = await authPost(`http://localhost:3001/dev/getSyncNum`, {
			formData: {
				syncNum: date["date"],
			}
		});
		console.log(res["syncNum"]);
		return res["syncNum"];
	};


	// To count the number of events for each kid on a specific date
	const getList = async (date) => {
		setIsLoading2(true);
		setIsLoading3(true);

		let syncList = await getSyncNum(date); // preload all the syncs

		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date["date"],
			}
		});
		var list = changeToJSON(res);
		// console.log(list);
		getKidEventNum(list, date, syncList);
		// setNumList(await getKidEventNum(list, date));
		// getSyncNum(date);

		// setIsLoading2(false);
	};

	// const getSyncNum = async (date) => {
	// 	var syncToKid = {};

	// 	// const res = await authPost(`http://localhost:3001/dev/getSyncNum`, {
	// 	// 	formData: {
	// 	// 		syncNum: date["date"],
	// 	// 	}
	// 	// });
	// 	// const numSync = res["syncNum"];

	// 	// predefined number of sync to be 8
	// 	const numSync = 8; // 0 ~ 7

	// 	for (let i = 0; i < numSync; i++) {
	// 		syncToKid[date["date"] + "+sync" + ('000' + i).substr(-3)] = {};
	// 	}

	// 	setNumList(syncToKid);
	// 	setIsLoading2(false);
	// 	return syncToKid;
	// };

	// const getKidEventNum = async (list, date, syncList) => {
	// 	var kidToEventNum = syncList;

	// 	for (let i in list) {
	// 		var syncName = list[i]["syncNum"].split("/")[0] + "+" + list[i]["syncNum"].split("/")[1];
	// 		var kidName = list[i]["Kid"];

	// 		if (kidName in kidToEventNum[syncName]) {
	// 			kidToEventNum[syncName][kidName] += 1;
	// 		} else {
	// 			kidToEventNum[syncName][kidName] = 1;
	// 		}
	// 	}
	// 	// console.log(kidToEventNum);

	// 	setNumList(kidToEventNum);
	// 	setIsLoading3(false);

	// 	// return kidToEventNum;
	// };


	const downloadRes = async (date) => {
		// console.log("Downloading the csv file for ", date["date"]);
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date["date"],
			}
		});
		var list = changeToJSON(res);
		// console.log("The data we are downloading is", list);
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
					Object.values(paths).map((date) =>
					<Card key={date}>
						<Card.Header>
							<Accordion.Toggle as={Button} variant="link" eventKey={date} onClick={() => getList({date})}>
								<VideoTitle>{date}</VideoTitle>
							</Accordion.Toggle>
							<Button style={{margin: "0 6px"}} size="sm" variant="success" onClick={() => downloadRes({date})}>Download</Button>
							<Link to={`/result/${date}`}>
								<Button style={{margin: "0 6px"}} size="sm" variant="warning">Display result</Button>
							</Link>
						</Card.Header>
							

						<Accordion.Collapse eventKey={date}>
							{
							isLoading2 ? 
							(
								<div style={{padding: "2rem"}}>
									<tr>
										<td colSpan="4" className="text-center">
											<Spinner animation="border" size="sm" />
										</td>
									</tr>
								</div>
							) : (
								isLoading3 ? 
								(
									<Card.Body>
										{Object.keys(numList).map(path => {
											return (
												<div key={path} style={{padding: "10px"}}>
													<VideoTitle>
														{path.split("+")[1]}
													</VideoTitle>

													<Link to={`/main/MVT-3+${path}`} style={{padding: "6px"}}>
															<Button style={{width: "3.5rem"}} size="sm">Work</Button>
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
								) : 
								(
									<Card.Body>
										{Object.keys(numList).map(path => {
											return (
												<div key={path} style={{padding: "10px"}}>
													<VideoTitle>
														{path.split("+")[1]}
													</VideoTitle>

													<Link to={`/main/MVT-3+${path}`} style={{padding: "6px"}}>
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
								)
								
							)
							}

						</Accordion.Collapse>

					</Card> 
				)}
				</Accordion>				
			)}
		</div>								
	);
}

