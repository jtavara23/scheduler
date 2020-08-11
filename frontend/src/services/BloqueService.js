//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	getAsignacion(pk) {
		const url = `${API_URL}/api/horario/asignacion/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloque(pk) {
		const url = `${API_URL}/api/horario/bloque/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getHoraProfePeriodo(param) {
		const url = `${API_URL}/api/horario/hora_profe_periodo_carga/${param}`;
		return axios.get(url).then((response) => response.data);
	}

	getEscuelas() {
		const url = `${API_URL}/api/horario//escuela/`;
		return axios.get(url).then((response) => response.data);
	}

	getFecha(pk) {
		const url = `${API_URL}/api/horario/fecha/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getPeriodo(pk) {
		const url = `${API_URL}/api/horario/periodo/${5}`;
		return axios.get(url).then((response) => response.data);
	}

	/**----------------------------------------------------- */
	createAsignacion(asignacion) {
		const url = `${API_URL}/api/horario/asignacion/`;
		return axios.post(url, asignacion);
	}

	createBloque(bloque) {
		const url = `${API_URL}/api/horario/bloque/`;
		return axios.post(url, bloque);
	}

	createFecha(fecha) {
		const url = `${API_URL}/api/horario/fecha/`;
		return axios.post(url, fecha);
	}

	/**----------------------------------------------------- */
	updateAsignacion_Fecha(asignacion) {
		const url = `${API_URL}/api/horario/asignacion_bloque/${asignacion.bloque}`;
		return axios.put(url, asignacion);
	}

	updateCargaProfesor(cargaProfesor) {
		const url = `${API_URL}/api/horario/hora_profe_periodo/${cargaProfesor.id}`;
		return axios.put(url, cargaProfesor);
	}
	updateFecha(fecha) {
		const url = `${API_URL}/api/horario/fecha/`;
		return axios.put(url, fecha);
	}
	updateBloque(bloque) {
		const url = `${API_URL}/api/horario/bloque/${bloque.id}`;
		return axios.put(url, bloque);
	}
}

export default BloqueService;
