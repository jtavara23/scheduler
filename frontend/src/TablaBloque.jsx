import React, { Component } from 'react';
import Service from './services/BloqueService';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const service = new Service();

const TablaBloqueStyled = styled.div`
	margin-top: 6em;
	padding-bottom: 3em;
	margin-left: 2em;

	width: 75%;
`;

class TablaBloque extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data_rows: []
		};
		this.handleDelete = this.handleDelete.bind(this);
	}

	/* A. lifecycle meTableCellod of TableCelle component TableCellat is called when TableCelle component is created and inserted into TableCelle DOM    */
	componentDidMount() {
		var self = this;
		service.getBloquePeriodo().then((result) => {
			self.setState({
				data_rows: result.data
			});
		});
	}

	/**  handles deleting a customer */
	handleDelete(e, pk) {
		var self = this;
		service.deleteBloquePeriodoRow({ pk: pk }).then(() => {
			var newList = self.state.data_rows.filter((obj) => obj.pk !== pk);
			self.setState({ data_rows: newList });
		});
	}

	render() {
		return (
			<TablaBloqueStyled>
				<TableContainer component={Paper}>
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
							{this.state.data_rows.map((c) => (
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
										<button onClick={(e) => this.handleDelete(e, c.pk)}> Delete</button>
										<a href={'/horario/periodo_bloque/' + c.pk}> Update</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</TablaBloqueStyled>
		);
	}
}

export default TablaBloque;
