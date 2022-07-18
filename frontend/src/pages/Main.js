/* eslint-disable */
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { authGet, authPost } from "../lib/auth-fetch";
import SpinnerCentered from "../components/SpinnerCentered";
import VideoContext from "../components/VideoContext";
import { VideoPlayer } from "../components/VideoPlayer";
import styled from "styled-components/macro";


// const VideoMetadataContainer = styled.div`
// 	background-color: #FFF;
// 	border: 1px solid #ececec;
// 	padding: 0.5em 1em 1em;
// 	margin-top: -6px;
// 	box-shadow: 1px 2px 4px 0px #e7e7e7;
// `;
// const VideoTitle = styled.div`
// 	font-weight: 600;
// 	font-size: 1.3em;
// 	line-height: 1.6;
// 	margin-top: 4px;
// `;
export default function Main() {

    const [files, setFiles] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [is1Loading, set1IsLoading] = useState(true);
    const [is2Loading, set2IsLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [syncs, setSyncs] = useState([]);
    const [views, setViews] = useState([]);
    const [video1, setVideo1] = useState({});
    const [video2, setVideo2] = useState({});
    const [fileSeleted, setFileSeleted] = useState({
        data: "",
        sync: "",
        ViewWindow1: "",
        ViewWindow2: "",
    });
    const [kid,setKid] = useState();
    const [event, setEvent] = useState();
    var dict = {};
    useEffect(() => {
        loadOps();
    }, []);
    // const updateDataList =(data)={
    //     dataList.push(data);
    // }
    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");
        console.log(res.filePath);
        for (let obj in res.filePath) {
            const words = res.filePath[obj].split("/");

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
        setFiles(dict);
        setDataList(Object.keys(files));
        console.log("daaa", dataList);
        setIsLoading(false);
    };
    //   console.log("file", files);

    const dataSelected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["data"]: e.target.value,
        });
        var temp = Object.keys(files[e.target.value]);
        setSyncs(temp);
        console.log("sss", temp);
        console.log("syncs", syncs);
    };
    const syncSelected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["sync"]: e.target.value,
        });
        setViews(files[fileSeleted["data"]][e.target.value]);
        console.log("view", views);
    };
    const getVideo1 = async (name) => {
        console.log(name);

        var videoHash;
        try {
            videoHash = await authPost(`http://localhost:3001/dev/GetVideoHashWithName`, {
                formData: {
                    name: name,
                }
            });
            console.log(videoHash);
        } catch (error) {
            console.log("error log", error);
        }
        //reHash.Items[0].VideoHash
        var hash = Object.values(videoHash.reHash.Items[0].VideoHash);
        console.log("hash", hash);
        if (videoHash) {
            const res = await authGet(`http://localhost:3001/dev/getVideo?videoHash=${hash}`);
            if (res.success) {
                console.log(res);

                setVideo1(res.video);
                set1IsLoading(false);



                console.log("video:", video1);
            }

        }
    };
    const getVideo2 = async (name) => {
        console.log(name);

        var videoHash;
        try {
            videoHash = await authPost(`http://localhost:3001/dev/GetVideoHashWithName`, {
                formData: {
                    name: name,
                }
            });
            console.log(videoHash);
        } catch (error) {
            console.log("error log", error);
        }
        //reHash.Items[0].VideoHash
        var hash = Object.values(videoHash.reHash.Items[0].VideoHash);
        console.log("hash", hash);
        if (videoHash) {
            const res = await authGet(`http://localhost:3001/dev/getVideo?videoHash=${hash}`);
            if (res.success) {
                console.log(res);

                setVideo2(res.video);
                set2IsLoading(false);



                console.log("video:", video2);
            }

        }
    };
    const selectedKid = (e)=>{
        setKid(e.target.value);
    };
    const selectedEvent = (e)=>{
        setEvent(e.target.value);
    };
    const [annos, setAnnos] = useState({
		startTime : "",
		endTime : "",
        textEntry : "",
	});
	const updateField = e => {
		setAnnos({
		  ...annos,
		  [e.target.name]: e.target.value
		});
	  };
    const EntrySubmit=async()=>{
        console.log("outcome",kid,event,annos,fileSeleted["data"] + "/" + fileSeleted["sync"]);
		const res = await authPost("http://localhost:3001/dev/addCommentToVideo", {
			formData: {
				KidNumber: kid,
                eventNumber:event,
				Entries: annos,
				syncNum: fileSeleted["data"] + "/" + fileSeleted["sync"],
			}
		});
        return res;
    };
    const view1Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow1"]: e.target.value,
        });
        const V1Name = fileSeleted["data"] + "/" + fileSeleted["sync"] + "/" + e.target.value;
        console.log(V1Name);
        getVideo1(V1Name);
    };
    const view2Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow2"]: e.target.value,
        });
        const V2Name = fileSeleted["data"] + "/" + fileSeleted["sync"] + "/" + e.target.value;
        console.log(V2Name);
        getVideo2(V2Name);

    };

    return (
        <Container className="Main">
            <Row>
                {/* <input type="date"></input> */}
                <select onChange={(e) => dataSelected(e)}>
                    <option value="" />
                    {dataList.map((datas, key) => {
                        return (
                            <option key={key} value={datas}>
                                {datas}
                            </option>
                        );
                    })}
                </select>

                <select onChange={(e) => syncSelected(e)}>
                    <option value="" />
                    {syncs.map((sync, key) => {
                        return (
                            <option key={key} value={sync}>
                                {sync}
                            </option>
                        );
                    })}
                </select>

                {/*<select>
                    <option > -- select an option -- </option>
                    <option value="sync000">Sync000</option>
                    <option value="sync001">Sync001</option>
                    <option value="sync002">Sync002</option>
                    <option value="sync003">Sync003</option>
                    <option value="sync004">Sync004</option>
                    <option value="sync005">Sync005</option>
                    <option value="sync006">Sync006</option>
                    <option value="sync007">Sync007</option>
                    <option value="sync008">Sync008</option>
                </select>            */}
            </Row>

            <Row>
                <Col>
                    <img width={150} height={200} src={require("../images/kids.jpg")} alt="kid" /><br/>
                    <select size="5" onChange={(e)=>selectedKid(e)}>
                        <option value="kid1">Kid1</option>
                        <option value="kid2">Kid2</option>
                        <option value="kid3">Kid3</option>
                        <option value="kid4">Kid4</option>
                        <option value="kid5">Kid5</option>
                    </select>
                </Col>

                <Col>
                    <div className="video-1">
                        {/* <select>
                            <option>View1</option>
                            <option>View2</option>
                            <option>View3</option>
                        </select>  */}
                        <select onChange={(e) => view1Selected(e)}>
                            <option value="" />
                            {views.map((view, key) => {
                                return (
                                    <option key={key} value={view}>
                                        {view}
                                    </option>
                                );
                            })}
                        </select>
                        <a href="#"> Link to Camera map in the classroom</a>

                        <>
                            {is1Loading ? (
                                <video
                                controls width={450}></video>
                            ) : (
                                <video
                                    controls width={450}

                                >
                                    <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video1.VideoFileName}`} type="video/mp4" />
                                    Sorry, your browser does not support embedded videos.
                                </video>
                            )}
                        </>
                    </div>
                </Col>

                <Col>
                    <div className="video-1">
                        <select onChange={(e) => view2Selected(e)}>
                            <option value="" />
                            {views.map((view, key) => {
                                return (
                                    <option key={key} value={view}>
                                        {view}
                                    </option>
                                );
                            })}
                        </select>
                        <>
                            {is2Loading ? (
                                <video
                                controls width={450}></video>
                            ) : (
                                <video
                                    controls width={450}

                                >
                                    <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video2.VideoFileName}`} type="video/mp4" />
                                    Sorry, your browser does not support embedded videos.
                                </video>
                            )}
                        </>

                    </div>
                </Col>
            </Row>

            <br />
            <br />

            <Row className="annotation-area">
                <Col id="event">
                    <Button>Add an event</Button>
                    <br />
                    <select size="5" onChange={(e)=>selectedEvent(e)}>
                        <option value="event 1">Event 1</option>
                        <option value="event 2">Event 2</option>
                        <option value="event 3">Event 3</option>
                        <option value="event 4">Event 4</option>
                        <option value="event 5">Event 5</option>
                        <option value="event 6">Event 6</option>
                        <option value="event 7">Event 7</option>
                        <option value="event 8">Event 8</option>
                        <option value="event 9">Event 9</option>
                        <option value="event 10">Event 10</option>

                    </select>
                </Col>

                <Col id="time">
                    <p>Start Time</p>
                    <input type = "text" value={annos.startTime} name ="startTime" onChange={updateField} placeholder = "1:00" required></input>

                    <p>End Time</p>
                    <input type = "text"  value={annos.endTime} name ="endTime" onChange={updateField} placeholder = "1:00" required></input>
                </Col>

                <Col id="text">
                    <a href="#">Link to Spell Checker</a>
                    <br />
                    <textarea rows="4" cols="80" name = "textEntry" value={annos.textEntry} onChange={updateField} required placeholder="Provide your annotation here "></textarea>
                    <br />
                    <Button variant="success" onClick={EntrySubmit}>Save</Button>
                </Col>
            </Row>
        </Container>
    );
}
