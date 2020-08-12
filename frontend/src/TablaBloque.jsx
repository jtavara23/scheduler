import React from 'react';
import { withStyles, makeStyles, lighten } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FilterListIcon from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Service from './services/BloqueService';
const service = new Service();

const useStyles = makeStyles((theme) => ({
	root: {
		'margin-top': '3em',
		'padding-bottom': '3em',
		'margin-left': '2em'
		//width: '75%'
	},
	container: {
		maxHeight: 756
	}
}));

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	/*	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover
		}
	}*/
}))(TableRow);

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
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
		flex: '1 1 100%'
	}
}));

const handleAsignarProfesor = (e, bloque) => {};

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;
	//console.log(numSelected);
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected.length > 0
			})}
		>
			{numSelected.length > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected + '-'} seleccionado
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					PERIODO SELECCIONADO
				</Typography>
			)}

			{numSelected.length > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
						<DeleteIcon onClick={(e) => handleAsignarProfesor(e, numSelected[0])} />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton aria-label="filter list">
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.object.isRequired
};

export default function MatPaginationTable() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ data, setData ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(30);
	const [ dense, setDense ] = React.useState(true);
	const [ selected, setSelected ] = React.useState([]);
	const periodo_id = 5;
	useEffect(() => {
		const GetData = async () => {
			service.getPeriodo(periodo_id).then((result) => {
				if (result.data.length) {
					setData(result.data);
				} else {
					console.log('no data!!!');
				}
			});
		};
		GetData();
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	/*-------------------------------------    */
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = data.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, bloque, index) => {
		let name = bloque.asig_id;
		//let name = bloque;
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	};
	const isSelected = (name) => selected.indexOf(name) !== -1;
	/*-------------------------------------    */
	const history = useHistory();
	/*-------------------------------------    */
	const handleDelete = (e, pk, cargaHora, profesor_id) => {
		service.deleteAsignacion(pk).then((response) => {
			service.getHoraProfePeriodo(periodo_id + '-' + profesor_id).then((response2) => {
				let hpp_id = response2.id;
				let cargaTotal_profesor = response2.carga;
				cargaTotal_profesor = cargaTotal_profesor - cargaHora;
				service
					.updateCargaProfesor({
						id: hpp_id, // hora_profesor_periodo_id
						carga: cargaTotal_profesor,
						periodo: periodo_id,
						profesor: profesor_id
					})
					.then((result) => {
						let newList = data.filter((obj) => obj.asig_id !== pk);
						setData(newList);
						console.log('we delete sucessfully ', result);
					})
					.catch(() => {
						console.log('no deletion has been done');
					});
			});
		});
	};
	/*-------------------------------------    */
	const handleDuplicate = (e, obj, index) => {
		let newData = { ...obj };
		service.createAsignacion_duplication(obj.asig_id).then((response) => {
			let periodo_id = response.data.periodo;
			let profesor_id = response.data.profesor;
			let newasig = response.data.id;
			service.getHoraProfePeriodo(periodo_id + '-' + profesor_id).then((response2) => {
				let hpp_id = response2.id;
				let cargaTotal_profesor = response2.carga;
				cargaTotal_profesor = cargaTotal_profesor + obj.cargaHora;
				service
					.updateCargaProfesor({
						id: hpp_id, // hora_profesor_periodo_id
						carga: cargaTotal_profesor,
						periodo: periodo_id,
						profesor: profesor_id
					})
					.then((result) => {
						let dataToAdd = [ ...data ];
						newData.asig_id = newasig;
						newData.profesor_id = 28;
						newData.nombre = 'A_STAFF4';
						dataToAdd.splice(index + 1, 0, newData);
						setData(dataToAdd);
						console.log('we duplicate sucessfully ', result);
					})
					.catch(() => {
						console.log('no duplication has been done');
					});
			});
		});
	};

	return (
		<Paper className={classes.root}>
			<EnhancedTableToolbar numSelected={selected} />
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table" size={dense ? 'small' : 'medium'}>
					<TableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick}>
						<TableRow>
							<StyledTableCell>S</StyledTableCell>
							<StyledTableCell>Escuela</StyledTableCell>
							<StyledTableCell>Curso</StyledTableCell>
							<StyledTableCell align="center">NRC_T</StyledTableCell>
							<StyledTableCell align="center">NRC_P</StyledTableCell>
							<StyledTableCell align="center">NRC_L</StyledTableCell>
							<StyledTableCell align="center">Aula</StyledTableCell>
							<StyledTableCell align="center">Dia</StyledTableCell>
							<StyledTableCell align="center">Hora INI</StyledTableCell>
							<StyledTableCell align="center">Hora FIN</StyledTableCell>
							<StyledTableCell align="center">CargaHor</StyledTableCell>
							<StyledTableCell align="center">Profesor</StyledTableCell>
							<StyledTableCell align="center">Acciones</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c, index) => {
							const isItemSelected = isSelected(c.asig_id);
							const labelId = `enhanced-table-checkbox-${index}`;
							const index_inList = page * rowsPerPage + index;
							return (
								<StyledTableRow hover key={c.asig_id} selected={isItemSelected}>
									<TableCell
										padding="checkbox"
										onClick={(event) => handleClick(event, c, index_inList)}
									>
										<Checkbox
											checked={isItemSelected}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</TableCell>
									<StyledTableCell>{c.escuela_nombre_id} </StyledTableCell>
									<StyledTableCell>{c.curso_nombre_id}</StyledTableCell>
									<StyledTableCell align="center">{c.nrc_t}</StyledTableCell>
									<StyledTableCell align="center">{c.nrc_p}</StyledTableCell>
									<StyledTableCell align="center">{c.nrc_l}</StyledTableCell>
									<StyledTableCell align="center">{c.aula}</StyledTableCell>
									<StyledTableCell align="center">{c.dia_fecha}</StyledTableCell>
									<StyledTableCell align="center">{c.hora_ini}</StyledTableCell>
									<StyledTableCell align="center">{c.hora_fin}</StyledTableCell>
									<StyledTableCell align="center">{c.cargaHora}</StyledTableCell>
									<StyledTableCell align="center">{c.nombre}</StyledTableCell>
									<StyledTableCell>
										<a onClick={() => history.push('/bloque/' + c.bloque_id)}>
											{' '}
											<Tooltip title="EDITAR">
												<IconButton aria-label="edit">
													<EditIcon />
												</IconButton>
											</Tooltip>
										</a>
										<a onClick={(e) => handleDelete(e, c.asig_id, c.cargaHora, c.profesor_id)}>
											<Tooltip title="ELIMINAR">
												<IconButton aria-label="delete">
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</a>
										<a onClick={(e) => handleDuplicate(e, c, index_inList)}>
											<Tooltip title="DUPLICAR">
												<IconButton aria-label="copy">
													<FileCopyIcon />
												</IconButton>
											</Tooltip>
										</a>
									</StyledTableCell>
								</StyledTableRow>
							);
						})}
						{emptyRows > 0 && (
							<TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
								<TableCell colSpan={12} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 20, 30, 50, data.length ]}
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
		</Paper>
	);
}
