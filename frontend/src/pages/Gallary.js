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
import { useParams } from "react-router-dom";

const VideoTitle = styled.div`
	font-weight: 600;
	font-size: 1em;
	line-height: 1.6;
	margin-top: 4px;
	display: inline;
`;


export default function Gallary() {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoading2, setIsLoading2] = useState(true);
	const [isLoading3, setIsLoading3] = useState(true);
    const [paths] = useState([]);  // paths: {date: [path1, paths, ..], date2: [...], ...}
    const [numList, setNumList] = useState([]);

	const { siteName } = useParams();
	const site = siteName.split("/")[0].toString();

    useEffect(() => {
        loadOps();
    }, []);	

	// To get all the dates inside the processed folder of the website
    const loadOps = async () => {
		const res = await authPost(`http://localhost:3001/dev/getFirstLayer`, {
			formData: {
				syncNum: site,
			}
		});

		for (let obj in res.syncNum) {
			paths.push(res.syncNum[obj]);
		}

        setIsLoading(false);
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
		getKidEventNum(list, date, syncList);
	};

	const getSyncNum = async (date) => {
		var syncToKid = {};

		const res = await authPost(`http://localhost:3001/dev/getSyncNum`, {
			formData: {
				syncNum: site + "/" + date["date"],
			}
		});
		console.log(res);
		const numSync = res["syncNum"];

		for (let i = 0; i < numSync; i++) {
			syncToKid[date["date"] + "+sync" + ('000' + i).substr(-3)] = {};
		}

		setNumList(syncToKid);
		setIsLoading2(false);
		return syncToKid;
	};

	const getKidEventNum = async (list, date, syncList) => {
		var kidToEventNum = syncList;

		for (let i in list) {
			var syncName = list[i]["syncNum"].split("/")[0] + "+" + list[i]["syncNum"].split("/")[1];
			var kidName = list[i]["Kid"];

			if (kidName in kidToEventNum[syncName]) {
				kidToEventNum[syncName][kidName] += 1;
			} else {
				kidToEventNum[syncName][kidName] = 1;
			}
		}

		setNumList(kidToEventNum);
		setIsLoading3(false);
	};


	const downloadRes = async (date) => {
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date["date"],
			}
		});
		var list = changeToJSON(res);
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
							<Link to={`/result/${site}+${date}`}>
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

													<Link to={`/main/${site}+${path}`} style={{padding: "6px"}}>
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

													<Link to={`/main/${site}+${path}`} style={{padding: "6px"}}>
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

