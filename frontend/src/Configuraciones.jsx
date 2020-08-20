import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withRouter } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Service from './services/BloqueService';

const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(3)
	},
	button: {
		margin: theme.spacing(1)
	},
	formControl: {
		margin: theme.spacing(2),
		minWidth: 180
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
}));

function createJsonFecha(param) {
	let data = param.split('-');
	return {
		dia_fecha: data[0],
		hora_ini: data[1],
		hora_fin: data[2]
	};
}

const Configuraciones = () => {
	const classes = useStyles();
	const [ escuela, setEscuela ] = useState([ { value: '', display: '(Seleccionar Escuela)' } ]);
	const [ selectedEscuela, setSelectedEscuela ] = useState('');
	const [ curso, setCurso ] = useState([ { value: '', display: '(Seleccionar Curso)' } ]);
	const [ selectedCurso, setSelectedCurso ] = useState('');
	const [ nuevaEscuela, setNuevaEscuela ] = useState('');
	const [ nuevoCurso, setNuevoCurso ] = useState('');

	useEffect(() => {
		service.getEscuelas().then((result) => {
			let escuelasFromApi = result.data.map((esc) => {
				return { value: esc.nombre, display: esc.nombre };
			});
			//console.log('profesoresFromApi ', escuelasFromApi);
			setEscuela(escuelasFromApi);
		});
	}, []);

	//console.log(this.history);

	const handleSubmit = (event) => {};

	const loadCursoFromEscuela = (escuela) => {
		let esc = escuela.replace(/ /g, '-');
		service.getCursosOfEscuela(esc).then((result) => {
			let cursosFromApi = result.data.map((cur) => {
				return { value: cur.nombre, display: cur.nombre };
			});
			//console.log('cursos ', cursosFromApi);
			setCurso(cursosFromApi);
		});
	};

	return (
		<Paper className={classes.root}>
			<Paper className={classes.paper}>
				<form className={classes.formControl} noValidate autoComplete="off">
					<FormControl className={classes.formControl}>
						<TextField
							name="escuela"
							label="Nueva Escuela"
							value={nuevaEscuela}
							onChange={(e) => setNuevaEscuela(e.target.value)}
						/>
					</FormControl>

					<div>
						<Button
							className={classes.button}
							color="primary"
							startIcon={<SaveIcon />}
							variant="outlined"
							onClick={(e) => handleSubmit(e)}
						>
							CREAR
						</Button>
					</div>
				</form>
			</Paper>

			<Paper className={classes.paper}>
				<form className={classes.formControl} noValidate autoComplete="off">
					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">Seleccionar Escuela</InputLabel>
						<Select
							labelId="seleccionar-escuela"
							id="selec-escuela"
							value={selectedEscuela}
							onChange={(e) => {
								setSelectedEscuela(e.target.value);
								loadCursoFromEscuela(e.target.value);
							}}
						>
							{escuela.map((esc) => (
								<MenuItem value={esc.value} key={esc.value}>
									{esc.display}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">Seleccionar Curso</InputLabel>
						<Select
							labelId="seleccionar-curso"
							id="selec-curso"
							value={selectedCurso}
							onChange={(e) => setSelectedCurso(e.target.value)}
						>
							{curso.map((curso) => (
								<MenuItem value={curso.value} key={curso.value}>
									{curso.display}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl className={classes.formControl}>
						<TextField
							name="curso"
							label="Nuevo Curso"
							value={nuevoCurso}
							onChange={(e) => setNuevoCurso(e.target.value)}
						/>
					</FormControl>

					<div>
						<Button
							className={classes.button}
							color="primary"
							startIcon={<SaveIcon />}
							variant="outlined"
							onClick={(e) => handleSubmit(e)}
						>
							CREAR
						</Button>
						<Button
							className={classes.button}
							color="primary"
							startIcon={<DeleteIcon />}
							variant="outlined"
							onClick={(e) => handleSubmit(e)}
						>
							ELIMINAR
						</Button>
					</div>
				</form>
			</Paper>

			<Paper className={classes.paper} />
		</Paper>
	);
};

export default withStyles(useStyles)(withRouter(Configuraciones));
