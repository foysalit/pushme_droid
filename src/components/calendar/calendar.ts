import { Component, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import lodash from 'lodash';
const { range, slice, each, fill, isNumber } = lodash;

@Component({
	selector: 'calendar',
	templateUrl: 'calendar.html'
})
export class CalendarComponent {
	@Input('events') public events: Array<any> = [];
	@Input('loading') public loading: Boolean;
	@Output() public onEventSelect = new EventEmitter<any>();
	@Output() public onMonthChange = new EventEmitter<any>();

	private filters: any;
	private weekdays: any;
	private calendarDates: any;
	private weeks: any;

	ngOnChanges () {
		this.setCalendarData();
	}

	constructor() {
		this.filters = {
			date: moment()
		};
	};

	setCalendarData() {
		this.weekdays = moment.weekdaysShort();
		
		const firstDayOfMonth = moment(this.filters.date).startOf('month');
		const firstWeekDayOfMonth = firstDayOfMonth.weekday();
		const endOfMonth = moment(this.filters.date).endOf('month');
		
		// weird hack for now
		const weeksInMonth = moment(endOfMonth.diff(firstDayOfMonth)).weeks();
		const daysInMonth = this.filters.date.daysInMonth()+1;

		let calendarDates = fill(range(1, weeksInMonth*7+1), {});
		
		each(range(1, daysInMonth), (date) => {
			let data = {
				date: date,
				currentDate: moment(this.filters.date).date(date),
				events: [],
				today: false
			};

			each(this.events, (event) => {
				let eventDate = moment(event.timestamp);
				if (eventDate.isSame(data.currentDate, 'day')) {
					data.events.push(event);
				}
			});

			if (moment().isSame(data.currentDate, 'day')) 
				data.today = true;

			calendarDates[date+firstWeekDayOfMonth-1] = data;
		});

		this.calendarDates = calendarDates;
		this.weeks = range(0, weeksInMonth);
	};

	daysOfWeek(weekNum) {
		let start = weekNum*7;
		let days = slice(this.calendarDates, start, start+7);
		return days;
	};

	changeMonth(month) {
		if (month == 'next') {
			this.filters.date.add(1, 'months');
		} else if (month == 'prev') {
			this.filters.date.subtract(1, 'months');
		} else if (isNumber(month)) {
			this.filters.date.month(month);
		}

		this.onMonthChange.emit(this.filters.date);
	};
}
