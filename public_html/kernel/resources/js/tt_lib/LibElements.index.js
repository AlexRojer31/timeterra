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

function LibElements() {
	
	this.add = function(parent, child) {
		parent.appendChild(child);
	}
	
	this.remove = function(parent, child) {
		parent.removeChild(child);
	}
	
	this.rePos = function(parent, newParent, child) {
		parent.removeChild(child);
		newParent.appendChild(child);
	}

	this.div = function() {
		let div = document.createElement('div');
		div.style.color = schema.get('color');
		div.style.margin = '0';
		div.style.padding = '0';
		return div;
	}

	this.span = function() {
		let span = document.createElement('span');
		span.style.margin = '0';
		span.style.padding = '0';
		return span;
	}

	this.flexbox = function(content, align) {
		let flexbox = document.createElement('div');
		flexbox.style.justifyContent = content;
		flexbox.style.alignItems = align;
		flexbox.style.display = 'flex';
		flexbox.style.margin = '0';
		flexbox.style.padding = '0';
		flexbox.style.flexWrap = 'wrap';
		return flexbox;
	}

	this.flexelem = function(size, grow, zip) {
		let flexelem = document.createElement('div');
		flexelem.style.flex = size + ' ' + grow + ' ' + zip;
		flexelem.style.margin = '0';
		flexelem.style.padding = '0';
		return flexelem;
	}

	this.clearfix = function() {
		clearfix = this.div();
		clearfix.classList.add('clearfix');
		return clearfix;
	}

	this.float = function(side) {
		let float = document.createElement('div');
		float.style.float = side;
		return float;
	}

	this.btn = function(name, func) {
		let btn = this.div();
		btn.style.display = 'block';
		btn.style.textAlign = 'center';
		btn.style.fontFamily = schema.get('fontFamily');
		btn.style.backgroundColor = schema.get('workFieldBackgroundColor');
		btn.style.fontSize = '18px';
		btn.style.padding = '10px 25px';
		btn.innerHTML = name;
		btn.addEventListener('click', func);
		btn.addEventListener('mouseover', mouseover);
		btn.addEventListener('mouseout', mouseout);
			
		function mouseover() {
			btn.style.cursor = 'pointer';
			btn.style.backgroundColor = schema.get('navColor');
			btn.style.transition = '0.3s';
		}
		
		function mouseout() {
			btn.style.cursor = 'auto';
			btn.style.backgroundColor = schema.get('workFieldBackgroundColor');
			btn.style.transition = '0';
		}
		return btn;
	}

	this.navH = function() {
		let navH = this.clearfix();
		navH.style.backgroundColor = schema.get('navBackgroundColor');
		return navH;
	}

	this.navBtnH = function(name, func, src) {
		let navBtnH = this.float('left');
		let container = this.flexbox('flex-start', 'center');
		this.add(navBtnH, container);
		let icon = this.img(name, src);
		icon.style.width = '15px';
		icon.style.height = '15px';
		icon.style.marginRight = '5px';
		let text = this.paragraf(name, 'left');
		this.add(container, icon);
		this.add(container, text);
		navBtnH.style.backgroundColor = 'transparent';
		navBtnH.style.padding = '3px 10px';
		navBtnH.addEventListener('click', func);
		navBtnH.addEventListener('mouseover', mouseover);
		navBtnH.addEventListener('mouseout', mouseout);
			
		function mouseover() {
			navBtnH.style.cursor = 'pointer';
			navBtnH.style.backgroundColor = schema.get('navColor');
			navBtnH.style.transition = '0.3s';
		}
		
		function mouseout() {
			navBtnH.style.cursor = 'auto';
			navBtnH.style.backgroundColor = 'transparent';
			navBtnH.style.transition = '0';
		}
		return navBtnH;
	}

	this.navV = function() {
		let navV = this.float('left');
		navV.style.backgroundColor = 'transparent';
		return navV;
	}

	this.navBtnV = function(name, func, src) {
		let navBtnV = this.flexbox('flex-start', 'center');
		navBtnV.style.padding = '5px';
		navBtnV.style.backgroundColor = 'transparent';
		let icon = this.img(name, src);
		icon.style.width = '25px';
		icon.style.height = '25px';
		icon.style.marginRight = '15px';
		let text = this.paragraf(name, 'left');
		navBtnV.addEventListener('click', func);
		navBtnV.addEventListener('mouseover', mouseover);
		navBtnV.addEventListener('mouseout', mouseout);
		this.add(navBtnV, icon);
		this.add(navBtnV, text);
			
		function mouseover() {
			navBtnV.style.cursor = 'pointer';
			navBtnV.style.backgroundColor = schema.get('navColor');
			navBtnV.style.transition = '0.3s';
		}
		
		function mouseout() {
			navBtnV.style.cursor = 'auto';
			navBtnV.style.backgroundColor = 'transparent';
			navBtnV.style.transition = '0';
		}
		return navBtnV;
	}

	this.navP = function() {
		let navP = this.flexbox('center', 'flex-start');
		navP.style.width = '100%';
		return navP;
	}

	this.navBtnP = function(name, title, func, src) {
		let navBtnP = this.flexelem('200px', 1, 1);
		navBtnP.style.height = '130px';
		navBtnP.style.overflow = 'hidden';
		let container = this.flexbox('flex-start', 'center');
		container.style.flexDirection = 'column';
		let navIcon = this.img(name, src);
		navIcon.style.width = '50px';
		navIcon.style.height = '50px';
		let navName = this.headline(name, 4, 'center');
		navName.style.fontSize = '16px';
		let navTitle = this.paragraf(title, 'center');
		navTitle.style.fontSize = '12px';
		this.add(navBtnP, container);
		this.add(container, navIcon);
		this.add(container, navName);
		this.add(container, navTitle);
		navBtnP.addEventListener('click', func);
		navBtnP.addEventListener('mouseover', mouseover);
		navBtnP.addEventListener('mouseout', mouseout);
			
		function mouseover() {
			navBtnP.style.cursor = 'pointer';
			navBtnP.style.boxShadow = '3px 3px 5px ' + schema.get('navColor');
		}
		
		function mouseout() {
			navBtnP.style.cursor = 'auto';
			navBtnP.style.boxShadow = 'none';
		}
		
		return navBtnP;
	}
	
	this.headline = function(text, type, align) {
		let headline = document.createElement('h' + type);
		headline.style.color = schema.get('color');
		headline.style.fontFamily = schema.get('fontFamily');
		headline.style.fontWeight = 'bold';
		headline.style.textAlign = align;
		headline.innerHTML = text;
		return headline;
	}

	this.paragraf = function(text, align) {
		let paragraf = document.createElement('p');
		paragraf.innerHTML = text;
		paragraf.style.textAlign = align;
		paragraf.style.color = schema.get('color');
		paragraf.style.fontFamily = schema.get('fontFamily');
		paragraf.style.padding = '0';
		paragraf.style.margin = '0';
		return paragraf;
	}

	this.link = function(text, href) {
		let link = document.createElement('a');
		link.style.color = schema.get('color');
		link.style.fontFamily = schema.get('fontFamily');
		link.innerHTML = text;
		link.href = href;
		return link;
	}

	this.img = function(title, src) {
		let img = document.createElement('img');
		img.title = title;
		img.alt = title;
		img.src = src;
		return img;
	}

	this.form = function(name) {
		let form = document.createElement('form');
		form.style.color = schema.get('color');
		form.style.margin = '10px';
		form.enctype = 'multipart/form-data';
		form.name = name;
		form.id = name;
		return form;
	}

	this.input = function(type, name, multiple) {
		let input = document.createElement('input');
		input.style.color = schema.get('color');
		input.style.fontFamily = schema.get('fontFamily');
		input.style.fontSize = '12px';
		input.style.backgroundColor = 'transparent';
		input.style.border = 'none';
		input.style.margin = '10px';
		input.style.padding = '5px';
		input.multiple = multiple;
		input.id = name;
		if (multiple) {
			input.name = name + '[]';
		} else {
			input.name = name;
		}
		try {
			input.type = type;
		} catch (e) {
			input.type = 'text';
		}	
		return input;
	}

	this.label = function(name, inputId) {
		let label = document.createElement('label');
		label.style.color = schema.get('color');
		label.style.fontFamily = schema.get('fontFamily');
		label.style.fontSize = '12px';
		label.innerHTML = name;
		label.setAttribute('for', inputId);
		return label;
	}
/*
	this.audio = function() {
		
	}

	this.video = function() {
		
	}

	this.list = function(arr) {
		let list = document.createElement('ul');
		list.style.color = schema.get('color');
		list.style.fontFamily = schema.get('fontFamily');
		for (let i = 0;i < arr.length;i++) {
			let elem = document.createElement('li');
			elem.innerHTML = arr[i];
			list.appendChild(elem);
		};
		return list;
	}

	this.table = function(lineArr) {
		let table = document.createElement('table');
		for (let i =0;i < lineArr.length;i++) {
			table.appendChild(lineArr[i]);	
		}
		return table;
	}

	this.tr = function(celArr) {
		let tr = document.createElement('tr');
		for (let i =0;i < celArr.length;i++) {
			tr.appendChild(celArr[i]);	
		}
		return tr;
	}

	this.th = function(elem) {
		let th = document.createElement('th');
		th.style.margin = '0';
		th.style.padding = '5px 10px';
		th.style.border = '1px solid ' + schema.get('color');
		th.appendChild(elem);
		return th;
	}

	this.td = function(elem) {
		let td = document.createElement('td');
		td.style.margin = '0';
		td.style.padding = '5px 10px';
		td.style.border = '1px solid ' + schema.get('color');
		td.appendChild(elem);
		return td;
	}
	
	this.submenu = function() {
		let subContainer = document.createElement('ul');
		subContainer.style.backgroundColor = schema.get('subMenuBg');
		subContainer.style.height = '3000px';
		subContainer.style.float = 'left';
		subContainer.style.marginRight = '20px';
		subContainer.style.color = schema.get('color');
		return subContainer;
	}
	
	this.sublist = function(text, action, src) {
		let list = document.createElement('li');
		list.classList.add('clearfix');
		let icon = this.img(text, src);
		let title = this.headline(text, 4, 'left');
		icon.style.width = '25px';
		icon.style.height = '25px';
		icon.style.marginRight = '10px';
		icon.style.display = 'inline';
		icon.style.float = 'left';
		title.style.display = 'inline';
		title.style.float = 'left';
		title.style.paddingTop = '4px';
		list.style.padding = '10px 15px';
		list.addEventListener('click', action);
		list.addEventListener('mouseover', mouseover);
		list.addEventListener('mouseout', mouseout);
		list.addEventListener('click', selectlist);
		list.appendChild(icon);
		list.appendChild(title);
		function mouseover() {
			list.style.opacity = '0.7';
			list.style.cursor = 'pointer';
		}
		function mouseout() {
			list.style.opacity = '1';
			list.style.cursor = 'auto';
		}
		function selectlist() {
			let allList = document.querySelectorAll('.selectList');
			for (let i = 0;i < allList.length;i++) {
				allList[i].classList.remove('selectList');
				allList[i].style.backgroundColor = schema.get('subMenuBg');
			}
			this.classList.add('selectList');
			this.style.backgroundColor = schema.get('backgroundColor');
		}
		return list;
	}

	this.select = function(arr, name, multiple) {
		let select = document.createElement('select');
		select.style.color = schema.get('color');
		select.style.fontFamily = schema.get('fontFamily');
		select.style.fontSize = '12px';
		select.style.backgroundColor = 'transparent';
		select.style.border = 'none';
		select.style.margin = '10px';
		select.style.margin = '5px';
		select.multiple = multiple;
		select.id = name;
		select.name = name;
		for (let i = 0;i < arr.length;i++) {
			let option = document.createElement('option');
			option.style.backgroundColor = schema.get('fieldBackgroundColor');
			option.value = arr[i][0];
			option.innerHTML = arr[i][1];
			select.appendChild(option);
		}
		return select;
	}

	this.textarea = function(inner, name) {
		let textarea = document.createElement('textarea');
		textarea.style.color = schema.get('color');
		textarea.style.fontFamily = schema.get('fontFamily');
		textarea.style.fontSize = '12px';
		textarea.style.backgroundColor = 'transparent';
		textarea.style.border = 'none';
		textarea.style.margin = '10px';
		textarea.style.padding = '5px';
		textarea.id = name;
		textarea.name = name;
		textarea.innerHTML = inner;
		return textarea;
	}
*/	
}