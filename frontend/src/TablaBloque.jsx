import React, { Component } from 'react';
import Service from './services/BloqueService';
import styled from 'styled-components';

const service = new Service();

const TablaBloqueStyled = styled.div``;

class TablaBloque extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data_rows: [],
			nextPageURL: ''
		};
		// Binding these methods in order to be accesible from HTML code
		this.nextPage = this.nextPage.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	/* A. lifecycle method of the component that is called when the component is created and inserted into the DOM    */
	componentDidMount() {
		var self = this;
		service.getBloquePeriodo().then((result) => {
			self.setState({
				data_rows: result.data,
				nextPageURL: result.nextlink
			});
		});
	}

	/** takes the next page URL from the state object, this.state.nextPageURL, 
     * and updates the data_rows array with the returned data. */
	nextPage() {
		var self = this;
		service.getBloquePeriodoByURL(this.state.nextPageURL).then((result) => {
			self.setState({
				data_rows: result.data,
				nextPageURL: result.nextlink
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
				<div className="data_rows--list">
					<table className="table">
						<thead key="thead">
							<tr>
								<th>Escuela</th>
								<th>Curso</th>
								<th>NRC_T</th>
								<th>NRC_P</th>
								<th>NRC_L</th>
								<th>Aula</th>
								<th>Dia</th>
								<th>Hora INI</th>
								<th>Hora FIN</th>
								<th>CargaHor</th>
								<th>Profesor</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data_rows.map((c) => (
								<tr key={c.id}>
									<td>{c.escuela_nombre_id} </td>
									<td>{c.curso_nombre_id}</td>
									<td>{c.nrc_t}</td>
									<td>{c.nrc_p}</td>
									<td>{c.nrc_l}</td>
									<td>{c.aula}</td>
									<td>{c.dia_fecha}</td>
									<td>{c.hora_ini}</td>
									<td>{c.hora_fin}</td>
									<td>{c.cargaHora}</td>
									<td>{c.nombre}</td>
									<td>
										<button onClick={(e) => this.handleDelete(e, c.pk)}> Delete</button>
										<a href={'/horario/periodo_bloque/' + c.pk}> Update</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<button className="btn btn-primary" onClick={this.nextPage}>
						Next
					</button>
				</div>
			</TablaBloqueStyled>
		);
	}
}

export default TablaBloque;
