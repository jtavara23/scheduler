import React, { useState, useEffect } from 'react';
import Service from './services/BloqueService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import QueueIcon from '@material-ui/icons/Queue';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Periodo_UpdateDuplicate from './Periodo_UpdateDuplicate';

const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	container: { maxHeight: 860 }
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
	const { numSelected, nameSelected, updateDuplicar, refreshData } = props;
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
					LISTA DE PERIODOS
				</Typography>
			)}

			{numSelected.length > 0 ? (
				<Periodo_UpdateDuplicate
					periodo_id={numSelected[0]}
					periodo_name={nameSelected}
					accion_update={updateDuplicar}
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
		fontSize: 14
	}
}))(TableCell);

export default function Periodo() {
	const [ data_rows, setData_rows ] = useState([]);
	const [ selected, setSelected ] = React.useState([]);
	const [ periodoName, setPeriodoName ] = useState('');
	const [ accionUpdate, setAccionUpdate ] = useState(true);

	useEffect(() => {
		service.getPeriodos().then((result) => {
			setData_rows(result.data);
		});
	}, []);

	const history = useHistory();

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

	const goToViewPeriodo = (c) => {
		history.push('/' + c.id);
	};
	const editPeriodo = (c) => {
		setPeriodoName(c.nombre);
		setAccionUpdate(true);
		handleClick(c.id);
	};

	const duplicatePeriodo = (c) => {
		setPeriodoName(c.nombre);
		setAccionUpdate(false);
		handleClick(c.id);
	};

	const refreshDataOnParent = (periodoId, periodoNombre) => {
		let newData = [ ...data_rows ];
		newData.map((obj) => {
			if (obj.id === periodoId) {
				obj.nombre = periodoNombre;
			}
		});
		if (!accionUpdate) {
			newData.push({ id: periodoId, nombre: periodoNombre });
		}
		setData_rows(newData);
		setSelected([]);
	};

	const deletePeriodo = (c) => {
		let per = c.id;
		service.deleteAsignacionOfPeriodo(per).then((res) => {
			service.deleteBloqueOfPeriodo(per).then((res2) => {
				service.deleteHoraProfeOfPeriodo(per).then((res3) => {
					service.deletePeriodo(per).then((res4) => {
						console.log('periodo ', per, ' eliminado');
						let newData = data_rows.filter((obj) => obj.id !== per);
						setData_rows(newData);
					});
				});
			});
		});
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
			style={{ maxHeight: '150vh' }}
		>
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					numSelected={selected}
					nameSelected={periodoName}
					updateDuplicar={accionUpdate}
					refreshData={refreshDataOnParent}
				/>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table" size={'small'}>
						<TableHead>
							<TableRow>
								<StyledTableCell align="center">Periodo</StyledTableCell>
								<StyledTableCell align="center">Opciones</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data_rows.map((c, index) => {
								const isItemSelected = isSelected(c.id);
								return (
									<TableRow key={c.id} hover selected={isItemSelected}>
										<StyledTableCell align="center" size="small">
											{c.nombre}
										</StyledTableCell>
										<StyledTableCell align="center">
											<a onClick={(e) => goToViewPeriodo(c)}>
												<Tooltip title="VER">
													<IconButton aria-label="Ver">
														<VisibilityIcon />
													</IconButton>
												</Tooltip>
											</a>

											<a onClick={(e) => editPeriodo(c)}>
												<Tooltip title="EDITAR">
													<IconButton aria-label="Editar">
														<EditIcon />
													</IconButton>
												</Tooltip>
											</a>

											<a onClick={(e) => deletePeriodo(c)}>
												<Tooltip title="ELIMINAR">
													<IconButton aria-label="Eliminar">
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</a>
											<a onClick={(e) => duplicatePeriodo(c)}>
												<Tooltip title="DUPLICAR">
													<IconButton aria-label="duplicar">
														<QueueIcon />
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
			</Paper>
		</Grid>
	);
}
