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
		setPeriodo(props.periodo_id);

		if (props.accion_update) {
			setnewName(props.periodo_name);
			setUpdate(true);
		} else {
			setnewName('Copia ' + props.periodo_name);
		}
	}, []);

	const handleSubmit = (e) => {
		console.log('update', update);
		if (update) {
			service
				.updatePeriodo({
					id: periodo,
					nombre: newName
				})
				.then((rr) => {
					props.refreshDataOnParent(periodo, newName);
				});
		} else {
			service
				.createPeriodo({
					nombre: newName
				})
				.then((result) => {
					let newPeriodo = result.data.id;
					service.getHoraProfePeriodo(periodo).then((result2) => {
						let datos = result2;
						datos.map((obj) => {
							obj.periodo = newPeriodo;
						});
						console.log('datos a duplicar in HoraProfePeriodo ', datos.length);

						service.createHoraProfePeriodo(datos).then((rr) => {
							service.getBloqueFromPeriodo(periodo).then((result3) => {
								let datosBloque = result3;
								let from_ids = datosBloque.map((d) => d.id);
								datosBloque.map((d) => {
									delete d.id;
								});
								datosBloque.map((b) => {
									b.periodo = newPeriodo;
								});
								console.log('datos a Duplicar in Bloque ', datosBloque);
								service.createBloque(datosBloque).then((resultBloque) => {
									let to_ids = resultBloque.data.map((obj) => obj.id);
									let hashMap = {};
									from_ids.forEach((key, i) => (hashMap[key] = to_ids[i]));

									service.getAsignacionFromPeriodo(periodo).then((result4) => {
										let datosAsignacion = result4;
										datosAsignacion.map((asi) => {
											asi.bloque = hashMap[asi.bloque];
											asi.periodo = newPeriodo;
										});

										console.log('datos a duplicar in Asignacion ', datosAsignacion);
										service.createAsignacion(datosAsignacion).then((rr) => {
											console.log('duplicacion finalizada');
											props.refreshDataOnParent(newPeriodo, newName);
										});
									});
								});
							});
						});
					});
				});
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
					value={newName}
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
