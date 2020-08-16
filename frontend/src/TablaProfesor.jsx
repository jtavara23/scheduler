import React, { useState, useEffect } from 'react';
import Service from './services/BloqueService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/core/styles';
const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		textAlign: 'center'
	},
	container: {
		maxHeight: 810
	},
	boton: {
		padding: '10px 10px'
	}
}));

export default function TablaProfesores(props) {
	const [ data_rows, setData_rows ] = useState([]);

	useEffect(
		() => {
			service.getProfesoresinPeriodo(5).then((result) => {
				setData_rows(result.data);
			});
		},
		[ props.data_bloque ]
	);

	const classes = useStyles();
	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Profesor</TableCell>
							<TableCell>Carga</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data_rows.map((c) => (
							<TableRow key={c.hpp_id}>
								<TableCell size="small">{c.code_profesor} </TableCell>
								<TableCell size="small">{c.nombre}</TableCell>
								<TableCell size="small">{c.carga}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer className={classes.boton}>
				<Fab variant="extended" size="small" color="primary" aria-label="add">
					<VisibilityIcon />
					Ver Horario
				</Fab>
			</TableContainer>
		</Paper>
	);
}
