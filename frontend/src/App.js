import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter keeps the UI in sync with the URL using the HTML5 history API.
import { Route } from 'react-router-dom';
import './App.css';
import Periodo from './Periodo';
import TablaBloque from './TablaBloque';
import TablaBloque_CreateUpdate from './TablaBloque_CreateUpdate';
import ViewHorario from './ViewHorario';
import Configuraciones from './Configuraciones';
import PrintIcon from '@material-ui/icons/Print';
import HomeIcon from '@material-ui/icons/Home';

const BaseLayout = () => (
	<div className="container-fluid">
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="/">
				<HomeIcon />PAGINA PRINCIPAL
			</a>
			<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
				<div className="navbar-nav">
					<a className="nav-item nav-link" href="/horario/configuraciones">
						CONFIGURACIONES
					</a>
				</div>
			</div>
			<button onClick={() => window.print()}>
				<PrintIcon />
			</button>
		</nav>
		<div className="content">
			<Route path="/" exact component={Periodo} />
			<Route path="/horario/configuraciones" exact component={Configuraciones} />
			<Route path="/:periodo" exact component={TablaBloque} />
			<Route path="/:periodo/bloque/" exact component={TablaBloque_CreateUpdate} />
			<Route path="/:periodo/bloque/:pk" exact component={TablaBloque_CreateUpdate} />
			<Route path="/:periodo/view_horario/:profId" exact component={ViewHorario} />
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
