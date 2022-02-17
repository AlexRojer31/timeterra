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
		let appId = 'KernelAppManager';
		if (this.checkApp(appId)) {
			return false;
		} else {
			this.create(appId, 500, 400, 'Менеджер приложений', '/kernel/resources/media/ttlogo.svg');
			let app = document.getElementById(appId);
			this.content(app);
		}
	}
	
	this.content = function(app) {
		let navigator = $.submenu();
		let showAll = $.sublist('Все приложения', getAll, '/kernel/resources/media/ttlogo.svg');
		showAll.classList.add('selectList');
		showAll.style.backgroundColor = map.get('backgroundColor');
		$.add(app, navigator);
		$.add(navigator, showAll);
		let contentField = $.flexbox('space-around', 'flex-start');
		contentField.style.clear = 'right';
		contentField.style.overflow = 'auto';
		$.add(app, contentField);
		
		function getAll() {
			let allUserLabels = new KernelAppManager();
			allUserLabels.getAllUserlabels(contentField, false);
		}
		
		this.subMenuConstruct(contentField, navigator);
		this.getAllUserlabels(contentField, false);
		
		function funcObserver(mutation, navigatorObserver) {
			for (let i = 0;i < mutation.length;i++) {
				if (mutation[i].attributeName === 'style') {
					let newHeight = app.getAttribute('baseMinHeight') - 30;
					navigator.style.height = newHeight + 'px';
					contentField.style.height = newHeight + 'px';
				} else {
					return false;
				}
			}
		}
		
		let navigatorConfig = {
			attributes: true,
		}
		
		let navigatorObserver = new MutationObserver(funcObserver);
		navigatorObserver.observe(app, navigatorConfig);
	}
	
	this.subMenuConstruct = function(contentField, navigator) {
		let ajax = new LibAjax();
		let url = '/desktop/action/?controller=labels&action=getAllUserGidLabels';
		let body = '';
		let push = ajax.create('POST', body, url, showTags);
		
		function showTags() {
			let tagsArr = new Map();
			let tagsForEach = [];
			let tagsCount = 0;
			let obj = ajax.json(push.response);
			for (let i = 0;i < obj.length;i++) {
				let tagsName = obj[i]['tag'];
				let tagsValue = obj[i]['iconTag'];
				if (tagsArr.has(tagsName)) {
					continue;
				} else {
					tagsArr.set(tagsName, tagsValue);
					let promObj = {
						'name': tagsName,
						'value': tagsValue
					};
					tagsForEach[tagsCount] = promObj;
					tagsCount++;
				}
			}
			
			for (let j = 0;j < tagsForEach.length;j++) {
				let nameOfTag = tagsForEach[j].name;
				let subMenuList = $.sublist(tagsForEach[j].name, showThisApp, tagsForEach[j].value);
				function showThisApp() {
					let thisTagLabels = new KernelAppManager();
					thisTagLabels.getAllUserlabels(contentField, nameOfTag);
				}
				$.add(navigator, subMenuList);
			}
				
		}
	}
	
	this.getAllUserlabels = function(contentField, tag) {
		let ajax = new LibAjax();
		let url = '/desktop/action/?controller=labels&action=getAllUserGidLabels';
		let body = '';
		let push = ajax.create('POST', body, url, showLabels);
		
		function showLabels() {
			contentField.innerHTML = '';
			let obj = ajax.json(push.response);
			for (let i = 0;i < obj.length;i++) {
				if (tag) {
					if (obj[i]['tag'] === tag) {
						labelConstruct(obj[i]);
					}
				} else {
					labelConstruct(obj[i]);
				}
			}
		}
	
		function labelConstruct(obj) {
			let container = $.div();
			container.style.textAlign = 'center';
			container.addEventListener('click', action);
			container.addEventListener('contextmenu', context);
			container.addEventListener('mouseover', mouseover);
			container.addEventListener('mouseout', mouseout);
			
			let img = $.img(obj['name'], obj['icon']);
			img.style.maxWidth = '30px';
			let title = $.headline(obj['name'], 3, 'center');
			title.style.fontSize = '16px';
			let desc = $.paragraf(obj['description'], 'center');
			desc.style.fontSize = '12px';
			desc.style.maxWidth = '50px';
			desc.style.margin = 'auto';
			
			$.add(container, img);
			$.add(container, title);
			$.add(container, desc);
			$.add(contentField, container);
			
			function action() {
				let application = new AppCollector();
				application.start(obj['action']);
			}
		
			function context() {
				let context = new LibContextField();
				context.create();
				context.addEvent('Добавить', labelToDesctop);
				
				function labelToDesctop() {
					let ajaxLabel = new LibAjax();
					let urlLabel = '/desktop/action/?controller=labels&action=addUserLabel';
					let bodyLabel = new FormData();
					bodyLabel.append("lid", obj['id']);
					let pushLabel = ajax.create('POST', bodyLabel, urlLabel, messageAdd);
					function messageAdd() {
						let msg = new AppCollector();
						msg.start('KernelSystemMeesage', pushLabel.response);
						let desktop = document.getElementById('kernelDesktop');
						let desktopUserLabelsField = document.getElementById('desktopUserLabelsField')
						$.remove(desktop, desktopUserLabelsField);
						let updateLabels = new LibLabels();
						updateLabels.main();
					}
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
