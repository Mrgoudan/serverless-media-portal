/* eslint-disable */
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { authGet, authPost } from "../lib/auth-fetch";
import SpinnerCentered from "../components/SpinnerCentered";
import VideoContext from "../components/VideoContext";
import { VideoPlayer } from "../components/VideoPlayer";
import styled from "styled-components/macro";
import kids from "../kids.jpg";
import "./Main.css";
import { useParams } from "react-router-dom";
import convertSecondsToMinutes from "../lib/convert-seconds-to-minutes";

const VideoContainer = styled.div`
    background-color: #FFF;
    border: 1px solid #ececec;
    padding: 0;
    box-shadow: 1px 2px 4px 0px #e7e7e7;
    width: 460px;
    height: 340px;
`;

const VideoTitle = styled.div`
	font-weight: 600;
	font-size: 1em;
	line-height: 1.6;
	margin-top: 4px;
`;


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
    const [events, setEvents] = useState(["Event 1", "Event 2", "Event 3"]);
    var [eventsCount, setEventsCount] = useState(4); 
    // var dict = {};

    const { path } = useParams();
    const date = path.split("+")[0].toString();
    const sync = path.split("+")[1].toString();
    // console.log(date);
    // console.log(sync);

    useEffect(() => {
        loadOps();        
    }, []);

    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");
        console.log("filepath", res.filePath);

        for (let obj in res.filePath) {
            const words = res.filePath[obj].split("/");
            // console.log("words", words);
            const theDate = words[0];
            const theSync = words[1];
            const theVideo = words[2];
            if (theDate == date && theSync == sync) {
                views.push(theVideo);
            } 

            // if (words[0] in dict) {
            //     //pass
            // } else {
            //     dict[words[0]] = {};
            //     dataList.push(words[0]);
            // }
            // if (words[1] in dict[words[0]]) {
            //     //pass
            // } else {
            //     dict[words[0]][words[1]] = [];
            // }
            // dict[words[0]][words[1]].push(words[2]);
        }
        // setFiles(dict);
        // console.log("dict", dict);
        // setDataList(Object.keys(files));
        // console.log("date", dataList);
        // setViews(files[date][sync]);
        console.log("views", views);
        setIsLoading(false);
    };
   

    // const dataSelected = (e) => {
    //     setFileSeleted({
    //         ...fileSeleted,
    //         ["data"]: e.target.value,
    //     });
    //     var temp = Object.keys(files[e.target.value]);
    //     setSyncs(temp);
    //     console.log("sss", temp);
    //     console.log("syncs", syncs);
    // };

    // const syncSelected = (e) => {
    //     setFileSeleted({
    //         ...fileSeleted,
    //         ["sync"]: e.target.value,
    //     });
    //     setViews(files[fileSeleted["data"]][e.target.value]);
    //     console.log("view", views);
    // };

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
    const getAnnoFromDb =async()=>{
        // console.log("outcome",kid,event,annos,fileSeleted["data"] + "/" + fileSeleted["sync"]);
		const res = await authPost("http://localhost:3001/dev/getAnnoFromDb", {
			formData: {
				KidNumber: kid,
                eventNumber:event,
				syncNum: fileSeleted["data"] + "/" + fileSeleted["sync"],
			}
            
		});
        console.log(res);
        return res;
    }
    const selectedKid = (e)=>{
        setKid(e.target.value);
        if (event!="" && kid!=""){
            //pass;
        }
    };


    const addEvent = () => {
        console.log("add an event");
        setEventsCount(eventsCount+1);
        
        var eventName = "Event " + eventsCount;
        console.log(eventName);
        
        if (Array.isArray(events)) {
            // arr.push('example');
            events.push(eventName);
        }
        console.log(events);
    }

    const eventOptions = events.map((event) => 
        <option key={event.toString()} value={event}>
            {event}
        </option>
    );


    const twoActions=(e)=>{
        selectedEvent(e);
        checkForSelection();
        console.log("outcome",kid,event,annos,fileSeleted["data"] + "/" + fileSeleted["sync"]);
    }
    const selectedEvent = (e)=>{
        setEvent(e.target.value);
        // if (event!="" && kid!=""){
        //     //pass;
            
        //     checkForSelection();
        // }
    };
    const checkForSelection= async()=>{
        console.log(event,kid);
        if(typeof event!=='undefined' && typeof kid !=='undefined'){
            const res = await getAnnoFromDb();
            if(res.AnnoData.Count>0){
                setAnnos({
                    ...annos,
                    startTime:Object.values(res.AnnoData.Items[0]["startTime"]),
                    endTime:Object.values(res.AnnoData.Items[0]["endTime"]),
                    textEntry:Object.values(res.AnnoData.Items[0]["textEntry"]),
                });
            }

        }
    }
    const [annos, setAnnos] = useState({
		startTime : "",
		endTime : "",
        textEntry : "",
	});
	const updateField = async (e) => {
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
        // const V1Name = fileSeleted["data"] + "/" + fileSeleted["sync"] + "/" + e.target.value;
        const V1Name = date + "/" + sync + "/" + e.target.value;
        console.log(V1Name);
        getVideo1(V1Name);
    };
    const view2Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow2"]: e.target.value,
        });
        // const V2Name = fileSeleted["data"] + "/" + fileSeleted["sync"] + "/" + e.target.value;
        const V2Name = date + "/" + sync + "/" + e.target.value;
        console.log(V2Name);
        getVideo2(V2Name);

    };


    return (
        <Container className="Main">
            {/* <Row>
                <select onChange={(e) => dataSelected(e)}>
                    <option disabled selected value>YYYY-MM-DD </option>
                    {dataList.map((datas, key) => {
                        return (
                            <option key={key} value={datas}>
                                {datas}
                            </option>
                        );
                    })}
                </select>

                <select onChange={(e) => syncSelected(e)}>
                    <option disabled selected value> -- select -- </option>
                    {syncs.map((sync, key) => {
                        return (
                            <option key={key} value={sync}>
                                {sync}
                            </option>
                        );
                    })}
                </select>

            </Row><br/> */}

            <Row>
                <Col>
                    <img width={120} height={150} src={kids} alt="kid" /><br/>
                    <select id="SelectKids" size="5" onChange={(e)=>selectedKid(e)}>
                        <option value="kid1">Kid1</option>
                        <option value="kid2">Kid2</option>
                        <option value="kid3">Kid3</option>
                        <option value="kid4">Kid4</option>
                        <option value="kid5">Kid5</option>
                    </select>
                </Col>


                <Col>
                        <VideoContainer className="video-1 pt-2 px-1">
                            <select onChange={(e) => view1Selected(e)}>
                                <option disabled selected value> -- select -- </option>
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
                                    <Row>
                                        <Col>
                                            <video
                                                controls width={450} height={260}
                                            >
                                                <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video1.VideoFileName}`} type="video/mp4" />
                                                Sorry, your browser does not support embedded videos.
                                            </video>
                                            
                                            
                                            <VideoTitle>{video1.Title}</VideoTitle>
                                            

                                        </Col>
                                    </Row>
                                )}
                            </>
                        </VideoContainer>
                </Col>

                <Col>
                        <VideoContainer className="video-2 pt-2 px-1">
                            <select onChange={(e) => view2Selected(e)}>
                                <option disabled selected value> -- select -- </option>
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
                                    <Row>
                                        <Col>
                                            <video
                                                controls width={450} height={260}
                                            >
                                                <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video2.VideoFileName}`} type="video/mp4" />
                                                Sorry, your browser does not support embedded videos.
                                            </video>
                                            
                                            
                                            <VideoTitle>{video2.Title}</VideoTitle>
                                            

                                        </Col>
                                    </Row>
                                )}
                            </>
                        </VideoContainer>
                
                </Col>
            </Row>

            <br />
            <br />

            <Row className="annotation-area">
                <Col id="event">
                    <Button onClick={() => addEvent()}>Add an event</Button>
                    <br />
                    <select size="5" onChange={(e)=>twoActions(e)}>
                        {/* <option value="event 1">Event 1</option>
                        <option value="event 2">Event 2</option>
                        <option value="event 3">Event 3</option> */}
                        {eventOptions}
                    </select>
                </Col>

                <Col id="time">
                    <div>
                        <span>Start Time</span>
                        <input type = "text" value={annos.startTime} name ="startTime" onChange={updateField} placeholder = "1:00" required></input>                       
                    </div>

                    <div style={{margin: '10px 0 0 0'}}>
                        <span>End Time</span>
                        <input type = "text"  value={annos.endTime} name ="endTime" onChange={updateField} placeholder = "1:00" required></input>                        
                    </div>

                </Col>

                <Col id="text">
                    <a href="#">Link to Spell Checker</a>
                    <br />
                    <textarea rows="4" cols="95" name = "textEntry" value={annos.textEntry} onChange={updateField} required placeholder="Provide your annotation here "></textarea>                    
                    
                </Col>
                
                       
            </Row>
            
            <Row>
                <Button variant="success" onClick={EntrySubmit}>Save All</Button>
            </Row>
            
        </Container>
    );
}
