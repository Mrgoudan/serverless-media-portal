import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col} from "react-bootstrap";
import React from "react";


export default function Main() {
	return (
        <Container className="Main">
            <Row>
                <input type="date"></input>
                
                <select>
                    <option disabled selected value> -- select an option -- </option>
                    <option>Sync000</option>
                    <option>Sync001</option>
                    <option>Sync002</option>
                </select>           
            </Row>

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
                        <a href="#">Link to Camera map in the classroom</a>       

                        <video controls width={400}>
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

                        <video controls width={400}>
                            <source src={require("../images/pet.mp4")} type="video/mp4" />
                            Error Message
                        </video>                   
                
            
                    </div>            

                </Col>
        
            </Row>

            <Row>

                <Col>
                    <Button>Add an event</Button>
                    <br/>
                    <select size="5">
                        <option>Event1</option>
                        <option>Event2</option>
                    </select>             
                </Col>

                <Col>
                    <p>Start Time</p>
                    <input></input>

                    <p>End Time</p>
                    <input></input>          
                </Col>

                <Col>

                        <a href="#">Link to Spell Checker</a>
                        <br/>
                        <textarea></textarea>
                        <br/>
                        <Button variant='success'>Save</Button>                


                </Col>

            </Row>
    
        </Container>  
    );
}
