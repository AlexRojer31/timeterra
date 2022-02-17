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


function LibNavigation() {
	
	this.main = function() {
		let desktop = document.getElementById('kernelDesktop');
		let field = this.createField();
		let appManager = this.appManager();
		let fileManager = this.fileManager();
		let settingsManager = this.settingsManager();
		let logout = this.logout();
		$.add(desktop, field);
		$.add(field, appManager);
		$.add(field, fileManager);
		$.add(field, settingsManager);
		$.add(field, logout);
		this.actions();
	}
	
	this.createField = function() {
		let field = $.flexbox('start', 'flex-start');
		field.id = 'kernelNavigation';
		this.style(field);
		return field;
	}
	
	this.style = function(field) {
		field.style.backgroundColor = schema.get('navBackgroundColor');
		field.style.padding = '5px';
		field.style.width = '100%';
		field.style.height = '30px';
		field.style.position = 'fixed';
		field.style.zIndex = '1';
		field.style.left = '0';
		field.style.bottom = '0';
		
		function mouseover() {
			this.style.boxShadow = '3px 3px 25px ' + schema.get('color');
		}
		
		function mouseout() {
			this.style.boxShadow = 'none';
		}
	}
	
	this.actions = function() {
		let nav = document.getElementById('kernelNavigation');
		nav.addEventListener('contextmenu', context);
		
		function context() {
			event.stopPropagation();
			event.preventDefault();
			let context = document.getElementById('contextmenu');
			if (context !== null) {
				let parent = context.parentElement;
				parent.removeChild(context);
			} else {
				return false;
			}	
		}
	}
	
	this.labelConstruct = function(name, src, func) {
		let img = $.img(name, src);
		img.style.paddingRight = '10px';
		img.style.width = '25px';
		img.style.height = '25px';
		img.addEventListener('mousedown', func);
		img.addEventListener('mouseover', mouseover);
		img.addEventListener('mouseout', mouseout);
		
		function mouseover() {
			this.style.cursor = 'pointer';
		}
		
		function mouseout() {
			this.style.cursor = 'auto';
		}
		
		return img;
	}
	
	this.appManager = function() {
		let label = this.labelConstruct('Менеджер приложений', '/kernel/resources/media/tt_navigation_icons/logo.svg', KernelAppManager);
		function KernelAppManager() {
			event.stopPropagation();
			if (event.which === 1) {
				let app = new AppCollector();
				app.start('KernelApplicationsManager');
			} else {
				return false;
			}	
		}
		return label;
	}
	
	this.fileManager = function() {
		let label = this.labelConstruct('Шаблон приложения WorkSpace', '/kernel/resources/media/tt_navigation_icons/logo.svg', KernelFilesManager);
		function KernelFilesManager() {
			event.stopPropagation();
			if (event.which === 1) {
				let app = new AppCollector();
				app.start('WorkSpaceTemplateApplication');
			} else {
				return false;
			}	
		}
		return label;
	}
	
	this.settingsManager = function() {
		let label = this.labelConstruct('Шаблон приложения ядра', '/kernel/resources/media/tt_navigation_icons/logo.svg', KernelSettingsManager);
		function KernelSettingsManager() {
			event.stopPropagation();
			if (event.which === 1) {
				let app = new AppCollector();
				app.start('TemplateApplication');
			} else {
				return false;
			}	
		}
		return label;
	}
	
	this.logout = function() {
		let label = this.labelConstruct('Выход', '/kernel/resources/media/tt_navigation_icons/logo.svg', KernelLogout);
		function KernelLogout() {
			event.stopPropagation();
			if (event.which === 1) {
				let app = new AppCollector();
				app.start('KernelLogout');
			} else {
				return false;
			}	
		}
		return label;
	}
	
	
	
}
