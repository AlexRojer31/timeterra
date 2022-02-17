/*
* TimeTerra - Enterprise resources planning software
*
* Copyright (C) 2021-2022 by the Aleksandr Ronzhin
*
* This file is part of TimeTerra.
* TimeTerra is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* TimeTerra is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with TimeTerra. If not, see <https://www.gnu.org/licenses/>.
*/
const meta = new Map();
const sistemMessenger = new LibSistemMessenger();
const applicationShell = new LibAppField();
const appScripts = new Map();
const schema = new Map();
const $ = new LibElements();

window.onload = function() {
	let load = new Loader();
	load.start(load);
}

function Loader() {
	
	this.start = function(load) {
		this.getDesktopSchema(load);
	}
	
	this.getDesktopSchema = function(load) {
		let ajax = new LibAjax();
		let url = '/desktop/ajax/?controller=desktop&action=getDesktopSchema';
		let body = new FormData();
		let push = ajax.create('POST', body, url, mapSet);
		function mapSet() {
			let obj = ajax.json(push.response);
			for (let i = 0;i < obj.length;i++) {
				schema.set(obj[i]['parameter'], obj[i]['value']);
			}
			load.createDesktop();
		}
	}
	
	this.createDesktop = function() {
		let desktop = new LibDesktop();
		desktop.main();
		this.createNavigation();
	}
	
	this.createNavigation = function() {
		let navigation = new LibNavigation();
		navigation.main();
		this.createUserLabels();
	}
	
	this.createUserLabels = function() {
		let labels = new LibLabels();
		labels.main();
		this.createMessenger();
	}
	
	this.createMessenger = function() {
		sistemMessenger.msgFieldConstruct();
		sistemMessenger.createMsg(1, '<i>Фреймворк TimeTerra загружен и готов к работе!</i>');
	}
}