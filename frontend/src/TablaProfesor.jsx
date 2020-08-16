import React, { useState, useEffect } from 'react';
import Service from './services/BloqueService';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const service = new Service();

const TablaBloqueStyled = styled.div`maxHeight: 26px;`;

const useStyles = (theme) => ({
	root: {
		'margin-top': '1em',
		display: 'block',
		'margin-left': 'auto',
		'margin-right': 'auto'
	},
	container: {
		maxHeight: 790
	}
});

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
		<TablaBloqueStyled className={classes.root}>
			<TableContainer component={Paper} className={classes.container}>
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
		</TablaBloqueStyled>
	);
}
