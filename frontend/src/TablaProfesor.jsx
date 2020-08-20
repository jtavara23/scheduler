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
import { makeStyles, withStyles } from '@material-ui/core/styles';
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

const StyledTableRow = withStyles((theme) => ({
	/*	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover
		}
	}*/
}))(TableRow);

export default function TablaProfesores(props) {
	const [ data_rows, setData_rows ] = useState([]);
	const [ selected, setSelected ] = React.useState([]);
	const [ history, setHistory ] = useState('');
	const [ periodo_id, setPeriodo_id ] = useState(0);

	useEffect(
		() => {
			setHistory(props.hist);
			setPeriodo_id(props.periodo);
			service.getProfesoresinPeriodo(props.periodo).then((result) => {
				let profesores = result.data;
				profesores = profesores.filter((obj) => obj.code_profesor !== '+++');
				setData_rows(profesores);
			});
		},
		[ props.data_bloque ]
	);

	const classes = useStyles();

	const isSelected = (profesorSeleccionado) => selected.indexOf(profesorSeleccionado) !== -1;

	const handleClick = (event, profesorID) => {
		const selectedIndex = selected.indexOf(profesorID);
		let newSelected = [];

		if (selectedIndex === -1) {
			//select from row
			newSelected = newSelected.concat(selected, profesorID);
		} else if (selectedIndex === 0) {
			//unselect from row
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		//console.log('profesorID ', profesorID);
		setSelected(newSelected);
	};

	const goToViewHorario = (e) => {
		//console.log('Profe, sele ', selected[0]);
		history.push('/' + periodo_id + '/view_horario/' + selected[0]);
	};

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
						{data_rows.map((c) => {
							const isItemSelected = isSelected(c.id_profesor);

							return (
								<TableRow
									key={c.hpp_id}
									hover
									selected={isItemSelected}
									onClick={(event) => handleClick(event, c.id_profesor)}
								>
									<TableCell size="small">{c.code_profesor} </TableCell>
									<TableCell size="small">{c.nombre}</TableCell>
									<TableCell size="small">{c.carga}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer className={classes.boton}>
				<Fab
					variant="extended"
					size="small"
					color="primary"
					aria-label="add"
					onClick={(e) => goToViewHorario(e)}
				>
					<VisibilityIcon />
					Ver Horario
				</Fab>
			</TableContainer>
		</Paper>
	);
}
