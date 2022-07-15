import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col} from "react-bootstrap";
import React from "react";
import "./Main.css";


export default function Main() {
	return (
        <Container className="Main">
            <Row>
                <input type="date"></input>
                
                <select>
                    <option disabled selected value> -- select an option -- </option>
                    <option value="sync000">Sync000</option>
                    <option value="sync001">Sync001</option>
                    <option value="sync002">Sync002</option>
                    <option value="sync003">Sync003</option>
                    <option value="sync004">Sync004</option>
                    <option value="sync005">Sync005</option>
                    <option value="sync006">Sync006</option>
                    <option value="sync007">Sync007</option>
                    <option value="sync008">Sync008</option>
                </select>           
            </Row>

            <br/><br/>
            
            <Row>
                <Col>
                
                    <img width={150} height={200} src={require("../images/kid1.jpg")} alt="kid" /><br/>
                    <select size="5">
                        <option>Kid1</option>
                        <option>Kid2</option>
                        <option>Kid3</option>
                        <option>Kid4</option>
                    </select>
                    
                </Col>

                <Col>
                
                        <div className='video-1'>
                        <select>
                            <option>View1</option>
                            <option>View2</option>
                            <option>View3</option>
                        </select> 
                        <a href="#"> Link to Camera map in the classroom</a>       

                        <video controls width={450}>
                            <source src={require("../images/dog.mp4")} type="video/mp4" />
                            Error Message
                        </video>
                        </div>            
                   

                </Col>

                <Col>
                    <div className='video-1'>
                  
                        <select>
                            <option>View1</option>
                            <option>View2</option>
                            <option>View3</option>
                        </select>

                        <video controls width={450}>
                            <source src={require("../images/pet.mp4")} type="video/mp4" />
                            Error Message
                        </video>                   
                
            
                    </div>            

                </Col>
        
            </Row>

            <br/><br/>

            <Row className="annotation-area">

                <Col id="event">
                    <Button>Add an event</Button>
                    <br/>
                    <select size="5">
                        <option>Event1</option>
                        <option>Event2</option>
                        <option>Event2</option>
                    </select>             
                </Col>

                <Col id="time">
                    <p>Start Time</p>
                    <input></input>

                    <p>End Time</p>
                    <input></input>          
                </Col>

                <Col id="text">

                        <a href="#">Link to Spell Checker</a>
                        <br/>
                        <textarea rows="4" cols="80"></textarea>
                        <br/>
                        <Button variant='success'>Save</Button>                


                </Col>

            </Row>
    
        </Container>  
    );
}
