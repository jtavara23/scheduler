import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { withRouter } from 'react-router-dom';
import Service from './services/BloqueService';

const service = new Service();

const useStyles = (theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(2),
			width: '25ch'
		}
	},
	button: {
		margin: theme.spacing(4)
	}
});

function createJsonFecha(param) {
	let data = param.split('-');
	return {
		dia_fecha: data[0],
		hora_ini: data[1],
		hora_fin: data[2]
	};
}

class Bloque_CreateUpdate extends React.Component {
	constructor(props) {
		super(props);
		this.fecha_id = 0;
		this.periodo_id = 0;
		this.bloque_id = 0;

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const { match: { params } } = this.props;
		this.history = this.props.history;
		//console.log(this.history);
		if (params && params.pk) {
			service.getBloque(params.pk).then((c) => {
				let data = c.data;
				this.bloque_id = data.id;
				this.fecha_id = data.fecha;
				this.periodo_id = data.periodo;

				this.refs.escuela.value = data.escuela_nombre;
				this.refs.curso.value = data.curso_nombre;
				this.refs.aula.value = data.aula;
				this.refs.horas.value = data.cargaHora;

				if (c.data.nrc_t) this.refs.nrc_t.value = data.nrc_t;
				else if (data.nrc_p) this.refs.nrc_p.value = data.nrc_p;
				else this.refs.nrc_l.value = data.nrc_l;

				let fecha_id = data.fecha;
				service.getFecha(fecha_id).then((f) => {
					if (f) {
						this.refs.dia.value = f.dia_fecha;
						this.refs.hora_ini.value = f.hora_ini;
						this.refs.hora_fin.value = f.hora_fin;
					} else console.log('No fecha id');
				});
			});
			this.refs.boton.value = 'Editar';
		}
	}

	handleSubmit(event) {
		const { match: { params } } = this.props;
		if (params && params.pk) {
			this.handleUpdate(params.pk);
		} else {
			this.handleCreate();
		}
		event.preventDefault();
	}

	handleCreate() {
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
	}

	handleUpdate(pk) {
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
							bloque: this.bloque_id,
							fecha: fecha_id,
							periodo: this.periodo_id
						})
						.then((result) => {
							console.log(' Bloque Actualizado!!');
							this.history.push('/');
						});
				});
		});
	}

	render() {
		const { classes } = this.props;
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label>Escuela:</label>
					<input className="form-control" type="text" ref="escuela" />

					<label> curso:</label>
					<input className="form-control" type="text" ref="curso" />

					<label>aula</label>
					<input className="form-control" type="text" ref="aula" />

					<label>nrc_t:</label>
					<input className="form-control" type="text" ref="nrc_t" />
					<label>nrc_p:</label>
					<input className="form-control" type="text" ref="nrc_p" />
					<label>nrc_l:</label>
					<input className="form-control" type="text" ref="nrc_l" />

					<label>horas:</label>
					<input className="form-control" type="text" ref="horas" />

					<label>Nro de Profesores:</label>
					<input className="form-control" type="text" ref="nroProfesores" />

					<label>Dia:</label>
					<input className="form-control" type="text" ref="dia" />

					<label>Hora Ini:</label>
					<input className="form-control" type="text" ref="hora_ini" />

					<label>Hora fin</label>
					<input className="form-control" type="text" ref="hora_fin" />

					<input className="btn btn-primary" type="submit" ref="boton" value="Crear" />
				</div>
			</form>
		);
	}
}

export default withStyles(useStyles)(withRouter(Bloque_CreateUpdate));
