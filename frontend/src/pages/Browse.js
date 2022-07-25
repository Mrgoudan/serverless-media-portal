import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SpinnerCentered from "../components/SpinnerCentered";
import VideoThumbnail from "../components/VideoThumbnail";
import { authGet } from "../lib/auth-fetch";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col, ListGroupItem } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

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
	// var paths = {};

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
		console.log("filepath", res.filePath);

		var prevPath = "";

        for (let obj in res.filePath) {
			
			console.log("obj", obj);
            const words = res.filePath[obj].split("/");
			console.log("words", words);
			if(words[1]!=""){
				var path = words[0] + "+" + words[1];
			if (path != prevPath) {
				paths.push(path);
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
			
        setFiles(dict);
        console.log("dict", dict);
        // console.log("dict---", dict["2022-04-28"]);
        // setDataList(Object.keys(files));
        console.log("date", dataList);
        setIsLoading(false);
    };


	// const listDate = dataList.map((date) => 
	// 	<div key={date.toString()} value={date}>
	// 		{date}
	// 	</div>
	// );


	
	const listPaths = paths.map((path) => 
		<div key={path.toString()} style={{padding: "10px"}}>
			<VideoTitle>
				<span>{path.split("+")[0]}/</span>{path.split("+")[1]}
			</VideoTitle>
			
			<Link to={`/main/${path}`} style={{padding: "6px"}}>
				<Button size="sm">work</Button>
			</Link>
		</div>

	);


	return (
		<>
			{/* {isLoading ? (
				<SpinnerCentered />
			) : (
				<ThumbnailContainer>
					{videos.sort(sortFn).map((video) => (
						<VideoThumbnail key={video.VideoHash}
							isFiller={false}
							videoHash={video.VideoHash}
							title={video.Title}
							date={video.VideoDate}
							thumbnailName={video.ThumbnailName}
							duration={video.Duration}
						/>
					))}
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
					<VideoThumbnail isFiller />
				</ThumbnailContainer>
			)} */}

			{/* <ul>
				{listDate}
			</ul> */}

			<ul>
				
				{listPaths}
				
			</ul>

		</>
	);
}

