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

const SelectProfesor = (props) => {
	// props: listProfesores, id_asignacion, id_profesor, horas, id_periodo
	const classes = useStyles();
	const [ selectedProfesor, setSelectedProfesor ] = useState('');
	const [ profesores, setProfesores ] = useState([]); //profesores available to choose
	const [ asignacion_id, setasignacion_id ] = useState(0);
	const [ profesor_id, setprofesor_id ] = useState(0);
	const [ horas, sethoras ] = useState(0);
	const [ periodo_id, setperiodo_id ] = useState(0);

	useEffect(
		() => {
			console.log('child', props);
			setProfesores(props.listProfesores);
			setasignacion_id(props.id_asignacion);
			setprofesor_id(props.id_profesor);
			sethoras(props.horas);
			setperiodo_id(props.id_periodo);
		},
		[ props.listProfesores ]
	);

	const asignarProfesor = (e) => {
		console.log(selectedProfesor);
		service
			.updateAsignacionProfesor({
				// you can not change bloque or periodo in Asignacion (just fecha and profesor)
				// API asignacion_bloque_get_update(request, bloque_id):
				id: asignacion_id,
				profesor: selectedProfesor
			})
			.then((result) => {
				console.log('asginacion Update');
				service.getHoraProfePeriodo(periodo_id + '-' + profesor_id).then((response) => {
					let hpp_id = response.id;
					let cargaTotal_profesor = response.carga;
					cargaTotal_profesor = cargaTotal_profesor - horas;
					service
						.updateCargaProfesor({
							id: hpp_id, // hora_profesor_periodo_id
							carga: cargaTotal_profesor,
							periodo: periodo_id,
							profesor: profesor_id
						})
						.then((response2) => {
							console.log('we update cargaHoraria sucessfully of ', profesor_id);
						})
						.catch(() => {
							console.log('Error updating carga Previous Profesor');
						});
				});
				service.getHoraProfePeriodo(periodo_id + '-' + selectedProfesor).then((response) => {
					let hpp_id = response.id;
					let cargaTotal_profesor = response.carga;
					cargaTotal_profesor = cargaTotal_profesor + horas;
					service
						.updateCargaProfesor({
							id: hpp_id, // hora_profesor_periodo_id
							carga: cargaTotal_profesor,
							periodo: periodo_id,
							profesor: selectedProfesor
						})
						.then((response2) => {
							console.log('we update cargaHoraria sucessfully of', selectedProfesor);
						})
						.catch(() => {
							console.log('Error updating carga New Profesor');
						});
				});
			});
	};

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

			<Fab
				className={classes.button}
				variant="extended"
				size="small"
				color="primary"
				aria-label="add"
				onClick={(e) => asignarProfesor(e)}
			>
				<AddIcon /> ASIGNAR
			</Fab>
		</Paper>
	);
};
export default SelectProfesor;
//onClick={() => asignarProfesor(e, this.state.selectedProfesor)}
