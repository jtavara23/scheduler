//contains the code to call the REST APIs
import axios from 'axios';
const API_URL = 'http://localhost:8000';

class BloqueService {
	constructor() {}

	getBloquePeriodo(pk) {
		const url = `${API_URL}/api/horario/periodo_bloque/${5}`;
		return axios.get(url).then((response) => response.data);
	}
}

export default BloqueService;
