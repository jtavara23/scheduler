//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	getAsignacion(pk) {
		const url = `${API_URL}/api/horario/asignacion/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getAsignacionFromBloque(bloqueid) {
		const url = `${API_URL}/api/horario/asignacion_bloque/${bloqueid}`;
		return axios.get(url).then((response) => response.data);
	}

	getAsignacionFromPeriodo(period) {
		const url = `${API_URL}/api/horario/asignacion_periodo/${period}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloque(pk) {
		const url = `${API_URL}/api/horario/bloque/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloqueFromPeriodo(pk) {
		const url = `${API_URL}/api/horario/bloque_periodo/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getCursosOfEscuela(esc) {
		const url = `${API_URL}/api/horario/curso_escuela/${esc}`;
		return axios.get(url).then((response) => response.data);
	}

	getHoraProfePeriodo(param) {
		const url = `${API_URL}/api/horario/hora_profe_periodo/${param}`;
		return axios.get(url).then((response) => response.data);
	}

	getHoraProfePeriodoCarga(param) {
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

	getPeriodos() {
		const url = `${API_URL}/api/horario/periodos/`;
		return axios.get(url).then((response) => response.data);
	}

	getPeriodoNombre(pk) {
		const url = `${API_URL}/api/horario/periodos/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getProfesor(pk) {
		const url = `${API_URL}/api/horario/profesor/${pk}`;
		return axios.get(url).then((response) => response.data);
	}

	getProfesores() {
		const url = `${API_URL}/api/horario/profesor/`;
		return axios.get(url).then((response) => response.data);
	}

	getProfesorHorario(datos) {
		const url = `${API_URL}/api/horario/profesor_horario/`;
		return axios.post(url, datos);
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

	createCurso(curso) {
		const url = `${API_URL}/api/horario/curso/`;
		return axios.post(url, curso);
	}

	createEscuela(escuela) {
		const url = `${API_URL}/api/horario/escuela/`;
		return axios.post(url, escuela);
	}

	createFecha(fecha) {
		const url = `${API_URL}/api/horario/fecha/`;
		return axios.post(url, fecha);
	}

	createHoraProfePeriodo(datos) {
		const url = `${API_URL}/api/horario/hora_profe_periodo/`;
		return axios.post(url, datos);
	}

	createPeriodo(periodo) {
		const url = `${API_URL}/api/horario/periodos/`;
		return axios.post(url, periodo);
	}

	createProfesor(profesor) {
		const url = `${API_URL}/api/horario/profesor/`;
		return axios.post(url, profesor);
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
	updateBloque(bloque) {
		const url = `${API_URL}/api/horario/bloque/${bloque.id}`;
		return axios.put(url, bloque);
	}

	updateCargaProfesor(cargaProfesor) {
		const url = `${API_URL}/api/horario/hora_profe_periodo/${cargaProfesor.id}`;
		return axios.put(url, cargaProfesor);
	}
	updateFecha(fecha) {
		const url = `${API_URL}/api/horario/fecha/`;
		return axios.put(url, fecha);
	}

	updatePeriodo(periodo) {
		const url = `${API_URL}/api/horario/periodos/${periodo.id}`;
		return axios.put(url, periodo);
	}
	updateProfesor(profesor) {
		const url = `${API_URL}/api/horario/profesor/${profesor.id}`;
		return axios.put(url, profesor);
	}
	/**----------------------------------------------------- */
	deleteAsignacion(asignacion_id) {
		const url = `${API_URL}/api/horario/asignacion/${asignacion_id}`;
		return axios.delete(url);
	}

	deleteAsignacionOfPeriodo(id) {
		const url = `${API_URL}/api/horario/asignacion_periodo/${id}`;
		return axios.delete(url);
	}

	deleteBloqueOfPeriodo(id) {
		const url = `${API_URL}/api/horario/bloque_periodo/${id}`;
		return axios.delete(url);
	}

	deleteCurso(curso) {
		const url = `${API_URL}/api/horario/curso/${curso.nombre}`;
		return axios.put(url, curso);
	}

	deleteEscuela(escuela) {
		const url = `${API_URL}/api/horario/escuela/${escuela.nombre}`;
		return axios.put(url, escuela);
	}

	deleteHoraProfeOfPeriodo(id) {
		const url = `${API_URL}/api/horario/hora_profe_periodo/${id}`;
		return axios.delete(url);
	}
	deletePeriodo(id) {
		const url = `${API_URL}/api/horario/periodos/${id}`;
		return axios.delete(url);
	}
}

export default BloqueService;
