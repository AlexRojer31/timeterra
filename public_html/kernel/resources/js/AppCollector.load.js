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

function AppCollector() {
	
	this.start = function(action, args) {
		let app;
		switch (action) {
			case 'KernelApplicationsManager':
				app = new KernelApplicationsManager();
				app.main();
				break;
			case 'KernelLogout':
				app = new KernelLogout();
				app.main();
				break;
			case 'TemplateApplication':
				app = new TemplateApplication();
				app.main();
				break;
			default:
				app = new WorkSpaceAppCollector();
				app.start(action, args);
				break;
		}
	}
	
}

function AppNotFound() {
	
	this.main = function() {
		alert('Этот ярлык не содержит программы');
	}
	
}

