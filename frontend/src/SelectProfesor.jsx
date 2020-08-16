import React, { useState, useEffect } from 'react';
import Service from './services/BloqueService';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, lighten } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
	root: { backgroundColor: lighten(theme.palette.secondary.light, 0.85) },
	button: {
		margin: theme.spacing(2)
	},
	formControl: {
		minWidth: 180,
		padding: '2px 3px'
	}
}));

const service = new Service();

const asignarProfesor = (e, sel) => {
	console.log(sel);
};

const SelectProfesor = (props) => {
	const [ profesores, setProfesores ] = useState([]);
	const [ selectedProfesor, setSelectedProfesor ] = useState('');
	const classes = useStyles();

	useEffect(
		() => {
			//console.log('child', props.id_asig);
			setProfesores(props.listProfesores);
		},
		[ props.listProfesores ]
	);

	return (
		<Paper className={classes.root}>
			<FormControl className={classes.formControl}>
				<InputLabel id="demo-simple-select-label">Seleccionar Profesor</InputLabel>
				<Select
					labelId="seleccionar-profesor"
					id="selec-profesor"
					value={selectedProfesor}
					onChange={(e) => setSelectedProfesor(e.target.value)}
				>
					{profesores.map((prof) => (
						<MenuItem key={prof.value} value={prof.value} dense={true}>
							{prof.display}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Fab className={classes.button} variant="extended" size="small" color="primary" aria-label="add">
				<AddIcon /> ASIGNAR
			</Fab>
		</Paper>
	);
};
export default SelectProfesor;
//onClick={() => asignarProfesor(e, this.state.selectedProfesor)}
