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


function LibFonts() {

	let fonts = {
		
		'times new roman': 'Times New Roman',
		'courier new': 'Courier new',
		'georgia': 'Georgia',
		'impact': 'Impact',
		'arial': 'Arial',
		'century gothic': 'Century Gothic',
		'tahoma': 'Tahoma',
		'palatino linotype': 'Palatino Linotype',
		'hanging letters': 'Hanging Letters',
		'cheshirskiy cat': 'Cheshirskiy Cat',
	}
	
	let arr = new Array();
	
	for (let key in fonts) {
		let smallArr = [key, fonts[key]];
		arr.push(smallArr);
	}
	
	return arr;
		
}