import moment from 'moment';
import { appointments } from './data';

const makeTodayAppointment = (startDate, endDate) => {
	//const days = moment(startDate).diff(endDate, 'days');
	//const nextStartDate = moment(startDate).year(currentDate.year()).month(currentDate.month()).date(date);
	//const nextEndDate = moment(endDate).year(currentDate.year()).month(currentDate.month()).date(date + days);
	const nextStartDate = moment(startDate);
	const nextEndDate = moment(endDate);
	return {
		startDate: nextStartDate.toDate(),
		endDate: nextEndDate.toDate()
	};
};

const xx = appointments.map(({ startDate, endDate, ...restArgs }) => {
	const result = {
		...makeTodayAppointment(startDate, endDate),
		...restArgs
	};
	//console.log('>', result);
	/* date += 1;
	if (date > 31) date = 1; */
	return result;
});

export default xx;
