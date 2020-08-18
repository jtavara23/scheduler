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
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import PeriodoNew from './Periodo_New';

const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	container: {},
	boton: {
		margin: '10px 10px'
	}
}));

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(85),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
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
	const { numSelected } = props;
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
				<Typography className={classes.title} variant="h5" id="tableTitle" component="div" />
			)}

			{numSelected.length > 0 ? (
				<Tooltip title="Filter list">
					<IconButton aria-label="filter list">
						<PeriodoNew />
					</IconButton>
				</Tooltip>
			) : null}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
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

export default function TablaProfesores(props) {
	const [ data_rows, setData_rows ] = useState([]);
	const [ selected, setSelected ] = React.useState([]);
	const [ periodo_id, setPeriodo_id ] = useState(0);

	useEffect(() => {
		service.getPeriodos().then((result) => {
			setData_rows(result.data);
		});
	}, []);

	const history = useHistory();

	const classes = useStyles();

	const isSelected = (profesorSeleccionado) => selected.indexOf(profesorSeleccionado) !== -1;

	const handleClick = (profesorID) => {
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
		//console.log('newSelected ', newSelected);
		setSelected(newSelected);
	};

	const goToViewPeriodo = (id) => {
		//console.log('Profe, sele ', selected[0]);
		history.push('/' + id);
	};
	const editPeriodo = (id) => {
		//TODO edit
		handleClick(id);
	};
	const deletePeriodo = (id) => {
		//TODO delete from Asignacion where periodo_id =
		//TODO delete from Bloque where periodo_id =
		//TODO delete from horaprofeperiodo where periodo_id =
		//TODO delete from periodo where id =
		handleClick(id);
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
			style={{ minHeight: '100vh' }}
		>
			<Paper className={classes.root}>
				<EnhancedTableToolbar numSelected={selected} />
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
											<a onClick={(e) => goToViewPeriodo(c.id)}>
												<Tooltip title="VER">
													<IconButton aria-label="Ver">
														<VisibilityIcon />
													</IconButton>
												</Tooltip>
											</a>

											<a onClick={(e) => editPeriodo(c.id)}>
												<Tooltip title="EDITAR">
													<IconButton aria-label="Editar">
														<EditIcon />
													</IconButton>
												</Tooltip>
											</a>

											<a onClick={(e) => deletePeriodo(c.id)}>
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
			</Paper>
		</Grid>
	);
}
