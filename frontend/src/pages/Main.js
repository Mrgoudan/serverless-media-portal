import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { authGet, authPost } from "../lib/auth-fetch";
import styled from "styled-components/macro";
import "./Main.css";
import { useParams } from "react-router-dom";
import DeleteConfirmation from "../components/DeleteConfirmation";

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
`;


export default function Main() {

    const [isLoading, setIsLoading] = useState(true);
    const [is1Loading, set1IsLoading] = useState(true);
    const [is2Loading, set2IsLoading] = useState(true);

    const [views] = useState([]);
    const [video1, setVideo1] = useState({});
    const [video2, setVideo2] = useState({});
    const [fileSeleted, setFileSeleted] = useState({
        data: "",
        sync: "",
        ViewWindow1: "",
        ViewWindow2: "",
    });
    const [kid, setKid] = useState();
    const [event, setEvent] = useState();
    const [events, setEvents] = useState([]);
    // var [eventsCount, setEventsCount] = useState(1); 

    const [kidNames, setKidNames] = useState({});

    const { path } = useParams();
    const date = path.split("+")[0].toString();
    const sync = path.split("+")[1].toString();

    const [annos, setAnnos] = useState({
		startTime : "",
		endTime : "",
        textEntry : "",
	});

    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);

    // get all the videos and kids info when loading
    useEffect(() => {
        loadOps();        
    }, []);

    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");

        for (let obj in res.filePath) {
            const words = res.filePath[obj].split("/");
            const theDate = words[0];
            const theSync = words[1];
            const theVideo = words[2];
            if (theDate == date && theSync == sync && theVideo != "") {
                views.push(theVideo);
            } 
        }
        getKidInfo();
        setIsLoading(false);
    };
   
    const getKidInfo = async() => {
        const res = await authPost("http://localhost:3001/dev/getKidText", {
            formData: {
                date: date,
            }         
        });
        setKidNames(res["Text"]);
    };

    const getVideo1 = async (name) => {
        var videoHash;
        try {
            videoHash = await authPost(`http://localhost:3001/dev/GetVideoHashWithName`, {
                formData: {
                    name: name,
                }
            });
        } catch (error) {
            console.log("error log", error);
        }

        var hash = Object.values(videoHash.reHash.Items[0].VideoHash);

        if (videoHash) {
            const res = await authGet(`http://localhost:3001/dev/getVideo?videoHash=${hash}`);
            if (res.success) {
                setVideo1(res.video);
                set1IsLoading(false);
            }
        }
    };

    const getVideo2 = async (name) => {
        var videoHash;
        try {
            videoHash = await authPost(`http://localhost:3001/dev/GetVideoHashWithName`, {
                formData: {
                    name: name,
                }
            });
        } catch (error) {
            console.log("error log", error);
        }
        
        var hash = Object.values(videoHash.reHash.Items[0].VideoHash);

        if (videoHash) {
            const res = await authGet(`http://localhost:3001/dev/getVideo?videoHash=${hash}`);
            if (res.success) {
                setVideo2(res.video);
                set2IsLoading(false);
            }

        }
    };

    const getAnnoFromDb =async()=>{
		const res = await authPost("http://localhost:3001/dev/getAnnoFromDb", {
			formData: {
				KidNumber: kid,
                eventNumber:event,
				syncNum: date + "/" + sync,
			}
            
		});
        return res;
    };

    // update the number of events for this kid when the kid changes
    useEffect(() => {
        if (typeof kid !== "undefined") {        
            // getEventNum();
            generateEvents();
        }
    }, [kid]);

    const selectKid = (e)=>{
        setKid(e.target.value);
    };


	const generateEvents = async () => {
		const res = await authPost(`http://localhost:3001/dev/getForDownload`,{
			formData:{
				syncNum: date,
			}
		});
		var list = changeToJSON(res);
		// console.log(list);
		var theEvents = [];
		for (let i in list) {
            if (list[i]["Kid"] === kid && list[i]["syncNum"].split("/")[1] === sync) {
                theEvents.push(list[i]["Event"]);
            } 
		}
        theEvents.sort();
        // console.log(theEvents);
        setEvents(theEvents);
	};

    const changeToJSON = (res) => {
		var list = [];
		for (let i in res) {
			if (i === "success") continue;
			list.push(res[i]);
		}
		return list;
	};

    const addEvent = () => {
        var newEvents = [];
        for (var i in events) {
            newEvents.push(events[i]);
        }

        var nextEventNum = 1;
        if (events.length !== 0) {
            nextEventNum = parseInt(events[events.length - 1].split(" ")[1]) + 1;
        } 
        var eventName = "Event " + nextEventNum;
        // console.log(eventName);
        if (Array.isArray(events)) {
            newEvents.push(eventName);
        }
        // console.log(newEvents);
        setEvents(newEvents);
    };


    const dltEvent = async  () => {
        var newEvents = [];
        if (Array.isArray(events)) {
            // console.log("pop event:", event);
            for (var i in events) {
                if (events[i] === event) continue;
                newEvents.push(events[i]);
            }            
            
        } 
        // console.log(newEvents);

		await authPost("http://localhost:3001/dev/deleteAnno", {
			formData: {
				KidNumber: kid,
                eventNumber: event,
				syncNum: date + "/" + sync,
			}
		});

        setEvents(newEvents);
        setDisplayConfirmationModal(false);
    };

    const eventOptions = events.map((event) => 
        <option key={event.toString()} value={event}>
            {event}
        </option>
    );

    useEffect(() => {
        if (typeof kid !== "undefined" && typeof event !== "undefined") {
            checkForSelection();
        }  
    }, [event, kid]);

    const selectedEvent = (e)=>{
        setEvent(e.target.value);
    };

    const checkForSelection= async() => {
        if (typeof event !== "undefined" && typeof kid !== "undefined") {
            const res = await getAnnoFromDb();
            if (res["Count"] > 0) {
                setAnnos({
                    ...annos,
                    startTime:res["Items"][0]["startTime"]["S"],
                    endTime:res["Items"][0]["endTime"]["S"],
                    textEntry:res["Items"][0]["textEntry"]["S"],
                });
            } else {
                setAnnos({
                    ...annos,
                    startTime: "",
                    endTime: "",
                    textEntry: "",
                });   
            }

        }
    };

	const updateField = async (e) => {
		setAnnos({
            ...annos,
            [e.target.name]: e.target.value
		});
    };

    const EntrySubmit = async() => {
		const res = await authPost("http://localhost:3001/dev/addCommentToVideo", {
			formData: {
				KidNumber: kid,
                eventNumber:event,
				Entries: annos,
				syncNum: date + "/" + sync,
			}
		});
        return res;
    };

    const view1Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow1"]: e.target.value,
        });
        const V1Name = date + "/" + sync + "/" + e.target.value;
        getVideo1(V1Name);
    };
    const view2Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow2"]: e.target.value,
        });
        const V2Name = date + "/" + sync + "/" + e.target.value;
        getVideo2(V2Name);
    };

    const handleSubmit = event => {
        // prevent page refresh
        event.preventDefault();
        console.log("form submitted");
    };

    // Handle the displaying of the modal based on type and id
    const showDeleteModal = () => {
        setDisplayConfirmationModal(true);
    };

    // Hide the delete confirmation modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };


    return (
        <div style={{padding: "1rem"}} className="Main">
            {isLoading ? (
				<tr>
                    <td colSpan="4" className="text-center">
                        <Spinner animation="border" size="sm" />
                    </td>
                </tr>
            ) : (
                <Container className="Main">
                    <Row>
                        <h3 style={{ fontStyle: "italic", padding: "0 0 1rem 0" }}>{date} {sync}</h3>
                    </Row>

                    <Row>
                        <Col>
                            {kid &&<img width={120} height={150} src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${date}/mvt/${kidNames[kid]}`}  alt="kid"  style={{ display: typeof(kid)=="undefined" ? "none" : "block", border: "2px solid #7abaff" }}/>}
                            <select id="SelectKids" size="5" onChange={(e) => selectKid(e)}>
                                {Object.keys(kidNames).map((name) => {
                                    return (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </select>
                        </Col>

                        <Col>
                            <VideoContainer className="video-1 pt-2 px-1">
                                <select defaultValue={'DEFAULT'} onChange={(e) => view1Selected(e)}>
                                    <option value="DEFAULT" disabled> -- select -- </option>
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
                                                <React.Fragment key={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video1.VideoFileName}`}>
                                                    <video
                                                        controls width={450} height={260}
                                                    >
                                                        <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video1.VideoFileName}`} type="video/mp4" />
                                                        Sorry, your browser does not support embedded videos.
                                                    </video>                                          
                                                </React.Fragment>

                                                <VideoTitle>{video1.Title}</VideoTitle>
                                            </Col>
                                        </Row>
                                    )}
                                </>
                            </VideoContainer>
                        </Col>

                        <Col>
                            <VideoContainer className="video-2 pt-2 px-1">
                                <select defaultValue={'DEFAULT'} onChange={(e) => view2Selected(e)}>
                                    <option value="DEFAULT" disabled> -- select -- </option>
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
                                                <React.Fragment key={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video2.VideoFileName}`}>
                                                    <video
                                                        controls width={450} height={260}
                                                    >
                                                        <source src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/${video2.VideoFileName}`} type="video/mp4" />
                                                        Sorry, your browser does not support embedded videos.
                                                    </video>                                          
                                                </React.Fragment>

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
                            <span> Event </span>
                            <Button className="event-btn" variant="success" onClick={() => addEvent()}>+</Button>
                            <Button className="event-btn" variant="danger" onClick={() => showDeleteModal()}>-</Button>
                            <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={dltEvent} hideModal={hideConfirmationModal} />
                            
                            <br />
                            <select size="5" onClick={(e) => selectedEvent(e)}>
                                {eventOptions}
                            </select>
                        </Col>

                        <form onSubmit={handleSubmit}>
                            <Col id="time">
                                <div>
                                    <span>Start Time</span>
                                    <input type = "text" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" value={annos.startTime} name ="startTime" onChange={updateField} placeholder = "1:00" required></input>                       
                                </div>

                                <div style={{margin: '10px 0 0 0'}}>
                                    <span>End Time</span>
                                    <input type = "text" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" value={annos.endTime} name ="endTime" onChange={updateField} placeholder = "1:00" required></input>                        
                                </div>
                            </Col>

                            <Col id="text">
                                <a href="#">Link to Spell Checker</a>
                                <textarea rows="4" cols="95" name = "textEntry" value={annos.textEntry} onChange={updateField} required placeholder="Provide your annotation here "></textarea>                    
                                <div id="save-btn">
                                    <Button type="submit" variant="success" onClick={EntrySubmit}>Save</Button>
                                </div>
                            </Col>                    
                        </form>
                    </Row>
                </Container>                
            )}  
        </div>
    );
}
