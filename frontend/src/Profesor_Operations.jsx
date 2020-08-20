import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Service from './services/BloqueService';

const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(2),
			width: '25ch'
		}
	},
	button: {
		margin: theme.spacing(1)
	},
	formControl: {
		margin: theme.spacing(7),
		minWidth: 180
	},
	selectEmpty: {
		margin: theme.spacing(4)
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
}));

const Profesor_Operations = (props) => {
	const classes = useStyles();
	const [ update, setUpdate ] = useState(false);
	const [ profesor_id, setProfesor_id ] = useState('');
	const [ nombreProfesor, setNombreProfesor ] = useState('');
	const [ codeProfesor, setnewCodeProfesor ] = useState('');

	useEffect(() => {
		setProfesor_id(props.profesorId);

		if (props.accion_update) {
			setNombreProfesor(props.profesorName);
			setnewCodeProfesor(props.profesorCode);
			setUpdate(true);
		} else {
			setNombreProfesor('Apellido + Nombre');
			setnewCodeProfesor('000');
		}
	}, []);

	const handleSubmit = (e) => {
		if (update) {
			service
				.updateProfesor({
					id: profesor_id,
					id_profesor: codeProfesor,
					nombre: nombreProfesor
				})
				.then((rr) => {
					props.refreshDataOnParent(profesor_id, codeProfesor, nombreProfesor);
				});
		} else {
			let newProfesorId = '';
			service
				.createProfesor({
					id_profesor: codeProfesor,
					nombre: nombreProfesor
				})
				.then((res) => {
					newProfesorId = res.data.id;
					props.refreshDataOnParent(newProfesorId, codeProfesor, nombreProfesor);
				});
		}
	};

	return (
		<Paper className={classes.paper}>
			{update ? (
				<a>
					<TextField
						name="codigoProfesor"
						label="Codigo Profesor"
						value={codeProfesor}
						onChange={(e) => setnewCodeProfesor(e.target.value)}
					/>
					<TextField
						name="EditarNombre"
						label="Editar nombre de Profesor"
						value={nombreProfesor}
						onChange={(e) => setNombreProfesor(e.target.value)}
					/>
				</a>
			) : (
				<a>
					<TextField
						name="codigoProfesor"
						label="Codigo Profesor"
						value={codeProfesor}
						onChange={(e) => setnewCodeProfesor(e.target.value)}
					/>

					<TextField
						name="NuevoProfesor"
						label="Nombre Profesor"
						value={nombreProfesor}
						onChange={(e) => setNombreProfesor(e.target.value)}
					/>
				</a>
			)}
			<Button
				className={classes.button}
				color="primary"
				startIcon={<SaveIcon />}
				variant="outlined"
				onClick={(e) => handleSubmit(e)}
			>
				{update ? 'Actualizar' : 'Crear'}
			</Button>
		</Paper>
	);
};

export default withStyles(useStyles)(Profesor_Operations);
