import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Browse from "./pages/Browse";
import { AuthWrapper } from "./components/AuthWrapper";
import Settings from "./pages/Settings";
import Main from "./pages/Main";
import Result from "./pages/Result";
import Gallary from "./pages/Gallary";
import { ToastProvider } from "react-toast-notifications";


export default function App() {
	return (
		<AuthWrapper>
			<ToastProvider>
				<Router basename={process.env.PUBLIC_URL}>
					<Layout>
						<Routes>
							<Route path="/" exact element={<Browse />} />
							<Route path="/site/:siteName" exact element={<Gallary />} />
							<Route path="/settings" exact element={<Settings />} />
							<Route path="/main/:path" exact element={<Main />} />
							<Route path="/result/:key" exact element={<Result />} />
						</Routes>
					</Layout>
				</Router>
			</ToastProvider>
		</AuthWrapper>
	);
}
