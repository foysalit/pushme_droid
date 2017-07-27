import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';
import lodash from 'lodash';
const { range } = lodash;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public data: Array<any> = [];
	public loading: Boolean = true;

	constructor(public navCtrl: NavController) {
	}

	ngOnInit() {
		this.loading = true;
		setTimeout(() => this.generateData(), 2000);
	};

	generateData (seed: any = null) {
		const date = seed ? moment(seed) : moment();

		this.loading = false;

		this.data = range(5, 28).map((i) => {
			return {timestamp: date.date(i).toDate()};
		});
	};

	changeMonth(date) {
		console.log('changed month to', date);
		this.loading = true;

		setTimeout(() => this.generateData(date), 2000);
	};

	showDaysEvents(day) {
		console.log(day);
	};
}
