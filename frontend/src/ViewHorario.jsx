import React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

import appointments from './services/today-appointment';
export default class ViewHorario extends React.PureComponent {
	constructor(props) {
		super(props);
		const { match: { params } } = props;
		//console.log('params', params);
		this.state = {
			data: appointments
		};
	}

	render() {
		const { data } = this.state;

		return (
			<Paper>
				<Scheduler data={data} height={'auto'}>
					<ViewState currentDate={'2020-06-03'} />
					<WeekView cellDuration={55} startDayHour={6} endDayHour={22.5} excludedDays={[ 0 ]} />
					<Appointments />
				</Scheduler>
			</Paper>
		);
	}
}
