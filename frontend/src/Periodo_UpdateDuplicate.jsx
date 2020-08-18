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

const Periodo_New = (props) => {
	const classes = useStyles();
	const [ update, setUpdate ] = useState(false);
	const [ periodo, setPeriodo ] = useState('');
	const [ newName, setnewName ] = useState('');

	useEffect(() => {
		setnewName(props.periodo_name);
		setPeriodo(props.periodo_id);
		if (props.accion_update) {
			setUpdate(true);
		}
	}, []);

	const handleSubmit = (e) => {
		if (update) {
			service
				.updatePeriodo({
					id: periodo,
					nombre: newName
				})
				.then((result) => {
					props.refreshDataOnParent(periodo, newName);
				});
		} else {
		}
	};

	return (
		<Paper className={classes.paper}>
			{update ? (
				<TextField
					name="EditarNombre"
					label="Editar nombre de Periodo"
					value={newName}
					onChange={(e) => setnewName(e.target.value)}
				/>
			) : (
				<TextField
					name="NuevoPeriodo"
					label="Nuevo nombre de Periodo"
					value={'Copia ' + newName}
					onChange={(e) => setnewName(e.target.value)}
				/>
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

export default withStyles(useStyles)(Periodo_New);
