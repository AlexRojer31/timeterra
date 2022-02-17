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


function WorkSpaceTemplateApplication() {
	
	LibAppField.call(this);
	
	this.main = function() {
		let appId = 'WorkSpaceTemplateApplication';
		let appWidth = 500;
		let appHeight = 300;
		let appName = 'WorkSpace Tempate application';
		let appIcon = '/kernel/resources/media/tt_application_icons/logo.svg';
		let additionalScripts = [
			'/workspace/resources/js/ws_app/workspace_template_application/WorkSpaceTemplateAdditionalScript.js'
		];
		this.create(appId, appWidth, appHeight, appName, appIcon, additionalScripts);
	}
	
	this.construct = function(workField) {
		let test = new WorkSpaceTemplateAdditionalScript();
		let navH = $.navH();
		$.add(workField, navH);
		let hello = $.navBtnH('Hello', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let qwe = $.navBtnH('qweqwe', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let asd = $.navBtnH('asdasdasdasd', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let zxc = $.navBtnH('zxc', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		$.add(navH, hello);
		$.add(navH, qwe);
		$.add(navH, asd);
		$.add(navH, zxc);
		
		let navV = $.navV('left');
		$.add(workField, navV);
		let by = $.navBtnV('Hello', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let qwe1 = $.navBtnV('qweqwe', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let asd1 = $.navBtnV('asdasdasdasd', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		let zxc1 = $.navBtnV('zxc', sayHi, '/kernel/resources/media/tt_navigation_icons/logo.svg');
		$.add(navV, by);
		$.add(navV, qwe1);
		$.add(navV, asd1);
		$.add(navV, zxc1);
		
		function sayHi() {
			alert(test.sayHello());
		}
	}

}
