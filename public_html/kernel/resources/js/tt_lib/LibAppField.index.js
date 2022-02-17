/*
* TimeTerra - Enterprise resources planning software
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


function LibAppField() {
	
	this.create = function(appId, appWidth, appHeight, appName, appIcon, additionalScripts) {
		let thisApp = this;
		let id = appId;
		let width = appWidth;
		let height = appHeight;
		let name = appName;
		let src = appIcon;
		if (additionalScripts.length > 0) {
			getAppAdditionalScriptsVersion(additionalScripts);
		} else {
			thisApp.appConstructor(id, width, height, name, src);
		}
		function getAppAdditionalScriptsVersion(additionalScripts) {
			let ajax = new LibAjax();
			let url = '/desktop/ajax/?controller=desktop&action=getAppAdditionalScriptsVersion';
			let body = new FormData();
			body.append('appName', name)
			body.append('scripts', JSON.stringify(additionalScripts));
			let push = ajax.create('POST', body, url, scriptsVersionObjReturn);
			function scriptsVersionObjReturn() {
				let obj = ajax.json(push.response);
				loadScript(obj.pop(), obj);
			}
		}
		function loadScript(scriptSrc, additionalScripts) {
			if (scriptSrc === false) {
				sistemMessenger.createMsg(-1, 'Загрузка сопутствующих скриптов для приложения <b>' + name + '</b> потерпела неудачу!');
				return false;
			}
			let head = document.querySelector('head');
			let script = document.createElement('script');
			script.src = scriptSrc;
			if (appScripts.get(scriptSrc) === undefined) {
				$.add(head, script);
				appScripts.set(scriptSrc, scriptSrc);
			} else {
				if (additionalScripts.length > 0) {
					loadScript(additionalScripts.pop(), additionalScripts);
				} else {
					thisApp.appConstructor(id, width, height, name, src);
				}
			}
			script.onload = function() {
				if (additionalScripts.length > 0) {
					loadScript(additionalScripts.pop(), additionalScripts);
				} else {
					thisApp.appConstructor(id, width, height, name, src);
				}
			}
			script.onerror = function() {
				alert('loading error');
			}
		}
	}
	
	this.appConstructor = function(id, width, height, name, src) {
		if (this.checkApp(id)) {
			return false;
		} else {
			this.createApp(id, width, height, name, src);
			this.workFieldConstrcuctor(id, name);
			let selected = document.querySelectorAll('.selected');
			for (let i = 0;i < selected.length;i++) {
				selected[i].style.zIndex = '1';
				selected[i].style.boxShadow = 'none';
				selected[i].classList.remove('selected');
			}
			let activeElem = document.getElementById(id);
			activeElem.style.zIndex = '1000';
			activeElem.style.boxShadow = '3px 3px 25px ' + schema.get('color');
			activeElem.classList.add('selected');	
		}
	}
	
	this.createApp = function(id, width, height, name, src) {
		let desktop = document.getElementById('kernelDesktop');
		let app = $.div();
		app.id = id;
		app.setAttribute('baseWidth', width);
		app.setAttribute('baseHeight', height);
		app.setAttribute('baseMinHeight', height);
		app.setAttribute('applicationName', name);
		app.addEventListener('contextmenu', stopcontext);
		app.addEventListener('mousemove', appResize);
		app.addEventListener('click', selected);
		
		if (document.documentElement.clientWidth > 500) {
			app.style.position = 'fixed';
			app.style.width = width + 'px';
			app.style.minHeight = height + 'px';
			app.style.height = height + 'px';
			app.style.left = '0px';
			app.style.top = '0px';
		} else {
			app.style.position = 'fixed';
			app.style.width = document.documentElement.clientWidth + 'px';
			app.style.height = (document.documentElement.clientHeight - 40) + 'px';
			app.setAttribute('baseMinHeight', (document.documentElement.clientHeight - 40));
			app.setAttribute('baseWidth', document.documentElement.clientWidth);
			app.setAttribute('baseHeight', (document.documentElement.clientHeight - 40));
			app.style.left = '0px';
			app.style.top = '0px';
		}
		
		app.style.zIndex = '1';
		app.style.overflow = 'hidden';
		app.style.backgroundColor = schema.get('backgroundColor');
		$.add(desktop, app);
		this.setAppTaskBar(id, name, src);
		this.setAppWorkField(id);
		
		function stopcontext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function appResize() {
			let elemBottom = app.offsetHeight + app.offsetTop;
			let elemRight = app.offsetWidth + app.offsetLeft;
			let cursorY = event.clientY;
			let cursorX = event.clientX;
			let topD = elemBottom - 5;
			let bottomD = elemBottom + 5;
			let leftD = elemRight - 5;
			let rigthD = elemRight + 5;
			if (topD < cursorY && cursorY < bottomD) {
				app.style.cursor = 's-resize';
				app.addEventListener('mousedown', sResize);
			} else {
				if (leftD < cursorX && cursorX < rigthD) {
					app.style.cursor = 'e-resize';
					app.addEventListener('mousedown', eResize);
				} else {
					app.style.cursor = 'auto';
					app.removeEventListener('mousedown', sResize);
					app.removeEventListener('mousedown', eResize);
				}
			}
		}
		
		function sResize() {
			if (event.which == 1) {
				let shiftY = event.clientY - app.offsetHeight;
				
				document.addEventListener('mousemove', resizeElemY);
				app.addEventListener('mouseup', stopResize);
				
				function resizeElemY() {
					elemNewResize(event.clientY);
				}	
				
				function elemNewResize(pageY) {
					let newHeight = pageY - shiftY;
					app.style.minHeight = newHeight + 'px';
					app.setAttribute('baseHeight', newHeight);
					app.setAttribute('baseMinHeight', newHeight);
				}	
				
				function stopResize() {
					document.removeEventListener('mousemove', resizeElemY);
				}
			} else {
				return false;
			}
		}
		
		function eResize() {
			if (event.which == 1) {
				let shiftX = event.clientX - app.offsetWidth;
				
				document.addEventListener('mousemove', resizeElemX);
				app.addEventListener('mouseup', stopResize);
				
				function resizeElemX() {
					elemNewResize(event.clientX);
				}	
				
				function elemNewResize(pageX) {
					let newWidth = pageX - shiftX;
					app.style.width = newWidth + 'px';
					app.setAttribute('baseWidth', newWidth);
				}	
				
				function stopResize() {
					document.removeEventListener('mousemove', resizeElemX);
				}
			} else {
				return false;
			}
		}
		
		function selected() {
			let selected = document.querySelectorAll('.selected');
			for (let i = 0;i < selected.length;i++) {
				selected[i].style.zIndex = '1';
				selected[i].style.boxShadow = 'none';
				selected[i].classList.remove('selected');
			}
			let activeElem = document.getElementById(this.id);
			activeElem.style.zIndex = '1000';
			activeElem.style.boxShadow = '3px 3px 25px ' + schema.get('color');
			activeElem.classList.add('selected');
		}
		
	}
	
	this.setAppTaskBar = function(id, name, src) {
		let app = document.getElementById(id);
		let taskBar = $.clearfix();
		
		let logo = $.float('left');
		logo.style.padding = '3px';
		logo.style.width = '24px';
		logo.style.height = '24px';
		logo.style.overflow = 'hidden';
		let img = $.img(name, src);
		img.style.height = '100%';
		$.add(logo, img);
		
		let appName = $.float('left');
		appName.style.padding = '5px';
		let appTitle = $.paragraf(name, 'left');
		appTitle.style.color = schema.get('navColor');
		$.add(appName, appTitle);
		
		let closeButton = $.float('right');
		closeButton.style.padding = '0px 5px';
		closeButton.style.cursor = 'pointer';
		closeButton.style.color = schema.get('navColor');
		closeButton.style.fontSize = '24px';
		closeButton.innerHTML = '&#215';
		closeButton.addEventListener('click', closeApp);
		closeButton.addEventListener('click', closeContext);
		
		let expandButton = $.float('right');
		expandButton.style.padding = '0px 5px';
		expandButton.style.cursor = 'pointer';
		expandButton.style.color = schema.get('navColor');
		expandButton.style.fontSize = '19px';
		expandButton.innerHTML = '&#9744';
		expandButton.addEventListener('click', expandApp);
		
		let rollButton = $.float('right');
		rollButton.style.padding = '0px 5px';
		rollButton.style.cursor = 'pointer';
		rollButton.style.color = schema.get('navColor');
		rollButton.style.fontSize = '19px';
		rollButton.innerHTML = '_';
		rollButton.addEventListener('click', rollUpApp);
		
		taskBar.style.width = '100%';
		taskBar.style.height = '30px';
		taskBar.style.overflow = 'hidden';
		taskBar.style.backgroundColor = schema.get('navBackgroundColor');
		
		taskBar.addEventListener('contextmenu', selected);
		taskBar.addEventListener('contextmenu', context);
		taskBar.addEventListener('mouseover', mouseover);
		taskBar.addEventListener('mouseout', mouseout);
		taskBar.addEventListener('mousedown', mousedown);
		taskBar.addEventListener('mouseup', mouseup);
		
		if (document.documentElement.clientWidth > 500) {
			taskBar.addEventListener('mousedown', move);
		} else {
			taskBar.removeEventListener('mousedown', move);
		}
		
		function closeApp() {
			event.stopPropagation();
			let desktop = document.getElementById('kernelDesktop');
			sistemMessenger.createMsg(1, 'Приложение <b>' + name + '</b> было остановлено!');
			$.remove(desktop, this.parentElement.parentElement);
		}
		
		function expandApp() {
			let taskBar = this.parentElement;
			let elem = document.getElementById(id);
			let clientWidth = document.documentElement.clientWidth + 'px';
			let clientHeight = (document.documentElement.clientHeight - 40) + 'px';
			let elemWidth = elem.style.width;
			let elemBaseWidth = elem.getAttribute('baseWidth') + 'px';
			let elemBaseMinHeight = elem.getAttribute('baseHeight') + 'px';
			if (clientWidth === elemWidth) {
				elem.style.width = elemBaseWidth;
				elem.style.minHeight = elemBaseMinHeight;
				elem.style.height = elemBaseMinHeight;
				elem.setAttribute('baseMinHeight', elem.getAttribute('baseHeight'));
				elem.style.overflow = 'hidden';
				taskBar.addEventListener('mousedown', move);
			} else {
				elem.style.overflow = 'hidden';
				elem.style.position = 'fixed';
				elem.style.left = 0;
				elem.style.top = 0;
				elem.style.width = clientWidth;
				elem.style.minHeight = clientHeight;
				elem.style.height = clientHeight;
				elem.setAttribute('baseMinHeight', (document.documentElement.clientHeight - 40));
				taskBar.removeEventListener('mousedown', move);
			}
		}
		
		function rollUpApp() {
			let desktop = document.getElementById('kernelDesktop');
			let taskBar = this.parentElement;
			let app = document.getElementById(id);
			taskBar.removeEventListener('mousedown', move);
			app.style.marginRight = '10px';
			app.style.left = 0;
			app.style.top = 0;
			app.style.width = '30px';
			app.style.height = '30px';
			app.style.minHeight = '30px';
			app.style.overflow = 'hidden';
			app.style.position = 'relative';
			let nav = document.getElementById('kernelNavigation');
			$.rePos(desktop, nav, app);
			taskBar.addEventListener('mousedown', unRoll);
			
			function unRoll() {
				event.stopPropagation();
				let desktop = document.getElementById('kernelDesktop');
				let app = document.getElementById(id);
				let nav = document.getElementById('kernelNavigation');
				let elemBaseWidth = app.getAttribute('baseWidth') + 'px';
				let elemBaseMinHeight = app.getAttribute('baseHeight') + 'px';
				app.style.overflow = 'hidden';
				app.style.position = 'fixed';
				app.style.left = 0;
				app.style.top = 0;
				app.style.width = elemBaseWidth;
				app.style.minHeight = elemBaseMinHeight;
				app.style.height = elemBaseMinHeight;
				app.setAttribute('baseMinHeight', app.getAttribute('baseHeight'));
				$.rePos(nav, desktop, app);
				this.removeEventListener('mousedown', unRoll);
				this.addEventListener('mousedown', move);
			}
		}
		
		function selected() {
			let selected = document.querySelectorAll('.selected');
			for (let i = 0;i < selected.length;i++) {
				selected[i].style.zIndex = '1';
				selected[i].style.boxShadow = 'none';
				selected[i].classList.remove('selected');
			}
			let activeElem = document.getElementById(this.parentElement.id);
			activeElem.style.zIndex = '1000';
			activeElem.style.boxShadow = '3px 3px 25px ' + schema.get('color');
			activeElem.classList.add('selected');
		}
		
		function context() {
			let context = new LibContextField();
			context.create();
			context.addEvent('Закрыть', closeThisApp, "/kernel/resources/media/tt_navigation_icons/logo.svg");
			
			function closeThisApp() {
				event.stopPropagation();
				let desktop = document.getElementById('kernelDesktop');
				let selected = document.querySelectorAll('.selected');
				for (let i = 0;i < selected.length;i++) {
					applicationShell.closeThisApp(selected[i])
					//$.remove(desktop, selected[i]);
				}
				let context = document.getElementById('contextmenu');
				$.remove(desktop, context);
			}
		}
		
		function closeContext() {
			let context = document.getElementById('contextmenu');
			if (context !== null) {
				let parent = context.parentElement;
				$.remove(parent, context);
			} else {
				return false;
			}	
		}
		
		function mouseover() {
			this.style.cursor = 'grab';
		}
		
		function mouseout() {
			this.style.cursor = 'auto';
		}
		
		function mousedown() {
			this.style.cursor = 'grabbing';
		}
		
		function mouseup() {
			this.style.cursor = 'grab';
		}
		
		function move() {
			if (event.which == 1) {
				
				let app = document.getElementById(this.parentElement.id);
				app.style.zIndex = '1000';
				
				let shiftX = event.clientX - app.offsetLeft;
				let shiftY = event.clientY - app.offsetTop;
				
				document.addEventListener('mousemove', moveElem);
				app.addEventListener('mouseup', stopMove);
				
				function moveElem() {
					elemPosition(event.clientX, event.clientY);
				}	
				
				function elemPosition(pageX, pageY) {
					app.style.left = (pageX - shiftX) + 'px';
					app.style.top = (pageY - shiftY) + 'px';
				}	
				
				function stopMove() {
					app.style.zIndex = '1';
					document.removeEventListener('mousemove', moveElem);
				}
			} else {
				return false;
			}
		}
		
		$.add(app, taskBar);
		$.add(taskBar, logo);
		$.add(taskBar, appName);
		$.add(taskBar, closeButton);
		$.add(taskBar, expandButton);
		$.add(taskBar, rollButton);
	}
	
	this.setAppWorkField = function(id) {
		let app = document.getElementById(id);
		let workField = $.div();
		workField.id = id + 'workField';
		workField.style.width = '100%';
		workField.style.backgroundColor = schema.get('workFieldBackgroundColor');
		let workFieldHeight = +app.getAttribute('baseHeight') - 30;
		workField.style.height = workFieldHeight + 'px';
		workField.style.minHeight = workFieldHeight + 'px';
		workField.style.overflow = 'auto';
		$.add(app, workField);
		this.mutationController(app, workField);
	}
	
	this.workFieldConstrcuctor = function(id, name) {
		if (this.checkApp(id)) {
			sistemMessenger.createMsg(1, 'Оболочка для приложения <b>' + name + '</b> успешно построена!');
			let workField = this.getWorkField(id);
			if (workField.innerHTML !== '') {
				return false;
			} else {
				this.construct(workField);
			}
		} else {
			return false;
		}
	}
	
	this.getWorkField = function(id) {
		let workFieldId = id + 'workField';
		let workField = document.getElementById(workFieldId);
		return workField;
	}
	
	this.mutationController = function(manager, guided) {
		function funcObserver(mutation, navigatorObserver) {
			for (let i = 0;i < mutation.length;i++) {
				if (mutation[i].attributeName === 'style') {
					let guidedHeight = manager.getAttribute('baseMinHeight') - 30;
					guided.style.height = guidedHeight + 'px';
				} else {
					return false;
				}
			}
		}
		let navigatorConfig = {
			attributes: true,
		}
		let navigatorObserver = new MutationObserver(funcObserver);
		navigatorObserver.observe(manager, navigatorConfig);
	}
	
	this.checkApp = function(id) {
		let elem = document.getElementById(id);
		if (elem !== null) {
			return true;
		} else {
			return false;	
		}
	}
	
	this.closeThisApp = function(app) {
		let desktop = document.getElementById('kernelDesktop');
		if (app === null) {
			return false;
		} else {
			let appName = app.getAttribute('applicationName');
			sistemMessenger.createMsg(1, 'Приложение <b>' + appName + '</b> было остановлено!');
			$.remove(desktop, app);
		}
	}
	
}