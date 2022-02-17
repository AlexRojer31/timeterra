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


function LibDesktop() {
	
	this.main = function() {
		let desktop = document.querySelector('body');
		desktop.id = 'kernelDesktop';
		this.background(desktop);
		this.style(desktop);
		this.contextMenu();
	}
	
	this.background = function(desktop) {
		if (schema.get('backgroundImg') === '') {
			desktop.style.backgroundColor = schema.get('backgroundColor');
		} else {
			desktop.style.backgroundImage = 'url("' + schema.get('backgroundImg') + '")';
			desktop.style.backgroundRepeat = 'no-repeat';
			desktop.style.backgroundPosition = 'center center';
			desktop.style.backgroundAttachment = 'fixed';
			desktop.style.backgroundAttachment = '100%';
			desktop.style.backgroundSize = 'cover';
		}
	}
	
	this.style = function(desktop) {
		desktop.style.position = 'relative';
	}
	
	this.contextMenu = function() {
		document.addEventListener('contextmenu', context);
		document.addEventListener('click', closeContext);
		
		function context() {
			let context = new LibContextField();
			context.create();
			context.addEvent('Обновить', update, '/kernel/resources/media/tt_context_icons/logo.svg');
			context.addEvent('TimeTerra FAQ', timeTerra, '/kernel/resources/media/tt_context_icons/logo.svg');
			context.addEvent('Закрыть приложение', close, '/kernel/resources/media/tt_context_icons/logo.svg');
			context.addEvent('Выйти из приложения', closeAll, '/kernel/resources/media/tt_context_icons/logo.svg');
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
		
		function update() {
			document.location.href = "/desktop/";
		}
		
		function timeTerra() {
			window.open('http://ru.timeterra.com/');
		}
		
		function close() {
			document.location.href = '/desktop/logout/';
		}
		
		function closeAll() {
			document.location.href = '/desktop/logoff/';
		}
	}
	
}
