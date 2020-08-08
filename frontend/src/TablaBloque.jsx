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

export default function MatPaginationTable() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ data, setData ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(20);
	const [ dense, setDense ] = React.useState(true);

	useEffect(() => {
		const GetData = async () => {
			service.getBloquePeriodo().then((result) => {
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

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table" size={dense ? 'small' : 'medium'}>
					<TableHead>
						<TableRow>
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
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => {
							return (
								<StyledTableRow hover key={c.id}>
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
										<button onClick={(e) => handleDelete(e, c.id)}> Delete</button>
										<a href={'/horario/periodo_bloque/' + c.pk}> Update</a>
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
