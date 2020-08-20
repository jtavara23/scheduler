import React, { useState, useEffect } from 'react';
import Service from './services/BloqueService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Profesor_Operations from './Profesor_Operations';

const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	container: { maxHeight: 760 }
}));

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main
				}
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
	title: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected, codeSelected, nameSelected, updateCreate, refreshData } = props;
	//console.log('numSelected ', numSelected);
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected.length > 0
			})}
		>
			{numSelected.length > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div" />
			) : (
				<Typography className={classes.title} variant="h5" id="tableTitle" component="div">
					LISTA DE PROFESORES
				</Typography>
			)}

			{numSelected.length > 0 ? (
				<Profesor_Operations
					profesorId={numSelected[0]}
					profesorCode={codeSelected}
					profesorName={nameSelected}
					accion_update={updateCreate}
					refreshDataOnParent={refreshData}
				/>
			) : null}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.array.isRequired
};

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		maxWidth: '5px'
	},
	body: {
		fontSize: 13
	}
}))(TableCell);

export default function Periodo() {
	const [ data_rows, setData_rows ] = useState([]);
	const [ selected, setSelected ] = useState([]);
	const [ profesorName, setProfesorName ] = useState('');
	const [ profesorCode, setProfesorCode ] = useState('');
	const [ accionUpdate, setAccionUpdate ] = useState(true);

	useEffect(() => {
		service.getProfesores().then((result) => {
			let profesores = result.data;
			profesores = profesores.filter((obj) => obj.id_profesor !== '+++');
			setData_rows(profesores);
		});
	}, []);

	const classes = useStyles();

	const isSelected = (profesorSeleccionado) => selected.indexOf(profesorSeleccionado) !== -1;

	const handleClick = (periodo) => {
		const selectedIndex = selected.indexOf(periodo);
		let newSelected = [];

		if (selectedIndex === -1) {
			//select from row
			newSelected = newSelected.concat(selected, periodo);
		} else if (selectedIndex === 0) {
			//unselect from row
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	};

	const editProfesor = (c) => {
		setProfesorName(c.nombre);
		setProfesorCode(c.id_profesor);
		setAccionUpdate(true);
		handleClick(c.id);
	};

	const crearProfesor = (c) => {
		setAccionUpdate(false);
		handleClick(c.id);
	};

	const refreshDataOnParent = (profesor_id, profesor_code, profesorNombre) => {
		let newData = [ ...data_rows ];
		newData.map((obj) => {
			if (obj.id === profesor_id) {
				obj.id_profesor = profesor_code;
				obj.nombre = profesorNombre;
			}
		});
		if (!accionUpdate) {
			newData.push({ id: profesor_id, id_profesor: profesor_code, nombre: profesorNombre });
		}
		setData_rows(newData);
		setSelected([]);
	};

	const deleteProfesor = (c) => {
		service
			.updateProfesor({
				id: c.id,
				id_profesor: '+++',
				nombre: c.nombre
			})
			.then((result) => {
				let newData = data_rows.filter((ob) => ob.id !== result.data.id);
				setData_rows(newData);
				console.log('we delete profesor! ', result);
			});
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
			style={{ minHeight: '60vh' }}
		>
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					numSelected={selected}
					codeSelected={profesorCode}
					nameSelected={profesorName}
					updateCreate={accionUpdate}
					refreshData={refreshDataOnParent}
				/>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table" size={'small'}>
						<TableHead>
							<TableRow>
								<StyledTableCell align="center">ID</StyledTableCell>
								<StyledTableCell align="center">Profesor</StyledTableCell>
								<StyledTableCell align="center">Opciones</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data_rows.map((c, index) => {
								const isItemSelected = isSelected(c.id);
								return (
									<TableRow key={c.id} hover selected={isItemSelected}>
										<StyledTableCell align="center" size="small">
											{c.id_profesor}
										</StyledTableCell>
										<StyledTableCell align="center" size="small">
											{c.nombre}
										</StyledTableCell>
										<StyledTableCell align="center">
											<a onClick={(e) => editProfesor(c)}>
												<Tooltip title="EDITAR">
													<IconButton aria-label="Editar">
														<EditIcon />
													</IconButton>
												</Tooltip>
											</a>

											<a onClick={(e) => deleteProfesor(c)}>
												<Tooltip title="ELIMINAR">
													<IconButton aria-label="Eliminar">
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</a>
										</StyledTableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>

				<Fab variant="extended" size="small" color="primary" aria-label="add" onClick={(e) => crearProfesor(e)}>
					<SaveIcon />
					Crear Profesor
				</Fab>
			</Paper>
		</Grid>
	);
}
