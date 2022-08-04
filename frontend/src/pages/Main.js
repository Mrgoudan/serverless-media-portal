import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { authGet, authPost } from "../lib/auth-fetch";
import styled from "styled-components/macro";
import "./Main.css";
import { useParams } from "react-router-dom";

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

const FileTitle = styled.div`
	font-weight: 600;
	font-size: 1.5em;
	line-height: 1.6;
	margin: 4px;
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
    const [kid,setKid] = useState();
    const [event, setEvent] = useState();
    const [events, setEvents] = useState([]);
    var [eventsCount, setEventsCount] = useState(1); 

    const { path } = useParams();
    const date = path.split("+")[0].toString();
    const sync = path.split("+")[1].toString();

    const [annos, setAnnos] = useState({
		startTime : "",
		endTime : "",
        textEntry : "",
	});


    // get all the videos when loading
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

        console.log(views);
        setIsLoading(false);
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
        const res = await authPost(`http://localhost:3001/dev/getKidEvent`, {
                formData: {
                    syncNum: "2022-04-29/sync000",
                }
            });
        console.log(res);

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

    const [kidName] = useState({
        "Mike": "001.png",
        "Jane": "002.png",
        "Ted" :"003.png",
        "Jennifer" :"004.png",
        "Yuri" :"005.png",
        "Xavier" :"006.png",
        "Alex" :"007.png",
        "Sandra": "008.png"
    });

    useEffect(() => {      
        if (typeof kid !== "undefined") {
            console.log("generateEvents", kid, date, sync);
            generateEvents();
        }
    },  [eventsCount]);

    const getEventNum = async() => {
        // console.log("getEventNum", kid, date, sync);
        const res = await authPost(`http://localhost:3001/dev/getEvent`,{
            formData:{
                KidNumber:kid,
                syncNum: date + "/" + sync
            }
        });
        // console.log("Event Number", res["AnnoData"]);
        var num = res["AnnoData"] + 1;
        setEventsCount(num);
        // console.log(eventsCount);
    };

    const generateEvents = () => {
        // console.log("generateEvents");
        // console.log(events);
        // console.log(eventsCount);
        var theEvents = [];
        for (var i = 1; i < eventsCount; i++) {
            var eventName = "Event " + i;
            console.log(eventName);
            if (Array.isArray(events)) {
                theEvents.push(eventName);
            }
        }
        // console.log("events", theEvents);
        setEvents(theEvents);
    };



    const getAnnoFromDb =async()=>{
        // console.log("getAnnoFromDb",kid,event,annos, date + "/" + sync);
		const res = await authPost("http://localhost:3001/dev/getAnnoFromDb", {
			formData: {
				KidNumber: kid,
                eventNumber:event,
				syncNum: date + "/" + sync,
			}
            
		});
        // console.log(res);
        return res;
    };

    // update the number of events for this kid when the kid changes
    useEffect(() => {
        if (typeof kid !== "undefined") {
            console.log(kid, "Sync the number of events!");          
            getEventNum();
        }
    }, [kid]);

    const selectKid = (e)=>{
        setKid(e.target.value);
    };

    const addEvent = () => {
        // console.log("add an event");
        setEventsCount(eventsCount + 1);
        
        var eventName = "Event " + eventsCount;
        // console.log(eventName);
        
        if (Array.isArray(events)) {
            // arr.push('example');
            events.push(eventName);
        }

        // console.log(events);
    };


    const dltEvent = async  () => {
        // console.log("Delete the last event");
        var lastEvent = "Event " + (eventsCount - 1);

        setEventsCount(eventsCount - 1);
        
        if (Array.isArray(events)) {
            // events.push(eventName);
            events.pop("Event " + eventsCount);
        }
        console.log("delEvent", kid, lastEvent, annos, date + "/" + sync);
		const res = await authPost("http://localhost:3001/dev/deleteAnno", {
			formData: {
				KidNumber: kid,
                eventNumber: lastEvent,
				syncNum: date + "/" + sync,
			}
            
		});
        console.log(res);
    };

    const eventOptions = events.map((event) => 
        <option key={event.toString()} value={event}>
            {event}
        </option>
    );

    useEffect(() => {
        if (typeof kid !== "undefined" && typeof event !== "undefined") {
            console.log("checkForSelection", kid, event, annos);  
            checkForSelection();
        }  
    }, [event, kid]);

    const selectedEvent = (e)=>{
        // // update the prev event before changing events
        // EntrySubmit();

        setEvent(e.target.value);
        // console.log("selectEvent", event);
    };

    const checkForSelection= async()=>{
        // console.log("checkForSelection", event, kid);
        if (typeof event !== "undefined" && typeof kid !== "undefined") {
            const res = await getAnnoFromDb();
            if(res["Count"] > 0){
                // console.log("Annotation exists!");
                setAnnos({
                    ...annos,
                    startTime:res["Items"][0]["startTime"]["S"],
                    endTime:res["Items"][0]["endTime"]["S"],
                    textEntry:res["Items"][0]["textEntry"]["S"],
                });
            } else {
                // console.log("No annotation!");
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
        // console.log(annos);
    };

    const EntrySubmit=async()=>{
        // console.log("EntrySubmit ",kid, event, annos, date + "/" + sync);
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
        // console.log(V1Name);
        getVideo1(V1Name);
    };
    const view2Selected = (e) => {
        setFileSeleted({
            ...fileSeleted,
            ["ViewWindow2"]: e.target.value,
        });

        const V2Name = date + "/" + sync + "/" + e.target.value;
        // console.log(V2Name);
        getVideo2(V2Name);

    };

    const handleSubmit = event => {
        // prevent page refresh
        event.preventDefault();
    
        console.log("form submitted");
    };


    return (
        <>
            {isLoading ? (
                <h2>Loading...</h2>
            ) : (
                <Container className="Main">
                    <Row>
                        <FileTitle>{date} {sync}</FileTitle>
                    </Row>

                    <Row>
                        <Col>
                            <img width={120} height={150} src={`https://${process.env.REACT_APP_videoCloudfrontDomain}/2022-04-29/mvt/001.png`}  alt="kid"  style={{ display: typeof(kid)=="undefined" ? "none" : "block" }}/>
                            <br/>
                            <select id="SelectKids" size="5" onChange={(e) => selectKid(e)}>
                                <option value="Mike">Mike </option>
                                <option value="Jane">Jane </option>
                                <option value="Ted">Ted </option>
                                <option value="Yuri">Yuri  </option>
                                <option value="Xavier">Xavier </option>
                                <option value="Alex">Alex  </option>
                                <option value="Sandra">Sandra  </option>
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
                            <Button className="event-btn" variant="danger" onClick={() => dltEvent()}>-</Button>
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
        </>
    );
}