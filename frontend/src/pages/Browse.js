import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SpinnerCentered from "../components/SpinnerCentered";
import VideoThumbnail from "../components/VideoThumbnail";
import { authPost, authGet } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col, ListGroupItem} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";  
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const ThumbnailContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding: 1.5em 0 2em 0.5em;
`;


export default function Browse() {
	const [isLoading, setIsLoading] = useState(true);
	const [videos, setVideos] = useState([]);
    const [files, setFiles] = useState();
    const [dataList, setDataList] = useState([]);
    const [paths, setPaths] = useState([]);
    const [syncs, setSyncs] = useState([]);
    var dict = {};
	var kidsEvents = {};
	// var paths = {};
	const kids = ["Mike", "Jane", "Ted", "Yuri", "Xavier", "Alex", "Sandra"];

    useEffect(() => {
        loadOps();
    }, []);


	// useEffect(() => {
	// 	loadVideos();
	// }, []);

	// const loadVideos = async () => {
	// 	const res = await authGet("http://localhost:3001/dev/listAllVideosForUser");

	// 	if(res && res.videos) {
	// 		setVideos(res.videos);
	// 	}
		
	// 	setIsLoading(false);
	// };

	const VideoTitle = styled.div`
		font-weight: 600;
		font-size: 1em;
		line-height: 1.6;
		margin-top: 4px;
		display: inline;
	`;

    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");
		// console.log("filepath", res.filePath);

		var prevPath = "";

        for (let obj in res.filePath) {
			
			// console.log("obj", obj);
            const words = res.filePath[obj].split("/");
			// console.log("words", words);
			if(words[1]!=""){
				var path = words[0] + "+" + words[1];

				// paths: {date: [path1, paths, ..], date2: [...], ...}
				if (words[0] in paths) {
					// pass
				} else {
					paths[words[0]] = [];
				}
				if (path != prevPath) {
					paths[words[0]].push(path);
					prevPath = path;
				}
				
				if (words[0] in dict) {
					//pass
				} else {
					dict[words[0]] = {};
					dataList.push(words[0]);
				}
				if (words[1] in dict[words[0]]) {
					//pass
				} else {
					dict[words[0]][words[1]] = [];
				}

				dict[words[0]][words[1]].push(words[2]);

			}
		}
		console.log("paths", paths);
        setFiles(dict);
        console.log("dict", dict);
        // console.log("dict---", dict["2022-04-28"]);
        // setDataList(Object.keys(files));
        console.log("dateList", dataList);
		
		// // // get each kid's anno numbers
		// for (let date in dict) {
		// 	console.log("date", date);
		// 	console.log(dict[date]);
		// 	for (var key in dict[date]) {
		// 		console.log(key);
		// 		var sync = key;
		// 		var thePath = date + "/" + sync;
		// 		if (thePath in kidsEvents) {
		// 			// pass
		// 		} else {
		// 			kidsEvents[thePath] = [];
		// 		}
		// 		// for (let i in kids) {
		// 		// 	var kid = kids[i];
		// 		// 	// var num = getEventNum(kid, date, sync);
					
		// 		// 	// num.then(function(res) {
		// 		// 	// 	// console.log("number of events", res);
		// 		// 	// 	kidsEvents[thePath].push(num);
		// 		// 	// });					

		// 		// 	getEventNum(kid, date, sync);
		// 		// }

		// 	}
		// }	

		// console.log("kidsEvents", kidsEvents);

        setIsLoading(false);
    };



    // const getEventNum = async(kid, date, sync) => {
    //     console.log("getEventNum", kid, date, sync);
    //     const res = await authPost(`http://localhost:3001/dev/getEvent`,{
    //         formData:{
    //             KidNumber:kid,
    //             syncNum: date + "/" + sync
    //         }
    //     });
	// 	// console.log(res);
    //     var num = res["AnnoData"] + 1;
	// 	console.log(num);
	// 	// return num;
	// 	kidsEvents[thePath].push(num);
    // };




	return (

			<Accordion>
			{
				Object.entries(paths).map(([key, value]) =>
				<Card key={value.toString()}>
					
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="0">
							<VideoTitle>{key}</VideoTitle>
						</Accordion.Toggle>
					</Card.Header>
						

					<Accordion.Collapse eventKey="0">
						<Card.Body>
							{value.map((path) => 
								<div key={path} style={{padding: "10px"}}>
									<VideoTitle>
										{/* <span>{path.split("+")[0]}/</span> */}
										{path.split("+")[1]}
									</VideoTitle>

									<Link to={`/main/${path}`} style={{padding: "6px"}}>
										<Button size="sm">work</Button>
									</Link>							
								</div>
							)}							
						</Card.Body>
					</Accordion.Collapse>

				</Card> 
			)}
			</Accordion>			

	);
}

