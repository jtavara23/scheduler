import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withRouter } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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
		padding: theme.spacing.unit,
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

const dias = [
	{ value: 'LUNES', display: 'LUNES' },
	{ value: 'MARTES', display: 'MARTES' },
	{ value: 'MIERCOLES', display: 'MIERCOLES' },
	{ value: 'MIERCOLES', display: 'JUEVES' },
	{ value: 'VIERNES', display: 'VIERNES' },
	{ value: 'SABADO', display: 'SABADO' },
	{ value: 'DOMINGO', display: 'DOMINGO' }
];

const Bloque_CreateUpdate = (props) => {
	const classes = useStyles();
	const [ bloque_id, setBloque_id ] = useState(0);
	const [ loadedCargaHora, setLoadedCargaHora ] = useState(0);
	const [ periodo_id, setPeriodo_id ] = useState(5);
	const [ escuela, setEscuela ] = useState([ { value: '', display: '(Seleccionar Escuela)' } ]);
	const [ selectedEscuela, setSelectedEscuela ] = useState('');
	const [ curso, setCurso ] = useState([ { value: '', display: '(Seleccionar Curso)' } ]);
	const [ selectedCurso, setSelectedCurso ] = useState('');
	const [ aula, setAula ] = useState('');
	const [ cargaHora, setCargaHora ] = useState(0);
	const [ nrc_t, setnrc_t ] = useState('');
	const [ nrc_p, setnrc_p ] = useState('');
	const [ nrc_l, setnrc_l ] = useState('');
	const [ dia, setDia ] = useState([]);
	const [ selectedDia, setSelectedDia ] = useState('');
	const [ hora_ini, setHora_ini ] = useState('');
	const [ hora_fin, setHora_fin ] = useState('');
	const [ nroProf, setNroProf ] = useState(0);
	const [ history, setHistory ] = useState('');
	const [ actualizar, setActualizar ] = useState(false);
	const { match: { params } } = props;

	useEffect(() => {
		setHistory(props.history);
		console.log('use effect params ', params);

		service.getEscuelas().then((result) => {
			let escuelasFromApi = result.data.map((esc) => {
				return { value: esc.nombre, display: esc.nombre };
			});
			//console.log('profesoresFromApi ', escuelasFromApi);
			setEscuela(escuelasFromApi);
		});

		setDia(dias);

		if (params && params.pk) {
			setActualizar(true);
			service.getBloque(params.pk).then((c) => {
				let data = c.data;
				setBloque_id(data.id);
				setPeriodo_id(data.periodo);
				setSelectedEscuela(data.escuela_nombre);
				setSelectedCurso(data.curso_nombre);
				let escuela = data.escuela_nombre;
				setAula(data.aula);
				setCargaHora(data.cargaHora);
				setLoadedCargaHora(data.cargaHora);
				if (c.data.nrc_t) setnrc_t(data.nrc_t);
				else if (data.nrc_p) setnrc_p(data.nrc_p);
				else setnrc_l(data.nrc_l);

				let fecha_id = data.fecha;
				service.getFecha(fecha_id).then((f) => {
					if (f) {
						setSelectedDia(f.dia_fecha);
						setHora_ini(f.hora_ini);
						setHora_fin(f.hora_fin);
					} else console.log('No fecha id');

					service.getCursosOfEscuela(escuela.replace(/ /g, '-')).then((result) => {
						let cursosFromApi = result.data.map((cur) => {
							return { value: cur.nombre, display: cur.nombre };
						});
						//console.log('cursos ', cursosFromApi);
						setCurso(cursosFromApi);
					});
				});
			});
			//boton.value = 'Editar';
		}
	}, []);

	//console.log(this.history);

	const handleSubmit = (event) => {
		//const { match: { params } } = props;
		if (params && params.pk) {
			handleUpdate(params.pk);
		} else {
			handleCreate();
		}
		event.preventDefault();
	};

	const handleCreate = () => {
		let param = selectedDia + '-' + hora_ini + '-' + hora_fin;
		let new_fecha_id = 0;
		let new_bloque_id = 0;

		service
			.createFecha(createJsonFecha(param))
			.then((result) => {
				console.log('Fecha obtained', result.data);
				new_fecha_id = result.data.id;
				// CREATE BLOQUE ID
				service
					.createBloque({
						nrc_t: nrc_t,
						nrc_p: nrc_p,
						nrc_l: nrc_l,
						aula: aula,
						cargaHora: cargaHora,
						curso_nombre: selectedCurso,
						escuela_nombre: selectedEscuela,
						fecha: new_fecha_id,
						periodo: periodo_id
					})
					.then((result) => {
						new_bloque_id = result.data.id;
						console.log('bloque created ', new_bloque_id);

						// CREATE ASIGNACION , DEFAULT PROFESOR (25 -28)
						let profesor_default_id = 25;

						const forLoop = async (_) => {
							for (let index = 0; index < nroProf; index++) {
								const asig = await service.createAsignacion({
									bloque: new_bloque_id,
									fecha: new_fecha_id,
									periodo: periodo_id,
									profesor: profesor_default_id
								});

								let asignacion_id = asig.data.id;
								console.log('New asignacion created!', asignacion_id);

								// UPDATE CARGA PROFESOR
								const profe_carga = await service.getHoraProfePeriodo(
									periodo_id + '-' + profesor_default_id
								);
								let hpp_id = profe_carga.id;
								let cargaTotal_profesor = profe_carga.carga;
								cargaTotal_profesor = cargaTotal_profesor + Number(cargaHora);

								let res = await service.updateCargaProfesor({
									id: hpp_id, // hora_profesor_periodo_id
									carga: cargaTotal_profesor,
									periodo: periodo_id,
									profesor: profesor_default_id
								});
								console.log('updated carga of ', profesor_default_id, res);

								profesor_default_id = profesor_default_id + 1;
							}
							history.push('/');
						};
						forLoop();
					})
					.catch(() => {
						alert('There was an error! Creating a new Bloque');
					});
			})
			.catch(() => {
				alert('There was an error! Creating a fecha');
			});
	};

	const handleUpdate = (pk) => {
		let param = selectedDia + '-' + hora_ini + '-' + hora_fin;

		service.updateFecha(createJsonFecha(param)).then((result) => {
			let get_fecha_id = result.data.id;
			service
				.updateBloque({
					id: bloque_id,
					nrc_t: nrc_t,
					nrc_p: nrc_p,
					nrc_l: nrc_l,
					aula: aula,
					cargaHora: cargaHora,
					curso_nombre: selectedCurso,
					escuela_nombre: selectedEscuela,
					fecha: get_fecha_id,
					periodo: periodo_id
				})
				.then((response) => {
					service
						.updateAsignacionFecha({
							// you can not change bloque or periodo in Asignacion (just fecha and profesor)
							// API asignacion_bloque_get_update(request, bloque_id):
							bloque: bloque_id,
							fecha: get_fecha_id,
							periodo: periodo_id
						})
						.then((result) => {
							service.getAsignacion_byBloque(bloque_id).then((res) => {
								let bloques = res.data;
								console.log(bloques);
								const forLoop = async (_) => {
									for (let index = 0; index < bloques.length; index++) {
										let bloque = bloques[index];

										// UPDATE CARGA PROFESOR
										const profe_carga = await service.getHoraProfePeriodo(
											bloque.periodo_id + '-' + bloque.profesor_id
										);
										let hpp_id = profe_carga.id;
										let cargaTotal_profesor = profe_carga.carga;
										cargaTotal_profesor =
											cargaTotal_profesor + Number(cargaHora) - Number(loadedCargaHora);

										let res = await service.updateCargaProfesor({
											id: hpp_id, // hora_profesor_periodo_id
											carga: cargaTotal_profesor,
											periodo: bloque.periodo_id,
											profesor: bloque.profesor_id
										});
										console.log('updated carga of ', bloque.profesor_id, res);
									}
									console.log(' Bloque Actualizado!!');
									history.push('/');
								};
								forLoop();
							});
						});
				});
		});
	};

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
		<Paper className={classes.paper}>
			<form className={classes.root} noValidate autoComplete="off">
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
					<TextField name="nrc_t" label="NRC_T" value={nrc_t} onChange={(e) => setnrc_t(e.target.value)} />
					<TextField name="nrc_p" label="NRC_P" value={nrc_p} onChange={(e) => setnrc_p(e.target.value)} />
					<TextField name="nrc_l" label="NRC_L" value={nrc_l} onChange={(e) => setnrc_l(e.target.value)} />
				</FormControl>

				<FormControl className={classes.formControl}>
					<TextField name="aula" label="Aula" value={aula} onChange={(e) => setAula(e.target.value)} />
					<TextField
						name="cargaHora"
						label="Carga Horaria"
						value={cargaHora}
						onChange={(e) => setCargaHora(e.target.value)}
					/>
				</FormControl>

				<FormControl className={classes.formControl}>
					<InputLabel id="demo-simple-select-label">Seleccionar DIA</InputLabel>
					<Select
						labelId="seleccionar-dia"
						id="selec-dia"
						value={selectedDia}
						onChange={(e) => setSelectedDia(e.target.value)}
					>
						{dia.map((d) => (
							<MenuItem value={d.value} key={d.value}>
								{d.display}
							</MenuItem>
						))}
					</Select>

					<TextField
						name="hora_ini"
						label="HORA_INI"
						value={hora_ini}
						onChange={(e) => setHora_ini(e.target.value)}
					/>
					<TextField
						name="hora_fin"
						label="HORA_FIN"
						value={hora_fin}
						onChange={(e) => setHora_fin(e.target.value)}
					/>

					{!actualizar ? (
						<TextField
							name="Numero-Profesores"
							label="Numero de Profesores"
							value={nroProf}
							onChange={(e) => setNroProf(e.target.value)}
						/>
					) : (
						<div />
					)}
				</FormControl>
				<div>
					<Button
						className={classes.button}
						color="primary"
						startIcon={<SaveIcon />}
						variant="outlined"
						onClick={(e) => handleSubmit(e)}
					>
						{actualizar ? 'Actualizar' : 'Crear'}
					</Button>
				</div>
			</form>
		</Paper>
	);
};

export default withStyles(useStyles)(withRouter(Bloque_CreateUpdate));
