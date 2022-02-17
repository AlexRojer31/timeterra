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


function KernelLogout() {
	
	LibAppField.call(this);
	
	this.main = function() {
		let appId = 'KernelLogout';
		let appWidth = 300;
		let appHeight = 112;
		let appName = 'Exit';
		let appIcon = '/kernel/resources/media/tt_application_icons/logo.svg';
		let additionalScripts = [
			//some scripts array
		];
		this.create(appId, appWidth, appHeight, appName, appIcon, additionalScripts);
	}
	
	this.construct = function(workField) {
		this.createLinks(workField);
	}
	
	this.createLinks = function(workField) {
		let logout = $.btn('Закрыть приложение', close);
		let logoff = $.btn('Выйти из приложения', closeAll);
		function close() {
			document.location.href = '/desktop/logout/';
		}
		function closeAll() {
			document.location.href = '/desktop/logoff/';
		}
		$.add(workField, logout);
		$.add(workField, logoff);
	}
	
}
