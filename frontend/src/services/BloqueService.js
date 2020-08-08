//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	getPeriodo(pk) {
		const url = `${API_URL}/api/horario/periodo/${5}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloque(pk) {
		const url = `${API_URL}/api/horario/bloque/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getFecha(pk) {
		const url = `${API_URL}/api/horario/fecha/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getAsignacion(pk) {
		const url = `${API_URL}/api/horario/asignacion/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	createBloque(bloque) {
		const url = `${API_URL}/api/horario/bloque/`;
		return axios.post(url, bloque);
	}

	createAsignacion(asignacion) {
		const url = `${API_URL}/api/horario/asignacion/`;
		return axios.post(url, asignacion);
	}

	/*
	updateBloqueAsignacion(objecto) {
		const url = `${API_URL}/api/horario/bloque_asignacion/${objecto.a_id}/${objecto.b_id}`;
		return axios.put(url, objecto)
	}

*/

	getEscuelas() {
		const url = `${API_URL}/api/horario//escuela/`;
		return axios.get(url).then((response) => response.data);
	}
}

export default BloqueService;
