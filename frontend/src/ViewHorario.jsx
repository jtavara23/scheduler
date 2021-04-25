import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, Appointments, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Service from './services/BloqueService';

const service = new Service();

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(85),
		paddingRight: theme.spacing(1)
	},

	title: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.palette.primary.main,
		backgroundColor: lighten(theme.palette.primary.light, 0.85)
	}
}));

export default function ViewHorario(props) {
	const { match: { params } } = props;
	const [ datax, setData ] = useState('');
	const [ profesor, setProfesor ] = useState('');
	const [ periodo, setPeriodo ] = useState('');
	const [ carga, setCarga ] = useState('');
	const classes = useToolbarStyles();

	useEffect(() => {
		let datos = {
			periodo: params.periodo,
			profesor: params.profId
		};
		let horario = [];

		service.getProfesorHorario(datos).then((result) => {
			let dax = result.data;

			function formatInfo(curso_nombre_id, nrc_t, nrc_p, nrc_l, aula) {
				//let curso_nombre = curso_nombre_id.split(' ');
				if (nrc_t) return curso_nombre_id + ' T-' + nrc_t + ' | ';
				if (nrc_p) return curso_nombre_id + ' P-' + nrc_p + ' | ';
				if (nrc_l) return curso_nombre_id + ' L-' + nrc_l + ' | ';
			}

			function formatDate(dia, time) {
				let hora = time.split(':');
				switch (dia) {
					case 'LUNES':
						return new Date(2020, 5, 1, hora[0], hora[1]);
					case 'MARTES':
						return new Date(2020, 5, 2, hora[0], hora[1]);
					case 'MIERCOLES':
						return new Date(2020, 5, 3, hora[0], hora[1]);
					case 'JUEVES':
						return new Date(2020, 5, 4, hora[0], hora[1]);
					case 'VIERNES':
						return new Date(2020, 5, 5, hora[0], hora[1]);
					case 'SABADO':
						return new Date(2020, 5, 6, hora[0], hora[1]);
					default:
						return new Date(2020, 5, 7, hora[0], hora[1]);
				}
			}
			//console.log(dax);
			dax.map((dd) => {
				let info = formatInfo(dd.curso_nombre_id, dd.nrc_t, dd.nrc_p, dd.nrc_l, dd.aula);
				let startDt = formatDate(dd.dia_fecha, dd.hora_ini);
				let endDt = formatDate(dd.dia_fecha, dd.hora_fin);

				horario.push({
					title: info,
					startDate: startDt,
					endDate: endDt
				});
			});
			setData({ data: horario });

			service.getPeriodoNombre(params.periodo).then((result) => {
				setPeriodo(result.nombre);
			});
			service.getProfesor(params.profId).then((result) => {
				setProfesor(result.nombre + ' ID (' + result.id_profesor + ')');
			});
			service
				.getCargaTotal({
					periodo: params.periodo,
					profesor: params.profId
				})
				.then((result) => {
					setCarga(result[0].carga);
				});
		});
	}, []);

	return (
		<Paper>
			<Typography className={classes.title} variant="h5" id="tableTitle" component="div">
				{' Profesor: ' + profesor}
			</Typography>
			<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
				{'PERIODO: ' + periodo + ', carga: ' + carga}
			</Typography>

			<Scheduler data={datax.data} height={'auto'}>
				<ViewState currentDate={'2020-06-03'} />
				<WeekView cellDuration={60} startDayHour={6} endDayHour={23} excludedDays={[ 0 ]} />
				<Appointments />
				<AppointmentTooltip />
			</Scheduler>
		</Paper>
	);
}
