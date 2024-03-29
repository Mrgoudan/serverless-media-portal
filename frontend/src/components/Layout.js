import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import "./Layout.css";
import { ReactComponent as HouseIcon } from "../images/home.svg";
import { clearSavedHash } from "../lib/local-storage";
import isUserAdmin from "../lib/is-user-admin";

/**
 * HTML based on template:
 * Start Bootstrap - Simple Sidebar (https://startbootstrap.com/template/simple-sidebar)
 */
export default function Layout(props) {
	const [isMenuOpen, setIsMenuOpen] = useState(true);
	const [restrictedLinks, setRestrictedLinks] = useState([]);
	const [showConfirmSignoutBtn, setShowConfirmSignoutBtn] = useState(false);

	useEffect(() => {
		loadRestrictedLinks();
	}, []);

	const loadRestrictedLinks = async () => {
		const _restrictedLinks = [];

		if (await isUserAdmin()) {			

			_restrictedLinks.push(
				<Link key="settings" to="/settings" className="list-group-item bg-dark">
					Settings
				</Link>
			);

		}

		setRestrictedLinks(_restrictedLinks);
	};

	const onSignOutClicked = () => {
		setShowConfirmSignoutBtn(true);
	};

	const onConfirmSignOutClicked = () => {
		clearSavedHash();
		window.location.reload();
	};

	const onCancelSignoutClicked = () => {
		setShowConfirmSignoutBtn(false);
	};

	return (
		<div className={`d-flex ${isMenuOpen || "toggled"}`} id="wrapper">
			<div className="bg-dark" id="sidebar-wrapper">
				<div className="sidebar-heading">
					<img src={logo} alt="logo" />
					Video Annotation 
				</div>
				<div className="list-group list-group-flush pt-1">
					<Link to="/" className="list-group-item bg-dark">
					Video Gallery
					</Link>
					{restrictedLinks.map(x => x)}
				</div>
			</div>

			<div id="page-content-wrapper">
				<nav className="navbar navbar-expand-lg navbar-light border-bottom" style={{ justifyContent: "left", boxShadow: "none" }}>
					<div>

						<Link to="/">
							<button className="btn btn-info home-btn">
								<HouseIcon />
							</button>
						</Link>
					</div>

					<button
						className="btn btn-secondary menu-toggle-btn"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						Toggle Menu
					</button>

					

					<div className="ml-auto">
						<button
							className={`btn btn-default ${!showConfirmSignoutBtn || "d-none"}`}
							onClick={onSignOutClicked}
							style={{ border: "1px solid #a0a0a0", opacity: 0.8 }}
						>
						Sign Out
						</button>

						<button
							className={`btn btn-secondary mr-1 ${showConfirmSignoutBtn || "d-none"}`}
							onClick={onCancelSignoutClicked}
						>
						Cancel
						</button>

						<button
							className={`btn btn-danger ml-auto ${showConfirmSignoutBtn || "d-none"}`}
							onClick={onConfirmSignOutClicked}
						>
						Confirm sign out
						</button>
					</div>
				</nav>

				<div className="container-fluid">{props.children}</div>
			</div>
		</div>
	);
}
