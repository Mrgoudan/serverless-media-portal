import React from "react";
import { Col, Row } from "react-bootstrap";
import ManageUsersTable from "../components/ManageUsersTable";
import ManageTagsTable from "../components/ManageTagsTable";
import SyncVideos from "../components/SyncVideos";
export default function Settings() {
	return (
		<Row className="mx-1 mt-4">
			<Col md={12} lg={8}>
				<ManageUsersTable />
			</Col>
			<Col md={12} lg={4}>
				<ManageTagsTable />
			</Col>
			<Col  md={12} lg={4}>
				<SyncVideos/>
			</Col>
		</Row>
	);
}