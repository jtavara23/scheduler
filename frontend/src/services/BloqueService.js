//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	getAsignacion(pk) {
		const url = `${API_URL}/api/horario/asignacion/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getAsignacion_byBloque(bloqueid) {
		const url = `${API_URL}/api/horario/asignacion_bloque/${bloqueid}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloque(pk) {
		const url = `${API_URL}/api/horario/bloque/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getCursosOfEscuela(esc) {
		const url = `${API_URL}/api/horario/curso_escuela/${esc}`;
		return axios.get(url).then((response) => response.data);
	}

	getHoraProfePeriodo(param) {
		const url = `${API_URL}/api/horario/hora_profe_periodo_carga/${param}`;
		return axios.get(url).then((response) => response.data);
	}

	getEscuelas() {
		const url = `${API_URL}/api/horario/escuela/`;
		return axios.get(url).then((response) => response.data);
	}

	getFecha(pk) {
		const url = `${API_URL}/api/horario/fecha/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getPeriodo(pk) {
		const url = `${API_URL}/api/horario/periodo/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getProfesor(pk) {
		const url = `${API_URL}/api/horario/profesor/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getProfesoresinPeriodo(per_id) {
		const url = `${API_URL}/api/horario/profesores_periodo/${per_id}`;
		return axios.get(url).then((response) => response.data);
	}
	getProfesores_available(datos) {
		const url = `${API_URL}/api/horario/profesor_available/`;
		return axios.post(url, datos).then((response) => response.data);
	}

	/**----------------------------------------------------- */
	createAsignacion(asignacion) {
		const url = `${API_URL}/api/horario/asignacion/`;
		return axios.post(url, asignacion);
	}
	createAsignacion_duplication(asignacion_id) {
		const url = `${API_URL}/api/horario/asignacion_duplicate/${asignacion_id}`;
		return axios.post(url);
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
	updateAsignacionProfesor(asignacion) {
		const url = `${API_URL}/api/horario/asignacion/${asignacion.id}`;
		return axios.put(url, asignacion);
	}
	updateAsignacionFecha(asignacion) {
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
	/**----------------------------------------------------- */
	deleteAsignacion(asignacion_id) {
		const url = `${API_URL}/api/horario/asignacion/${asignacion_id}`;
		return axios.delete(url);
	}
}

export default BloqueService;
