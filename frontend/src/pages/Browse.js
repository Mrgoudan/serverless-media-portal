import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { authGet } from "../lib/auth-fetch";
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";  
import Card from 'react-bootstrap/Card';

const VideoTitle = styled.div`
	font-weight: 600;
	font-size: 1em;
	line-height: 1.6;
	margin-top: 4px;
	display: inline;
`;


export default function Browse() {
	const [isLoading, setIsLoading] = useState(true);
    const [paths] = useState([]);  

    useEffect(() => {
        loadOps();
    }, []);	

	// To get all the website names
    const loadOps = async () => {
        const res = await authGet("http://localhost:3001/dev/getFilePath");

		for (let obj in res.filePath) {
			paths.push(res.filePath[obj]);
		}
        
		setIsLoading(false);
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
				<>
					{Object.values(paths).map((siteName) =>
						<Card key={siteName}>
							<Card.Header>
								<Link to={`/site/${siteName}`}>
									<VideoTitle>{siteName}</VideoTitle>
								</Link>									
							</Card.Header>
						
						</Card>

					)}
				</>
			)}
		</div>								
	);
}

