import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Service from './services/BloqueService';

const service = new Service();

class SelectProfesor extends Component {
	state = {
		profesores: [],
		selectedProfesor: '',
		validationError: ''
	};

	componentDidMount() {
		service
			.getProfesores_available({
				periodo: 5,
				dia_fecha: 'LUNES',
				hora_ini: '08:50:00',
				hora_fin: '11:30:00'
			})
			.then((result) => {
				console.log(result);
				let data = result.data;
				let profesoresFromApi = data.map((team) => {
					console.log(team.nombre_prof);
					return { value: team.id_prof, display: team.nombre_prof + '-' + team.code_prof };
				});

				this.setState({
					profesores: [
						{
							value: '',
							display: '(Seleccionar Profesor)'
						}
					].concat(profesoresFromApi)
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}
	asignarProfesor = (e, sel) => {
		console.log(sel);
	};

	render() {
		return (
			<div>
				<select
					value={this.state.selectedProfesor}
					onChange={(e) =>
						this.setState({
							selectedProfesor: e.target.value,
							validationError: e.target.value === '' ? 'selecciona un Profesor' : ''
						})}
				>
					{this.state.profesores.map((team) => (
						<option key={team.value} value={team.value}>
							{team.display}
						</option>
					))}
				</select>
				<div
					style={{
						color: 'red',
						marginTop: '5px'
					}}
				>
					{this.state.validationError}
				</div>
				<a>
					<Fab variant="extended" size="small" color="primary" aria-label="add">
						<AddIcon />
						ASIGNAR
					</Fab>
				</a>
			</div>
		);
	}
}
export default SelectProfesor;
//onClick={() => asignarProfesor(e, this.state.selectedProfesor)}
