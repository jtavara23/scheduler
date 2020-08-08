//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	/** This makes it possible to get the next pages of customers 
     *  by passing links such as /api/horario/periodo_bloque/?page=2
     * ***/
	getBloquePeriodoByURL(link) {
		const url = `${API_URL}${link}`;
		return axios.get(url).then((response) => response.data);
	}

	getBloquePeriodo(pk) {
		const url = `${API_URL}/api/horario/periodo_bloque/${5}`;
		return axios.get(url).then((response) => response.data);
	}
}

export default BloqueService;
