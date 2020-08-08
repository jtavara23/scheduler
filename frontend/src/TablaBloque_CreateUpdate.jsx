import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
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

class Bloque_CreateUpdate extends React.Component {
	constructor(props) {
		super(props);
		this.fecha = 0;
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const { match: { params } } = this.props;
		if (params && params.pk) {
			service.getBloque(params.pk).then((c) => {
				this.id.escuela = c.escuela_nombre;
				this.id.curso = c.curso_nombre;
				this.id.aula = c.aula;
				this.id.horas = c.cargaHora;
				this.id.nrct = c.nrc_t;
				this.id.nrcp = c.nrc_p;
				this.id.nrcl = c.nrc_l;
				this.fecha = c.fecha;
			});
			console.log('>>fe: ', this.fecha);
			service.getFecha(this.fecha).then((c) => {
				this.id.dia = c.dia_fecha;
				this.id.hora_ini = c.hora_ini;
				this.id.hora_fin = c.hora_fin;
			});
		}
	}

	render() {
		const { classes } = this.props;
		return (
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					name="escuela"
					label="Escuela"
					value={this.state.escuela}
					onChange={(e) => this.change(e)}
					errorText={this.state.escuelaError}
				/>

				<TextField
					name="curso"
					label="Curso"
					value={this.state.curso}
					onChange={(e) => this.change(e)}
					errorText={this.state.cursoError}
				/>

				<TextField
					name="nrc"
					label="NRC"
					value={this.state.nrc}
					onChange={(e) => this.change(e)}
					errorText={this.state.nrcError}
				/>

				<TextField
					name="aula"
					label="Aula"
					value={this.state.aula}
					onChange={(e) => this.change(e)}
					errorText={this.state.aulaError}
				/>

				<TextField
					name="cargaHora"
					label="cargaHora"
					value={this.state.cargaHora}
					onChange={(e) => this.change(e)}
					errorText={this.state.cargaHoraError}
				/>

				<Button
					className={classes.button}
					color="primary"
					startIcon={<SaveIcon />}
					variant="outlined"
					onClick={(e) => this.onSubmit(e)}
				>
					Agregar
				</Button>
			</form>
		);
	}
}

export default withStyles(useStyles)(Bloque_CreateUpdate);
