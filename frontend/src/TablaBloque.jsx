import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { useState, useEffect } from 'react';
import Service from './services/BloqueService';
const service = new Service();

const useStyles = makeStyles({
	root: {
		'margin-top': '6em',
		'padding-bottom': '3em',
		'margin-left': '2em',
		width: '75%'
	},

	container: {
		//maxHeight: 440
	}
});
export default function MatPaginationTable() {
	const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ data, setData ] = useState([]);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);

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
	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Escuela</TableCell>
							<TableCell>Curso</TableCell>
							<TableCell>NRC_T</TableCell>
							<TableCell>NRC_P</TableCell>
							<TableCell>NRC_L</TableCell>
							<TableCell>Aula</TableCell>
							<TableCell>Dia</TableCell>
							<TableCell>Hora INI</TableCell>
							<TableCell>Hora FIN</TableCell>
							<TableCell>CargaHor</TableCell>
							<TableCell>Profesor</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => {
							return (
								<TableRow key={c.id}>
									<TableCell>{c.escuela_nombre_id} </TableCell>
									<TableCell>{c.curso_nombre_id}</TableCell>
									<TableCell>{c.nrc_t}</TableCell>
									<TableCell>{c.nrc_p}</TableCell>
									<TableCell>{c.nrc_l}</TableCell>
									<TableCell>{c.aula}</TableCell>
									<TableCell>{c.dia_fecha}</TableCell>
									<TableCell>{c.hora_ini}</TableCell>
									<TableCell>{c.hora_fin}</TableCell>
									<TableCell>{c.cargaHora}</TableCell>
									<TableCell>{c.nombre}</TableCell>
									<TableCell>
										<button onClick={(e) => handleDelete(e, c.id)}> Delete</button>
										<a href={'/horario/periodo_bloque/' + c.pk}> Update</a>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 10, 15, 20 ]}
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
