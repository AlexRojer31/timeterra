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


function LibSistemMessenger() {
	
	this.msgFieldConstruct = function() {
		let msgField = $.div();
		msgField.id = 'kernelMsgField';
		msgField.style.width = '25%';
		msgField.style.minWidth = '200px';
		msgField.style.height = 'auto';
		msgField.style.backgroundColor = 'transparent';
		msgField.style.position = 'fixed';
		msgField.style.zIndex = 1000000;
		msgField.style.right = '0';
		msgField.style.bottom = '40px';
		let desktop = document.getElementById('kernelDesktop');
		$.add(desktop, msgField);
	}
	
	this.createMsg = function(type, msg) {
		let msgBox = $.flexbox('flex-start', 'center');
		msgBox.style.margin = '2px';
		msgBox.style.padding = '3px';
		msgBox.style.borderRadius = '10px';
		msgBox.style.backgroundColor = schema.get('workFieldBackgroundColor');
		msgBox.style.flexWrap = 'nowrap';
		let msgTypeBox = $.flexelem(30, 0, 0);
		let msgTextBox = $.flexelem(130, 0, 0);
		let msgType = $.div();
		msgType.style.display = 'inline-block';
		msgType.style.marginRight = '15px';
		msgType.style.width = '20px';
		msgType.style.height = '20px';
		msgType.style.borderRadius = '10px';
		let typeBackgroundColor;
		switch (type) {
			case (-1):
				typeBackgroundColor = 'red';
				break;
			case (0):
				typeBackgroundColor = 'yellow';
				break;
			case (1):
				typeBackgroundColor = 'green';
				break;
		}
		msgBox.style.border = '2px solid ' + typeBackgroundColor;
		msgType.style.backgroundColor = typeBackgroundColor;
		msgType.style.boxShadow = '1px 1px 5px ' + typeBackgroundColor;
		let msgText = $.paragraf(msg, 'left');
		msgText.style.display = 'inline-block';
		msgText.style.color = schema.get('navColor');
		$.add(msgBox, msgTypeBox);
		$.add(msgBox, msgTextBox);
		$.add(msgTypeBox, msgType);
		$.add(msgTextBox, msgText);
		this.addMsg(msgBox, msg);
	}
	
	this.addMsg = function(msgBox, msg) {
		let msgField = document.getElementById('kernelMsgField');
		$.add(msgField, msgBox);
		this.logMsg(msg);
		setTimeout(removeMsg, 2000);
		function removeMsg() {
			msgBox.style.opacity = '0';
			msgBox.style.transition = '0.5s';
			setTimeout(function() {
				$.remove(msgField, msgBox);
			}, 1000);
		}
	}
	
	this.logMsg = function(msg) {
		let ajax = new LibAjax();
		let url = '/desktop/ajax/?controller=sistemMessenger&action=logMsg';
		let body = new FormData();
		body.append('msg', msg);
		let push = ajax.create('POST', body, url, func);
		function func() {
			// some result
		}
	}
	
}
