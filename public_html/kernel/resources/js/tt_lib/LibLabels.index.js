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


function LibLabels() {
	
	this.main = function() {
		let desktop = document.getElementById('kernelDesktop');
		let field = $.flexbox('start', 'flex-start');
		field.id = 'desktopUserLabelsField';
		$.add(desktop, field);
		this.getUserLabels(field)
	}
	
	this.getUserLabels = function(contentField) {
		let ajax = new LibAjax();
		let url = '/desktop/ajax/?controller=desktop&action=getUserDesktopApplications';
		let body = '';
		let push = ajax.create('POST', body, url, showLabels);
		
		function showLabels() {
			if (ajax.json(push.response) != 'false') {
				let obj = ajax.json(push.response);
				for (let i = 0;i < obj.length;i++) {
					labelConstruct(obj[i]);
				}
			} else {
				return false;
			}
		}
	
		function labelConstruct(obj) {
			let container = $.div();
			container.style.textAlign = 'center';
			container.style.margin = '20px';
			container.addEventListener('click', action);
			container.addEventListener('contextmenu', context);
			container.addEventListener('mouseover', mouseover);
			container.addEventListener('mouseout', mouseout);
			
			let img = $.img(obj['description'], obj['icon']);
			img.style.maxWidth = '30px';
			let title = $.headline(obj['name'], 3, 'center');
			title.style.fontSize = '16px';
			
			$.add(container, img);
			$.add(container, title);
			$.add(contentField, container);
			
			function action() {
				let application = new AppCollector();
				application.start(obj['action']);
			}
		
			function context() {
				let context = new LibContextField();
				context.create();
				context.addEvent('Удалить', labelFromDesktop, '/kernel/resources/media/tt_context_icons/logo.svg');
				
				function labelFromDesktop() {
					let applicationsManager = new KernelApplicationsManager();
					applicationsManager.removeApplicationFromUserDesktop(obj['id']);
				}
			}
			
			function mouseover() {
				this.style.cursor = 'pointer';
			}
			
			function mouseout() {
				this.style.cursor = 'auto';
			}
		}	
	}
}
