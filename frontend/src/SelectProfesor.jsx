import React, { useState, useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Service from './services/BloqueService';

const service = new Service();

const asignarProfesor = (e, sel) => {
	console.log(sel);
};

const SelectProfesor = (props) => {
	const [ profesores, setProfesores ] = useState([]);
	const [ selectedProfesor, setSelectedProfesor ] = useState('');
	let profesoresEmpty = [ { value: '', display: '(Seleccionar Profesor)' } ];

	useEffect(
		() => {
			//console.log('child', props.id_asig);
			setProfesores(props.listProfesores);
		},
		[ props.listProfesores ]
	);

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
};
export default SelectProfesor;
//onClick={() => asignarProfesor(e, this.state.selectedProfesor)}
