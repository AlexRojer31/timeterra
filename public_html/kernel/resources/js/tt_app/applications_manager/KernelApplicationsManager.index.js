/*
* TimeTerra - Web publishing software
*
* Copyright (C) 2021 by the Alexandr Ronzhin
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


function KernelApplicationsManager() {
	
	LibAppField.call(this);
	
	this.main = function() {
		let appId = 'KernelApplicationsManager';
		let appWidth = 600;
		let appHeight = 300;
		let appName = 'Менеджер приложений';
		let appIcon = '/kernel/resources/media/tt_application_icons/logo.svg';
		let additionalScripts = [
			// Some scripts...
		];
		this.create(appId, appWidth, appHeight, appName, appIcon, additionalScripts);
	}
	
	this.construct = function(workField) {
		this.navConstruct(workField);
	}
	
	this.navConstruct = function(workField) {
		workField.innerHTML = '';
		let navigation = $.navP();
		$.add(workField, navigation);
		this.getApplicationCategorys(navigation, this.getAccessUserApplicationsInCategory);
	}
	
	this.getApplicationCategorys = function(navigation, func) {
		let ajax = new LibAjax();
		let url = '/desktop/ajax/?controller=applicationsManager&action=getApplicationCategorys';
		let body = new FormData();
		let push = ajax.create('POST', body, url, constructNavigation);
		function constructNavigation() {
			let obj = ajax.json(push.response);
			for (let i =0;i < obj.length;i++) {
				let category = $.navBtnP(obj[i]['name'], obj[i]['description'], func, obj[i]['icon']);
				category.setAttribute('categoryId', obj[i]['id']);
				$.add(navigation, category);
			}
		}
	}
	
	this.getAccessUserApplicationsInCategory = function() {
		let workField = this.parentElement.parentElement;
		let categoryId = this.getAttribute('categoryId');
		workField.innerHTML = '';
		let context = $.div();
		$.add(workField, context);
		let app = new KernelApplicationsManager();
		let backBtn = $.btn('Назад к категориям', backToCategory);
		$.add(context, backBtn);
		
		function backToCategory() {
			app.navConstruct(workField);
		}
		let appField = $.navP();
		$.add(workField, appField);
		
		let ajax = new LibAjax();
		let url = '/desktop/ajax/?controller=applicationsManager&action=getAccessUserApplicationsInCategory';
		let body = new FormData();
		body.append('categoryId', categoryId);
		let push = ajax.create('POST', body, url, showApplicationsInCategory);
		
		function showApplicationsInCategory() {
			let obj = ajax.json(push.response);
			for (let i =0;i < obj.length;i++) {
				let application = $.navBtnP(obj[i]['name'], obj[i]['description'], appStart, obj[i]['icon']);
				application.setAttribute('applicationId', obj[i]['id']);
				application.setAttribute('applicationAction', obj[i]['action']);
				$.add(appField, application);
			}
			
			function appStart() {
				let application = new AppCollector();
				application.start(this.getAttribute('applicationAction'));
			}
		}
	}
	
	this.addApplicationToUserDesktop = function() {
		
	}
	
	this.removeApplicationFromUserDesktop = function(appId) {
		alert(appId);
	}

}
