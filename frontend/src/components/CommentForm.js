/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export default function CommentForm({ videoHash}) {
	const [times, setTimes] = useState({
		startTime : "",
		endTime : "",
	});

	const [commentText, setCommentText] = useState({
		entry1 : "",
		entry2 : "",
		entry3 : "",
		entry4 : "",
		entry5 : "",
		entry6 : "",

	});
	const [isCommentButtonEnabled, setIsCommentButtonEnabled] = useState(false);
	const { addToast } = useToasts();
	const updateTime = e=>{
		setTimes({
			...times,
			[e.target.name]:e.target.value
		});
	};
	const updateField = e => {
		setCommentText({
		  ...commentText,
		  [e.target.name]: e.target.value
		});
	  };
	useEffect(() => {
		// This is a cheat but it's a quick fix for removing the red validation error 
		// showing on text field after submitting a comment
		if(!commentText) {
			document.getElementById("comment-form").reset();
			setIsCommentButtonEnabled(false);
		} else {
			setIsCommentButtonEnabled(true);
		}
	}, [commentText]);

	const onSubmit = async (e) => {
		e.preventDefault();

		setIsCommentButtonEnabled(false);
		const res = await writeCommentToApi();

		if(res.success) {
			setCommentText("");
			// onCommentAdded();
			addToast("Comment added", {
				appearance: "success",
				autoDismiss: true
			});
		} else {
			setIsCommentButtonEnabled(true);
			addToast(`Error adding comment: ${e.message}`, {
				appearance: "danger",
				autoDismiss: true
			});
		}
	};

	const writeCommentToApi = async () => {
		console.log({
			formData: {
				CommentText: commentText,
				Times: times,
				VideoHash: videoHash
			}
		});
		const res = await authPost("http://localhost:3001/dev/addCommentToVideo", {
			formData: {
				CommentText: commentText,
				Times: times,
				VideoHash: videoHash
			}
		});

		return res;
	};

	return (
		<Form onSubmit={onSubmit} name="" method="get" action="/watch" className="mt-2" id="comment-form">
			{/* <InputGroup> */}
				<InputGroup>
				<span className="input-group-text">Start time and End time</span>
				<Form.Control
					type="text"
					value={times.startTime}
					name = "startTime"
					onChange={updateTime}
					placeholder="1:00"
					required
				/>
				<Form.Control
					type="text"
					value={times.endTime}
					name = "endTime"
					onChange={updateTime}
					required
					placeholder="1:30"
				/>
				</InputGroup>
				
				<Form.Control
					type="text"
					value={commentText.entry1}
					name = "entry1"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="text"
					value={commentText.entry2}
					name = "entry2"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="text"
					value={commentText.entry3}
					name = "entry3"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="text"
					value={commentText.entry4}
					name = "entry4"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="text"
					value={commentText.entry5}
					name = "entry5"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="text"
					value={commentText.entry6}
					name = "entry6"
					onChange={updateField}
					required
				/>
				<Form.Control
					type="submit"
					value="Submit"
					className="btn btn-success"
					style={{ maxWidth: "110px" }}
					disabled={!isCommentButtonEnabled}
				/>
			{/* </InputGroup> */}
		</Form>
	);
}
