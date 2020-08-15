import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withRouter } from 'react-router-dom';
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
		margin: theme.spacing(4)
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

const Bloque_CreateUpdate = (props) => {
	const classes = useStyles();
	const [ bloque_id, setBloque_id ] = useState(0);
	const [ fecha_id, setFecha_id ] = useState(0);
	const [ periodo_id, setPeriodo_id ] = useState(0);
	const [ escuela, setEscuela ] = useState([ { value: '', display: '(Seleccionar Escuela)' } ]);
	const [ selectedEscuela, setSelectedEscuela ] = useState('');
	const [ curso, setCurso ] = useState([ { value: '', display: '(Seleccionar Curso)' } ]);
	const [ selectedCurso, setSelectedCurso ] = useState('');
	const [ aula, setAula ] = useState('');
	const [ cargaHora, setCargaHora ] = useState(0);
	const [ nrc_t, setnrc_t ] = useState('');
	const [ nrc_p, setnrc_p ] = useState('');
	const [ nrc_l, setnrc_l ] = useState('');
	const [ dia, setDia ] = useState('');
	const [ hora_ini, setHora_ini ] = useState('');
	const [ hora_fin, setHora_fin ] = useState('');
	const [ history, setHistory ] = useState('');

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

		if (params && params.pk) {
			service.getBloque(params.pk).then((c) => {
				let data = c.data;
				setBloque_id(data.id);
				setFecha_id(data.fecha);
				setPeriodo_id(data.periodo);

				setSelectedEscuela(data.escuela_nombre);
				setSelectedCurso(data.curso_nombre);
				setAula(data.aula);
				setCargaHora(data.cargaHora);
				if (c.data.nrc_t) setnrc_t(data.nrc_t);
				else if (data.nrc_p) setnrc_p(data.nrc_p);
				else setnrc_l(data.nrc_l);

				let fecha_id = data.fecha;
				service.getFecha(fecha_id).then((f) => {
					if (f) {
						setDia(f.dia_fecha);
						setHora_ini(f.hora_ini);
						setHora_fin(f.hora_fin);
					} else console.log('No fecha id');
				});
			});
			//this.refs.boton.value = 'Editar';
		}
	}, []);

	//console.log(this.history);

	const handleSubmit = (event) => {
		const { match: { params } } = props;
		/* if (params && params.pk) {
			this.handleUpdate(params.pk);
		} else {
			this.handleCreate();
		} */
		event.preventDefault();
	};

	const handleCreate = () => {
		let param = this.refs.dia.value + '-' + this.refs.hora_ini.value + '-' + this.refs.hora_fin.value;
		let fecha_id = 0;
		let bloque_id = 0;
		let periodo_id = 5;

		service
			.createFecha(createJsonFecha(param))
			.then((result) => {
				console.log('Fecha obtained', result.data);
				fecha_id = result.data.id;
				// CREATE BLOQUE ID
				service
					.createBloque({
						nrc_t: this.refs.nrc_t.value,
						nrc_p: this.refs.nrc_p.value,
						nrc_l: this.refs.nrc_l.value,
						aula: this.refs.aula.value,
						cargaHora: this.refs.horas.value,
						curso_nombre: this.refs.curso.value,
						escuela_nombre: this.refs.escuela.value,
						fecha: fecha_id,
						periodo: periodo_id
					})
					.then((result) => {
						bloque_id = result.data.id;
						console.log('bloque created ', bloque_id);

						// CREATE ASIGNACION , DEFAULT PROFESOR (25 -28)
						let nro_prof = this.refs.nroProfesores.value;
						let profesor_default_id = 25;

						const forLoop = async (_) => {
							for (let index = 0; index < nro_prof; index++) {
								const asig = await service.createAsignacion({
									bloque: bloque_id,
									fecha: fecha_id,
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
								cargaTotal_profesor = cargaTotal_profesor + Number(this.refs.horas.value);

								let res = await service.updateCargaProfesor({
									id: hpp_id, // hora_profesor_periodo_id
									carga: cargaTotal_profesor,
									periodo: periodo_id,
									profesor: profesor_default_id
								});
								console.log('updated carga of ', profesor_default_id, res);

								profesor_default_id = profesor_default_id + 1;
							}
							this.history.push('/');
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
		let param = this.refs.dia.value + '-' + this.refs.hora_ini.value + '-' + this.refs.hora_fin.value;

		service.updateFecha(createJsonFecha(param)).then((result) => {
			let fecha_id = result.data.id;
			service
				.updateBloque({
					id: this.bloque_id,
					nrc_t: this.refs.nrc_t.value,
					nrc_p: this.refs.nrc_p.value,
					nrc_l: this.refs.nrc_l.value,
					aula: this.refs.aula.value,
					cargaHora: this.refs.horas.value,
					curso_nombre: this.refs.curso.value,
					escuela_nombre: this.refs.escuela.value,
					fecha: fecha_id,
					periodo: this.periodo_id
				})
				.then((response) => {
					service
						.updateAsignacion_Fecha({
							// you can not change bloque or periodo in Asignacion (just fecha and profesor)
							// API asignacion_bloque_get_update(request, bloque_id):
							bloque: this.bloque_id,
							fecha: fecha_id,
							periodo: this.periodo_id
						})
						.then((result) => {
							service.getAsignacion_byBloque(this.bloque_id).then((res) => {
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
											cargaTotal_profesor + Number(this.refs.horas.value) - this.loadedCargaHora;

										let res = await service.updateCargaProfesor({
											id: hpp_id, // hora_profesor_periodo_id
											carga: cargaTotal_profesor,
											periodo: bloque.periodo_id,
											profesor: bloque.profesor_id
										});
										console.log('updated carga of ', bloque.profesor_id, res);
									}
									console.log(' Bloque Actualizado!!');
									this.history.push('/');
								};
								forLoop();
							});
						});
				});
		});
	};

	return (
		<form className={classes.root} noValidate autoComplete="off">
			<Select
				labelId="seleccionar-escuela"
				id="selec-escuela"
				value={selectedEscuela}
				onChange={(e) => setSelectedEscuela(e.target.value)}
			>
				{escuela.map((esc) => (
					<MenuItem value={esc.value} key={esc.value}>
						{esc.display}
					</MenuItem>
				))}
			</Select>

			<TextField
				name="curso"
				label="Curso"
				value={selectedCurso}
				onChange={(e) => setSelectedCurso(e.target.value)}
			/>

			<TextField name="nrc_t" label="NRC_T" value={nrc_t} onChange={(e) => setnrc_t(e.target.value)} />
			<TextField name="nrc_p" label="NRC_P" value={nrc_p} onChange={(e) => setnrc_p(e.target.value)} />
			<TextField name="nrc_l" label="NRC_L" value={nrc_l} onChange={(e) => setnrc_l(e.target.value)} />

			<TextField name="aula" label="Aula" value={aula} onChange={(e) => setAula(e.target.value)} />

			<TextField
				name="cargaHora"
				label="Carga Horaria"
				value={cargaHora}
				onChange={(e) => setCargaHora(e.target.value)}
			/>

			<TextField name="dia" label="DIA" value={dia} onChange={(e) => setDia(e.target.value)} />
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

			<Button
				className={classes.button}
				color="primary"
				startIcon={<SaveIcon />}
				variant="outlined"
				onClick={(e) => handleSubmit(e)}
			>
				Agregar
			</Button>
		</form>
	);
};

export default withStyles(useStyles)(withRouter(Bloque_CreateUpdate));
