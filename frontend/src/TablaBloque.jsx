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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';
import clsx from 'clsx';

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

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					PERIODO SELECCIONADO
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
						<DeleteIcon />
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
	numSelected: PropTypes.number.isRequired
};

export default function MatPaginationTable() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ data, setData ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(20);
	const [ dense, setDense ] = React.useState(true);
	const [ selected, setSelected ] = React.useState([]);

	useEffect(() => {
		const GetData = async () => {
			service.getPeriodo().then((result) => {
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

	const handleDelete = (e, pk) => {
		service.deleteBloquePeriodoRow({ pk: pk }).then(() => {
			var newList = data.filter((obj) => obj.pk !== pk);
			setData(newList);
		});
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

	const handleClick = (event, name) => {
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

	return (
		<Paper className={classes.root}>
			<EnhancedTableToolbar numSelected={selected.length} />
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
							return (
								<StyledTableRow
									hover
									key={c.asig_id}
									onClick={(event) => handleClick(event, c.asig_id)}
									selected={isItemSelected}
								>
									<TableCell padding="checkbox">
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
										<button onClick={(e) => handleDelete(e, c.asig_id)}> Delete</button>
										<a href={'/bloque/' + c.bloque_id}> Update</a>
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
				rowsPerPageOptions={[ 10, 20, 50, { value: -1, label: 'All' } ]}
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
