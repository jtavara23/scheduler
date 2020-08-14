import React, { useState, useEffect } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Service from './services/BloqueService';

const service = new Service();

const asignarProfesor = (e, sel) => {
	console.log(sel);
};

const SelectProfesor = forwardRef((props, ref) => {
	const [ profesores, setProfesores ] = useState([]);
	const [ selectedProfesor, setSelectedProfesor ] = useState('');
	let profesoresEmpty = [ { value: '', display: '(Seleccionar Profesor)' } ];
	let asignacion_id = props.id_asig[0];

	useEffect(() => {
		setProfesores(profesoresEmpty);
	}, []);

	useImperativeHandle(ref, () => ({
		loadAvaliableProf() {
			console.log(asignacion_id);
			service
				.getProfesores_available({
					periodo: 5,
					dia_fecha: 'JUEVES',
					hora_ini: '18:55:00',
					hora_fin: '19:40:00'
				})
				.then((result) => {
					//console.log(result);
					let data = result.data;
					let profesoresFromApi = data.map((prof) => {
						return { value: prof.id_prof, display: prof.nombre_prof + '-' + prof.code_prof };
					});
					let profesores = [
						{
							value: '',
							display: '(Seleccionar Profesor)'
						}
					];
					setProfesores(profesores.concat(profesoresFromApi));
				})
				.catch((error) => {
					console.log(error);
				});
		},

		cleanDropdown() {
			setProfesores(profesoresEmpty);
		}
	}));

	return (
		<div>
			<select value={selectedProfesor} onChange={(e) => setSelectedProfesor(e.target.value)}>
				{profesores.map((prof) => (
					<option key={prof.value} value={prof.value}>
						{prof.display}
					</option>
				))}
			</select>
			<a>
				<Fab variant="extended" size="small" color="primary" aria-label="add">
					<AddIcon />
					ASIGNAR
				</Fab>
			</a>
		</div>
	);
});
export default SelectProfesor;
//onClick={() => asignarProfesor(e, this.state.selectedProfesor)}
