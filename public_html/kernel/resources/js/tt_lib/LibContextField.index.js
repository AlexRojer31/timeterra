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


function LibContextField() {
	
	this.create = function() {
		event.preventDefault();
		event.stopPropagation();
		let context = document.getElementById('contextmenu');
		if (context !== null) {
			let parent = context.parentElement;
			parent.removeChild(context);
			this.construct();
		} else {
			this.construct();
		}
	}
	
	this.construct = function() {
		let context = $.div();
		context.id = 'contextmenu';
		this.setStyle(context);
		$.add(document.body, context);
	}
	
	this.setStyle = function(context) {
		context.style.backgroundColor = schema.get('navBackgroundColor');
		context.style.position = 'fixed';
		context.style.zIndex = '1000000';
		context.style.left = event.clientX + 'px';
		context.style.top = event.clientY + 'px';
	}
	
	this.addEvent = function(name, action, src) {
		let elem = $.paragraf(name, 'center');
		elem.style.color = schema.get('navColor');
		elem.style.cursor = 'pointer';
		elem.style.padding = '10px';
		elem.addEventListener('click', action);
		elem.addEventListener('mouseover', mouseover);
		elem.addEventListener('mouseout', mouseout);
		function mouseover() {
			elem.style.cursor = 'pointer';
			elem.style.backgroundColor = schema.get('workFieldBackgroundColor');
			elem.style.transition = '0.3s';
		}
		function mouseout() {
			elem.style.cursor = 'auto';
			elem.style.backgroundColor = 'transparent';
			elem.style.transition = '0';
		}
		let lightImg = $.img('icon', src);
		lightImg.style.width = '20px';
		lightImg.style.height = '20px';
		lightImg.style.paddingRight = '20px';
		lightImg.style.float = 'left';
		if (src) {
			$.add(elem, lightImg);
		}
		
		let context = document.getElementById('contextmenu');
		$.add(context, elem);
	}
	
}