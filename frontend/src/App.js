import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter keeps the UI in sync with the URL using the HTML5 history API.
import { Route } from 'react-router-dom';
import './App.css';
import TablaBloque from './TablaBloque';

const BaseLayout = () => (
	<div className="container-fluid">
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="#">
				PROGRAMA HORARIO
			</a>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNavAltMarkup"
				aria-controls="navbarNavAltMarkup"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
				<div className="navbar-nav">
					<a className="nav-item nav-link" href="/">
						DETALLES
					</a>
					<a className="nav-item nav-link" href="/curso">
						CREATE NUEVO CURSO
					</a>
				</div>
			</div>
		</nav>
		<div className="content">
			<Route path="/" exact component={TablaBloque} />
		</div>
	</div>
);

/**
 * We have wrapped the BaseLayout component with the BrowserRouter component 
 * since our app is meant to run in the browser.
 */
class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<BaseLayout />
			</BrowserRouter>
		);
	}
}

export default App;
