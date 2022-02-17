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


function KernelResourcesManager() {
	
	LibAppField.call(this);
	
	this.main = function() {
		let appId = 'KernelFilesManager';
		if (this.checkApp(appId)) {
			return false;
		} else {
			this.create(appId, 500, 300, 'Менеджер файлов', '/kernel/resources/media/folder.png');
			let fileManager = document.getElementById(appId);
			this.setWorkPlace(fileManager);
		}
	}
	
	this.setWorkPlace = function(fileManager) {
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let contentField = $.div();
		contentField.id = 'contentFieldKernelFilesManager';
		contentField.style.clear = 'right';
		contentField.style.overflow = 'auto';
		$.add(fileManager, navigator);
		$.add(fileManager, contentField);
		
		this.getUserDirs(navigator, contentField);
		fileManager.addEventListener('contextmenu', contentFieldContext);
		
		function contentFieldContext() {
			let fileSrc = fileManager.getAttribute('fileSrc');
			let context = new LibContextField();
			context.create();
			context.addEvent('Загрузить', uploadNewFiles, false);
			context.addEvent('Вставить', pastThisFile, false);
			context.addEvent('Создать папку', createNewDir, false);
		
			function uploadNewFiles() {
				let appCollector = new AppCollector();
				appCollector.start('KernelFilesLoader', fileSrc);
			}
		
			function pastThisFile() {
				if (meta.get('link')) {
					let copySrc = meta.get('link');
					meta.set('link', false);
					
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=files&action=pastThisFile';
					let body = new FormData();
					body.append('copyFrom', copySrc);
					body.append('copyTo', fileSrc);
					let push = ajax.create('POST', body, url, msgPast);
					
					function msgPast() {
						let msg = new AppCollector();
						msg.start('KernelSystemMeesage', push.response);
						let updateContentField = new KernelFilesManager();
						updateContentField.reOpenDir();
					}
				} else {
					alert('Буфер обмена пуст');
				}
			}
		
			function createNewDir() {
				if (fileSrc === null) {
					return false;
				} else {
					let newDir = prompt('Имя новой директории', 'Новая папка');
					if (newDir === null) {
						return false;
					} else {
						let newDirInApp = fileSrc + '/' + newDir;
					
						let ajax = new LibAjax();
						let url = '/desktop/action/?controller=files&action=createNewDir';
						let body = new FormData();
						body.append('newDir', newDirInApp);
						let push = ajax.create('POST', body, url, msgDirCreate);
						
						function msgDirCreate() {
							let msg = new AppCollector();
							msg.start('KernelSystemMeesage', push.response);
							let updateContentField = new KernelFilesManager();
							updateContentField.reOpenDir();
						}
					}
				}
			}
		}
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function funcObserver(mutation, navigatorObserver) {
			for (let i = 0;i < mutation.length;i++) {
				if (mutation[i].attributeName === 'style') {
					let newHeight = fileManager.getAttribute('baseMinHeight') - 30;
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
		navigatorObserver.observe(fileManager, navigatorConfig);
	}
	
	this.getUserDirs = function(navigator, contentField) {
		
		let ajax = new LibAjax();
		let url = '/desktop/action/?controller=files&action=getUserDirs';
		let body = '';
		let push = ajax.create('POST', body, url, showUserDirs);
		
		function showUserDirs() {
			let appObj = new KernelFilesManager();
			let obj = ajax.json(push.response);
			for (let i = 0;i < obj.length;i++) {
				let thisObj = obj[i];
				let textName = foo.parseStr(thisObj['src'], '/', false);
				let userDir = $.sublist(textName, openUserDir, '/kernel/resources/media/folder.png');
				$.add(navigator, userDir);
			
				function openUserDir() {
					contentField.innerHTML = '';
					contentField.parentElement.setAttribute('mainSrc', thisObj['src']);
					contentField.parentElement.setAttribute('fileSrc', thisObj['src']);
					let link = appObj.dirConstruct(thisObj, contentField);
					$.add(contentField, link);
				}
			}
		}
		
	}
	
	this.dirConstruct = function(obj, contentField) {
		let linkFolder = $.flexbox('flex-start', 'center');
		linkFolder.style.margin = '5px 0px';
		linkFolder.addEventListener('mouseover', mouseover);
		linkFolder.addEventListener('mouseout', mouseout);
		linkFolder.addEventListener('click', openDir);
		linkFolder.addEventListener('contextmenu', dirContext);
		let icon = $.img('folder', '/kernel/resources/media/tt_files_icon/folder.png');
		icon.style.width = '30px';
		icon.style.height = 'auto';
		icon.style.marginRight = '10px';
		let textName = foo.parseStr(obj['src'], '/', false);
		let text = $.paragraf(textName, 'left');
		$.add(linkFolder, icon);
		$.add(linkFolder, text);
		
		function openDir() {
			contentField.parentElement.setAttribute('fileSrc', obj['src']);
			contentField.innerHTML = '';
			event.stopPropagation();
			let dir = obj['src'];
			let dirName = '/' + foo.parseStr(dir, '/', false);
			let comeBackDir = dir.replace(dirName, '');
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=files&action=getFileLinks';
			let body = new FormData();
			body.append('dir', dir);
			let push = ajax.create('POST', body, url, getFileLinks);
			
			function getFileLinks() {
				let appObj = new KernelFilesManager();
				let mainSrc = contentField.parentElement.getAttribute('mainSrc');
				if (mainSrc.length < dir.length) {
					let comeBack = appObj.comeBackDir(comeBackDir, contentField);
					$.add(contentField, comeBack);
				}
				let obj = ajax.json(push.response);
				for (let i = 0;i < obj.length;i++) {
					if (obj[i]['isDir']) {
						let link = appObj.dirConstruct(obj[i], contentField);
						$.add(contentField, link);
					} else {
						let link = appObj.hrefConstruct(obj[i], contentField);
						$.add(contentField, link);
					}
				}
			}
			
		}
		
		function dirContext() {
			event.stopPropagation();
			event.preventDefault();
			let parentSrc = contentField.parentElement.getAttribute('mainSrc');
			let fileSrc = obj['src'];
			let context = new LibContextField();
			context.create();
			if (parentSrc != fileSrc) {
				context.addEvent('Переименовать', renameThisDir, false);
				context.addEvent('Копировать', copyThisDir, false);
				context.addEvent('Удалить', deleteThisDir, false);
			} else {
				return false;
			}
		
			function renameThisDir() {
				let thisFile = foo.parseStr(fileSrc, '/', false);
				let fileName = foo.parseStr(thisFile, '.', '0');
				let newName = prompt('Введите новое имя файла', fileName);
				let newFileSrc = fileSrc.replace(fileName, newName);
				
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=files&action=renameThisFile';
				let body = new FormData();
				body.append('oldName', fileSrc);
				body.append('newName', newFileSrc);
				let push = ajax.create('POST', body, url, msgRename);
				
				function msgRename() {
					let msg = new AppCollector();
					msg.start('KernelSystemMeesage', push.response);
					let updateContentField = new KernelFilesManager();
					updateContentField.reOpenDir();
				}
			}
		
			function copyThisDir() {
				meta.set('link', fileSrc);
			}
		
			function deleteThisDir() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=files&action=deleteThisDir';
				let body = new FormData();
				body.append('src', fileSrc);
				let push = ajax.create('POST', body, url, msgDirDel);
				
				function msgDirDel() {
					let msg = new AppCollector();
					msg.start('KernelSystemMeesage', push.response);
					let updateContentField = new KernelFilesManager();
					updateContentField.reOpenDir();
				}
			}
		}
		
		return linkFolder;
	}
	
	this.hrefConstruct = function(obj, contentField) {
		let linkFolder = $.flexbox('flex-start', 'center');
		linkFolder.setAttribute('fileLink', obj['src']);
		linkFolder.style.margin = '5px 0px';
		linkFolder.addEventListener('click', lookThisFile);
		linkFolder.addEventListener('mouseover', mouseover);
		linkFolder.addEventListener('mouseout', mouseout);
		linkFolder.addEventListener('contextmenu', fileContext);
		let type = foo.parseStr(obj['src'], '.', false);
		let imgSrc;
		switch (type) {
			case 'svg': 
				imgSrc = '/kernel/resources/media/tt_files_icon/img.png';
				break;
			case 'png': 
				imgSrc = '/kernel/resources/media/tt_files_icon/img.png';
				break;
			case 'jpg': 
				imgSrc = '/kernel/resources/media/tt_files_icon/img.png';
				break;
			case 'jpeg': 
				imgSrc = '/kernel/resources/media/tt_files_icon/img.png';
				break;
			case 'tif': 
				imgSrc = '/kernel/resources/media/tt_files_icon/img.png';
				break;
			case 'ogg': 
				imgSrc = '/kernel/resources/media/tt_files_icon/video.png';
				break;
			case 'wav': 
				imgSrc = '/kernel/resources/media/tt_files_icon/video.png';
				break;
			case 'mp4': 
				imgSrc = '/kernel/resources/media/tt_files_icon/video.png';
				break;
			case 'ogv': 
				imgSrc = '/kernel/resources/media/tt_files_icon/video.png';
				break;
			case 'webm': 
				imgSrc = '/kernel/resources/media/tt_files_icon/video.png';
				break;
			case 'pdf': 
				imgSrc = '/kernel/resources/media/tt_files_icon/pdf.png';
				break;
			case 'txt': 
				imgSrc = '/kernel/resources/media/tt_files_icon/txt.png';
				break;
			case 'php': 
				imgSrc = '/kernel/resources/media/tt_files_icon/php.png';
				break;
			case 'js': 
				imgSrc = '/kernel/resources/media/tt_files_icon/js.png';
				break;
			case 'html': 
				imgSrc = '/kernel/resources/media/tt_files_icon/html.png';
				break;
			case 'htm': 
				imgSrc = '/kernel/resources/media/tt_files_icon/html.png';
				break;
			case 'css': 
				imgSrc = '/kernel/resources/media/tt_files_icon/css.png';
				break;
			case 'docx': 
				imgSrc = '/kernel/resources/media/tt_files_icon/docx.png';
				break;
			case 'xlsx': 
				imgSrc = '/kernel/resources/media/tt_files_icon/excel.png';
				break;
			default: 
				imgSrc = '/kernel/resources/media/tt_files_icon/app.gif';
				break;
		}
		let icon = $.img('file', imgSrc);
		icon.style.width = '30px';
		icon.style.height = 'auto';
		icon.style.marginRight = '10px';
		let textName = foo.parseStr(obj['src'], '/', false);
		let text = $.paragraf(textName, 'left');
		$.add(linkFolder, icon);
		$.add(linkFolder, text);
		
		function lookThisFile() {
			let viewLink = this.getAttribute('fileLink')
			let viewwer = new AppCollector();
			viewwer.start("KernelFilesViewer", viewLink);
		}
		
		function fileContext() {
			event.stopPropagation();
			event.preventDefault();
			let fileSrc = obj['src'];
			let context = new LibContextField();
			context.create();
			context.addEvent('Скачать', downloadThisFile, false);
			context.addEvent('Переименовать', renameThisFile, false);
			context.addEvent('Копировать', copyThisFile, false);
			context.addEvent('Удалить', deleteThisFile, false);
		
			function renameThisFile() {
				let thisFile = foo.parseStr(fileSrc, '/', false);
				let fileName = foo.parseStr(thisFile, '.', '0');
				let newName = prompt('Введите новое имя файла', fileName);
				let newFileSrc = fileSrc.replace(fileName, newName);
				
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=files&action=renameThisFile';
				let body = new FormData();
				body.append('oldName', fileSrc);
				body.append('newName', newFileSrc);
				let push = ajax.create('POST', body, url, msgRename);
				
				function msgRename() {
					let msg = new AppCollector();
					msg.start('KernelSystemMeesage', push.response);
					let updateContentField = new KernelFilesManager();
					updateContentField.reOpenDir();
				}
			}
		
			function copyThisFile() {
				meta.set('link', fileSrc);
			}
			
			function deleteThisFile() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=files&action=deleteThisFile';
				let body = new FormData();
				body.append('src', fileSrc);
				let push = ajax.create('POST', body, url, msgDelete);
				
				function msgDelete() {
					let msg = new AppCollector();
					msg.start('KernelSystemMeesage', push.response);
					let updateContentField = new KernelFilesManager();
					updateContentField.reOpenDir();
				}
			}
		
			function downloadThisFile() {
				let thisFileDownloader = new AppCollector();
				thisFileDownloader.start('KernelFilesDownloader', fileSrc);
			}
		}
		
		return linkFolder;
	}
	
	this.comeBackDir = function(comeBackDir, contentField) {
		let linkFolder = $.flexbox('flex-start', 'center');
		linkFolder.style.margin = '5px 0px';
		linkFolder.addEventListener('mouseover', mouseover);
		linkFolder.addEventListener('mouseout', mouseout);
		linkFolder.addEventListener('click', openDir);
		let icon = $.img('folder', '/kernel/resources/media/tt_files_icon/folder.png');
		icon.style.width = '30px';
		icon.style.height = 'auto';
		icon.style.marginRight = '10px';
		let text = $.paragraf('..', 'left');
		$.add(linkFolder, icon);
		$.add(linkFolder, text);
		
		function openDir() {
			contentField.innerHTML = '';
			event.stopPropagation();
			let dir = comeBackDir;
			let dirName = '/' + foo.parseStr(dir, '/', false);
			let cbDir = dir.replace(dirName, '');
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=files&action=getFileLinks';
			let body = new FormData();
			body.append('dir', comeBackDir);
			let push = ajax.create('POST', body, url, getFileLinks);
			
			function getFileLinks() {
				contentField.parentElement.setAttribute('fileSrc', dir);
				let appObj = new KernelFilesManager();
				let obj = ajax.json(push.response);
				let mainSrc = contentField.parentElement.getAttribute('mainSrc');
				if (mainSrc.length < dir.length) {
					let comeBack = appObj.comeBackDir(cbDir, contentField);
					$.add(contentField, comeBack);
				}
				for (let i = 0;i < obj.length;i++) {
					if (obj[i]['isDir']) {
						let link = appObj.dirConstruct(obj[i], contentField);
						$.add(contentField, link);
					} else {
						let link = appObj.hrefConstruct(obj[i], contentField);
						$.add(contentField, link);
					}
				}
			}
		}
		
		return linkFolder;
	}
	
	this.reOpenDir = function() {
		let contentField = document.getElementById('contentFieldKernelFilesManager');
		contentField.innerHTML = '';
		let dir = contentField.parentElement.getAttribute('fileSrc');
		let dirName = '/' + foo.parseStr(dir, '/', false);
		let comeBackDir = dir.replace(dirName, '');
		let ajax = new LibAjax();
		let url = '/desktop/action/?controller=files&action=getFileLinks';
		let body = new FormData();
		body.append('dir', dir);
		let push = ajax.create('POST', body, url, getFileLinks);
		
		function getFileLinks() {
			let appObj = new KernelFilesManager();
			let mainSrc = contentField.parentElement.getAttribute('mainSrc');
			if (mainSrc.length < dir.length) {
				let comeBack = appObj.comeBackDir(comeBackDir, contentField);
				$.add(contentField, comeBack);
			}
			let obj = ajax.json(push.response);
			for (let i = 0;i < obj.length;i++) {
				if (obj[i]['isDir']) {
					let link = appObj.dirConstruct(obj[i], contentField);
					$.add(contentField, link);
				} else {
					let link = appObj.hrefConstruct(obj[i], contentField);
					$.add(contentField, link);
				}
			}
		}
	}
		
	function mouseover() {
		this.style.cursor = 'pointer';
		this.style.opacity = '0.8';
	}
	
	function mouseout() {
		this.style.cursor = 'auto';
		this.style.opacity = '1';
	}
	
}
