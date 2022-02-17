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


function KernelSettingsManager() {
	
	LibAppField.call(this);
	
	this.main = function() {
		let appId = 'KernelSettingsManager';
		if (this.checkApp(appId)) {
			return false;
		} else {
			this.create(appId, 1100, 500, 'Менеджер настроек', '/kernel/resources/media/settings.gif');
			let app = document.getElementById(appId);
			this.createContentField(app);
		}
	}
	
	this.createContentField = function(app) {
		let contentField = $.div();
		$.add(app, contentField);
		this.getAllUserSettings(app, contentField);
	}
	
	this.getAllUserSettings = function(app, contentField) {
		contentField.innerHTML = '';
		let ajax = new LibAjax();
		let url = '/desktop/action/?controller=settings&action=getAllUserSettings';
		let body = new FormData();
		let push = ajax.create('POST', body, url, showAlluserSettings);
		
		function showAlluserSettings() {
			if (!push.response) {
				let msg = new AppCollector();
				let msgtext = 'К сожалению Вашей группе недоступны какие либо настройки';
				msg.start('KernelSystemMeesage', msgtext);
				$.remove(app.parentElement, app);
			} else {
				let flexboxContainer = $.flexbox('space-around', 'flex-end');
				$.add(contentField, flexboxContainer);
				let obj = ajax.json(push.response);
				for (let i = 0;i < obj.length;i++) {
					let contentItem = $.flexelem(200, 1, 1);
					contentItem.addEventListener('mouseover', mouseover);
					contentItem.addEventListener('mouseout', mouseout);
					contentItem.setAttribute('settingsName', obj[i]['name']);
					contentItem.style.textAlign = 'center';
					contentItem.addEventListener('click', showThisSettings);
					
					let icon = $.img(obj[i]['name'], obj[i]['icon']);
					let header = $.headline(obj[i]['name'], 3, 'center');
					let description = $.paragraf(obj[i]['description'], 'center');
					$.add(contentItem, icon);
					$.add(contentItem, header);
					$.add(contentItem, description);
					$.add(flexboxContainer, contentItem);
				}
			}
		}
		
		function showThisSettings() {
			let thisAppObj = new KernelSettingsManager();
			let settingsName = this.getAttribute('settingsName');
			switch (settingsName) {
				case 'Экран':
					thisAppObj.desktopSettings(contentField);
					break;
				case 'Персонализация':
					thisAppObj.personalSettings(contentField);
					break;
				case 'Пользователи':
					thisAppObj.usersSettings(contentField);
					break;
				case 'Группы':
					thisAppObj.accessGroupSettings(contentField);
					break;
				case 'Разработка':
					thisAppObj.developmentSettings(contentField);
					break;
				case 'Ресурсы':
					thisAppObj.filesAndDirsSettings(contentField);
					break;
				case 'Приложения':
					thisAppObj.applicationSettings(contentField);
					break;
				default:
					thisAppObj.notFoundThisSettings(contentField);
					break;
			}
		}
						
		function mouseover() {
			this.style.cursor = 'pointer';
			this.style.opacity = '0.7';
		}
		
		function mouseout() {
			this.style.cursor = 'auto';
			this.style.opacity = '1';
		}
	}
	
	this.desktopSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let desktopScheme = $.sublist('Цветовая схема', schemeSettings, '/kernel/resources/media/folder.png');
		$.add(navigator, desktopScheme);
		let desktopBackground = $.sublist('Фоновое изображение', backgroundSettings, '/kernel/resources/media/folder.png');
		$.add(navigator, desktopBackground);
		let mainNavSettings = $.sublist('Настройка цветов', setColorSettings, '/kernel/resources/media/folder.png');
		$.add(navigator, mainNavSettings);
		let subNavSettings = $.sublist('Настройка шрифтов', setFontsSettings, '/kernel/resources/media/folder.png');
		$.add(navigator, subNavSettings);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function schemeSettings() {
			navContent.innerHTML = '';
			let schemeName = $.headline('', 3, 'left');
			$.add(navContent, schemeName);
			
			let thisSchemeIcon = $.img('thisSchemeIcon', '');
			thisSchemeIcon.style.width = '350px';
			thisSchemeIcon.style.height = 'auto';
			$.add(navContent, thisSchemeIcon);
			
			let schemeNameAjax = new LibAjax();
			let schemeNameGet = '/desktop/action/?controller=settings&action=getThisUserSettings';
			let schemeNameBody = new FormData();
			schemeNameBody.append('what', 'desctopSheme');
			let schemeNamePush = schemeNameAjax.create('POST', schemeNameBody, schemeNameGet, getUserScheme);
			
			function getUserScheme() {
				let result = schemeNamePush.response;
				schemeName.innerHTML = result + '<br>';	
				
				let thisSchemeIconAjax = new LibAjax();
				let thisSchemeIconGet = '/desktop/action/?controller=settings&action=getSchemeSettings';
				let thisSchemeIconBody = new FormData();
				thisSchemeIconBody.append('schemeName', result);
				let sthisSchemeIconPush = thisSchemeIconAjax.create('POST', thisSchemeIconBody, thisSchemeIconGet, getUserSchemeIcon);
			
				function getUserSchemeIcon() {
					let obj = thisSchemeIconAjax.json(sthisSchemeIconPush.response);
					for (let i = 0;i < obj.length;i++) {
						if (obj[i]['name'] === 'desctopSchemeIcon') {
							thisSchemeIcon.src = obj[i]['value'];
							break;
						} else {
							continue;
						}
					}
					
					let selectorAjax = new LibAjax();
					let selectorGet = '/desktop/action/?controller=settings&action=getAllSchemes';
					let selectorBody = new FormData();
					let selectorPush = selectorAjax.create('POST', selectorBody, selectorGet, getAllSchemes);
			
					function getAllSchemes() {
						let selectorArr = [];
						let selectorObj = selectorAjax.json(selectorPush.response);
						for (let i = 0;i < selectorObj.length;i++) {
							selectorArr[i] = [selectorObj[i]['scheme'], selectorObj[i]['scheme']];
						}
						let schemeSelector = $.select(selectorArr, 'schemeSelector', '');
						schemeSelector.style.display = 'block';
						schemeSelector.style.width = '200px';
						schemeSelector.style.fontSize = '24px';
						for (let j = 0;j < schemeSelector.childNodes.length;j++) {
							if (schemeSelector.childNodes[j].value === map.get('desktopSchemeName')) {
								schemeSelector.childNodes[j].setAttribute('selected', 'selected');
								thisSchemeIcon.setAttribute('attributeSchemeName', schemeSelector.childNodes[j].value);
							} else {
								continue;
							}
						};
						schemeSelector.onchange = function() {
							let attributeSchemeName = this.value;
							let newIconAjax = new LibAjax();
							let newIconGet = '/desktop/action/?controller=settings&action=getSchemeSettings';
							let newIconBody = new FormData();
							newIconBody.append('schemeName', this.value);
							let newIconPush = newIconAjax.create('POST', newIconBody, newIconGet, getNewIcon);
							
							function getNewIcon() {
								let newIconObj = newIconAjax.json(newIconPush.response);
								for (let i = 0;i < newIconObj.length;i++) {
									if (newIconObj[i]['name'] === 'desctopSchemeIcon') {
										thisSchemeIcon.src = newIconObj[i]['value'];
										thisSchemeIcon.setAttribute('attributeSchemeName', attributeSchemeName);
										break;
									} else {
										continue;
									}
								}
							}
						}
						$.add(navContent, schemeSelector);
						
						let schemeBtn = $.btn('Установить схему', setScheme);
						function setScheme() {
							if (thisSchemeIcon.getAttribute('attributeSchemeName') === null) {
								return false;
							} else {
								let schemeSetterAjax = new LibAjax();
								let schemeSetterGet = '/desktop/action/?controller=settings&action=setUserScheme';
								let schemeSetterBody = new FormData();
								schemeSetterBody.append('schemeName', thisSchemeIcon.getAttribute('attributeSchemeName'));
								let schemeSetterPush = schemeSetterAjax.create('POST', schemeSetterBody, schemeSetterGet, schemeSetterResult);
								
								function schemeSetterResult() {
									let msg = schemeSetterPush.response;
									alert(msg);
								}
							}
						}
						$.add(navContent, schemeBtn);
					}
				}
			}
			
		}
		
		function backgroundSettings() {
			navContent.innerHTML = '';
			
			let selectBackgroundImg = $.headline('Выбрать фон<br>', 3, 'left');
			$.add(navContent, selectBackgroundImg);
			
			let backgroundImg = $.img('backgroundImg', map.get('backgroundImg'));
			backgroundImg.style.maxWidth = '300px';
			backgroundImg.style.maxHeight = '250px';
			backgroundImg.addEventListener('click', showBackgroundImgs);
			$.add(navContent, backgroundImg);
			
			let newBackgroundImg = $.btn('<br>Установить фон', setNewBackgroundImg);
			$.add(navContent, newBackgroundImg);
			
			let defaultBackgroundImg = $.btn('<br>Фон по умолчанию', setDefaultBackgroundImgs);
			$.add(navContent, defaultBackgroundImg);
			
			function showBackgroundImgs() {
				let galeryImgs = new AppCollector();
				galeryImgs.start('KernelImgsGalery', backgroundImg);
			}
			
			function setNewBackgroundImg() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setUserBackgroundImg';
				let body = new FormData();
				body.append('backgroundImg', map.get('backgroundImg'));
				let push = ajax.create('POST', body, url, setUserBackground);
				
				function setUserBackground() {
					let msg = push.response;
					alert(msg);
				}
			}
			
			function setDefaultBackgroundImgs() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setDefaultBackgroundImg';
				let body = new FormData();
				let push = ajax.create('POST', body, url, setDefault);
				
				function setDefault() {
					let msg = push.response;
					alert(msg);
				}
			}
		}
		
		function setColorSettings() {
			navContent.innerHTML = '';
			
			let form = $.form('formSetColorSettings')
			
			let navColor = $.input('color', 'navColorSettings', '');
			navColor.value = map.get('fieldBackgroundColor');
			let navLabel = $.label('Цвет основного меню', navColor.id);
			$.add(form, navLabel);
			$.add(navLabel, navColor);
			
			let contextNavColor = $.input('color', 'contextNavColor', '');
			contextNavColor.value = map.get('contextBg');
			let contextNavLabel = $.label('<br>Цвет контекстного меню', contextNavColor.id);
			$.add(form, contextNavLabel);
			$.add(contextNavLabel, contextNavColor);
			
			let appBgColor = $.input('color', 'appBgColor', '');
			appBgColor.value = map.get('backgroundColor');
			let appBgColorLabel = $.label('<br>Цвет основного фона приложений', appBgColor.id);
			$.add(form, appBgColorLabel);
			$.add(appBgColorLabel, appBgColor);
			
			let appSubBgColor = $.input('color', 'appSubBgColor', '');
			appSubBgColor.value = map.get('subMenuBg');
			let appSubBgColorLabel = $.label('<br>Цвет вспомогательного фона приложений', appSubBgColor.id);
			$.add(form, appSubBgColorLabel);
			$.add(appSubBgColorLabel, appSubBgColor);
			
			$.add(navContent, form);
			
			let btnSet = $.btn('Установить цвета', setNewColors);
			let btnReSet = $.btn('<br>Сбросить настройки', reSetNewColors);
			$.add(navContent, btnSet);
			$.add(navContent, btnReSet);
			
			function setNewColors() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setColorSettings';
				let body = new FormData(document.forms.formSetColorSettings);
				let push = ajax.create('POST', body, url, newColorsSet);
				
				function newColorsSet() {
					let msg = push.response;
					alert(msg);
				}
			}
			
			function reSetNewColors() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setDefaultColorSettings';
				let body = new FormData();
				let push = ajax.create('POST', body, url, defaultColorsSet);
				
				function defaultColorsSet() {
					let msg = push.response;
					alert(msg);
				}
			}
			
		}
		
		function setFontsSettings() {
			navContent.innerHTML = '';
			
			let fontForm = $.form('formSetFontsSettings')
			
			let fontsArr = new LibFonts();
			let fontSelectcor = $.select(fontsArr, 'fontSelectcor', '');
			let fontSelectcorLabel = $.label('Шрифт рабочего стола', fontSelectcor.id);
			for (let j = 0;j < fontSelectcor.childNodes.length;j++) {
				if (fontSelectcor.childNodes[j].value === map.get('fontFamily')) {
					fontSelectcor.childNodes[j].setAttribute('selected', 'selected');
					break;
				} else {
					continue;
				}
			};
			$.add(fontForm, fontSelectcorLabel);
			$.add(fontSelectcorLabel, fontSelectcor);
			
			let fontColor = $.input('color', 'fontColor', '');
			fontColor.value = map.get('color');
			let fontColorLabel = $.label('<br>Цвет текста', fontColor.id);
			$.add(fontForm, fontColorLabel);
			$.add(fontColorLabel, fontColor);
			
			$.add(navContent, fontForm);
			
			let btnFontSet = $.btn('Установить шрифт', setNewFonts);
			let btnFontReSet = $.btn('<br>Сбросить настройки', reSetNewFonts);
			$.add(navContent, btnFontSet);
			$.add(navContent, btnFontReSet);
			
			function setNewFonts() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setUserFontsSettings';
				let body = new FormData(document.forms.formSetFontsSettings);
				let push = ajax.create('POST', body, url, newFontsSet);
				
				function newFontsSet() {
					let msg = push.response;
					alert(msg);
				}
			}
			
			function reSetNewFonts() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setDefaultUserFontsSettings';
				let body = new FormData();
				let push = ajax.create('POST', body, url, defaultFontsSet);
				
				function defaultFontsSet() {
					let msg = push.response;
					alert(msg);
				}
			}
		}

	}
	
	this.personalSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let passwordSettings = $.sublist('Пароль', passwordSetter, '/kernel/resources/media/folder.png');
		$.add(navigator, passwordSettings);
		let pinSettings = $.sublist('Пин код', pinCodSetter, '/kernel/resources/media/folder.png');
		$.add(navigator, pinSettings);
		let emailSettings = $.sublist('Сотовый телефон', phoneSetter, '/kernel/resources/media/folder.png');
		$.add(navigator, emailSettings);
		let phoneSettings = $.sublist('Электронная почта', emailSetter, '/kernel/resources/media/folder.png');
		$.add(navigator, phoneSettings);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function passwordSetter() {
			navContent.innerHTML = '';
			
			let personalForm = $.form('personalForm')
			$.add(navContent, personalForm);
			
			let password = $.input('password', 'password', '');
			let passwordLabel = $.label('Новый пароль', password.id);
			$.add(personalForm, passwordLabel);
			$.add(passwordLabel, password);
			
			let currentPassword = $.input('password', 'currentPassword', '');
			let currentPasswordLabel = $.label('<br>Старый пароль', currentPassword.id);
			$.add(personalForm, currentPasswordLabel);
			$.add(currentPasswordLabel, currentPassword);
			
			let resetpassword = $.btn('<br>Изменить пароль', setNewPassword);
			$.add(navContent, resetpassword);
			
			function setNewPassword() {
				let strToValid = password.value;
				let valid = strToValid.match(/[A-Za-z0-9]{6,}/);
				if (valid === null) {
					alert('Пароль должен быть длиной не менее 6 символов и содержать цифры и буквы латинского алфавита');
				} else {
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=user&action=setPassword';
					let body = new FormData(document.forms.personalForm);
					let push = ajax.create('POST', body, url, returnMsg);
					
					function returnMsg() {
						let msg = push.response;
						if (msg) {
							alert(msg);
							document.location.href = '/desktop/logoff/';
						} else {
							alert('При изменении пароля возникла ошибка.');
						}
					}
				}
			}
		}
		
		function pinCodSetter() {
			navContent.innerHTML = '';
			
			let personalForm = $.form('personalForm')
			$.add(navContent, personalForm);
			
			let pincod = $.input('number', 'pincod', '');
			let pincodLabel = $.label('Новый пин-код', pincod.id);
			$.add(personalForm, pincodLabel);
			$.add(pincodLabel, pincod);
			
			let currentPassword = $.input('password', 'currentPassword', '');
			let currentPasswordLabel = $.label('<br>Ваш пароль', currentPassword.id);
			$.add(personalForm, currentPasswordLabel);
			$.add(currentPasswordLabel, currentPassword);
			
			let resetpin = $.btn('<br>Изменить пин', setNewPin);
			$.add(navContent, resetpin);
			
			function setNewPin() {
				let strToValid = pincod.value;
				let valid = strToValid.match(/^\d\d\d\d\d$/);
				if (valid === null) {
					alert('Пинкод должен быть длиной 5 цифр');
				} else {
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=user&action=setPin';
					let body = new FormData(document.forms.personalForm);
					let push = ajax.create('POST', body, url, returnMsg);
					
					function returnMsg() {
						let msg = push.response;
						if (msg) {
							alert(msg);
						} else {
							alert('При изменении пинкода возникла ошибка.');
						}
					}
				}	
			}
		}
		
		function emailSetter() {
			navContent.innerHTML = '';
			
			let personalForm = $.form('personalForm')
			$.add(navContent, personalForm);
			
			let email = $.input('email', 'email', '');
			let emailLabel = $.label('<br>Ваша почта', email.id);
			$.add(personalForm, emailLabel);
			$.add(emailLabel, email);
			
			let hidden = $.input('hidden', 'fieldName', '');
			hidden.value = 'email';
			$.add(personalForm, hidden);
			let what = $.input('hidden', 'what', '');
			what.value = 'userEmail';
			$.add(personalForm, what);
			
			let setEmail = $.btn('<br>Установить почту', newEmailSet);
			$.add(navContent, setEmail);
			
			function newEmailSet() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setUserSettings';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let msg = push.response;
					alert(msg);
				}
			}
			
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=settings&action=getThisUserSettings';
			let body = new FormData();
			body.append('what', 'userEmail');
			let push = ajax.create('POST', body, url, whatIsIt);
			
			function whatIsIt() {
				let msg = push.response;
				email.value = msg;
			}
		}
		
		function phoneSetter() {
			navContent.innerHTML = '';
			
			let personalForm = $.form('personalForm')
			$.add(navContent, personalForm);
			
			let phone = $.input('number', 'phone', '');
			let phoneLabel = $.label('<br>Ваш телефон', phone.id);
			$.add(personalForm, phoneLabel);
			$.add(phoneLabel, phone);
			
			let hidden = $.input('hidden', 'fieldName', '');
			hidden.value = 'phone';
			$.add(personalForm, hidden);
			let what = $.input('hidden', 'what', '');
			what.value = 'userPhone';
			$.add(personalForm, what);
			
			let setPhone = $.btn('<br>Установить телефон', newPhoneSet);
			$.add(navContent, setPhone);
			
			function newPhoneSet() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=settings&action=setUserSettings';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let msg = push.response;
					alert(msg);
				}
			}
			
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=settings&action=getThisUserSettings';
			let body = new FormData();
			body.append('what', 'userPhone');
			let push = ajax.create('POST', body, url, whatIsIt);
			
			function whatIsIt() {
				let msg = push.response;
				phone.value = msg;
			}
		}
	}
	
	this.usersSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let allUsers = $.sublist('Все пользователи', showAllUsers, '/kernel/resources/media/folder.png');
		$.add(navigator, allUsers);
		let newUser = $.sublist('Создание', createUser, '/kernel/resources/media/folder.png');
		$.add(navigator, newUser);
		let changeUserSettings = $.sublist('Группы', setUserGroups, '/kernel/resources/media/folder.png');
		$.add(navigator, changeUserSettings);
		let changeUserDirs = $.sublist('Ресурсы', setUserDirs, '/kernel/resources/media/folder.png');
		$.add(navigator, changeUserDirs);
		let changeUserApp = $.sublist('Приложения', setUserApp, '/kernel/resources/media/folder.png');
		$.add(navigator, changeUserApp);
		let changeUserSet = $.sublist('Настройки', setUserSet, '/kernel/resources/media/folder.png');
		$.add(navigator, changeUserSet);
		let banUser = $.sublist('Ограничения', bannedUser, '/kernel/resources/media/folder.png');
		$.add(navigator, banUser);
		let delUser = $.sublist('Удаление', userDelete, '/kernel/resources/media/folder.png');
		$.add(navigator, delUser);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function createUser() {
			navContent.innerHTML = '';
			
			let personalForm = $.form('personalForm')
			$.add(navContent, personalForm);
			
			let login = $.input('text', 'login', '');
			login.value = 'testUser';
			login.addEventListener('keyup', loginControl);
			let loginLabel = $.label('<br>Логин: ', login.id);
			$.add(personalForm, loginLabel);
			$.add(loginLabel, login);
			
			let addNewUser = $.btn('<br>добавить пользователя', createNewUser);
			$.add(navContent, addNewUser);
			
			function createNewUser() {
				let strToValid = login.value;
				let valid = strToValid.match(/[A-Za-z0-9]{6,}/);
				if (valid === null) {
					alert('Логин должен быть длиной не менее 6 символов и содержать цифры и буквы латинского алфавита');
				} else {
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=user&action=createUser';
					let body = new FormData(document.forms.personalForm);
					let push = ajax.create('POST', body, url, returnMsg);
					
					function returnMsg() {
						let msg = push.response;
						alert(msg);
					}
				}	
			}
			
			function loginControl() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=userLoginControl';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let msg = push.response;
					if (msg) {
						login.style.backgroundColor = 'red';
					} else {
						login.style.backgroundColor = 'transparent';
						return false;
					}
				}
			}
			
		}
		
		function setUserGroups() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructGroupSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userGroupsContainerTitle = $.flexbox('space-around', 'center');
			userGroupsContainerTitle.style.marginBottom = '20px';
			$.add(navContent, userGroupsContainerTitle);
			let userGropusTitle = $.flexelem(200, 1, 1);
			userGropusTitle.innerHTML = '<b>Пользовательские группы</b>';
			$.add(userGroupsContainerTitle, userGropusTitle);
			let selectBtnTitle = $.flexelem(200, 1, 1);
			selectBtnTitle.innerHTML = ' ';
			$.add(userGroupsContainerTitle, selectBtnTitle);
			let anotherGroupsTitle = $.flexelem(200, 1, 1);
			anotherGroupsTitle.innerHTML = '<b>Доступные группы</b>';
			$.add(userGroupsContainerTitle, anotherGroupsTitle);
			
			let userGroupsContainer = $.flexbox('space-around', 'center');
			$.add(navContent, userGroupsContainer);
			let userGroups = $.flexelem(200, 1, 1);
			$.add(userGroupsContainer, userGroups);
			let selectBtn = $.flexelem(200, 1, 1);
			$.add(userGroupsContainer, selectBtn);
			let anotherGroups = $.flexelem(200, 1, 1);
			$.add(userGroupsContainer, anotherGroups);
			
			function constructGroupSetter() {
				showUserGroup();
				showNoUserGroup();
				selectBtn.innerHTML = '';
				let addUserGroup = $.btn('Добавить', addGroup);
				$.add(selectBtn, addUserGroup);
				let delUserGroup = $.btn('Убрать', delGroup);
				$.add(selectBtn, delUserGroup);
			}
			
			function showUserGroup() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getUserGroups';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnGroups);
				
				function returnGroups() {
					let result = ajax.json(push.response);
					userGroups.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let list = $.paragraf(result[i]['name'], 'center');
						list.title = result[i]['description'];
						list.setAttribute('groupId', result[i]['id']);
						list.setAttribute('checked', 0);
						list.addEventListener('click', check);
						list.addEventListener('mouseover', mouseover);
						list.addEventListener('mouseout', mouseout);
						$.add(userGroups, list);
					}
				}
			}
			
			function showNoUserGroup() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getNoUserGroups';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnGroups);
				
				function returnGroups() {
					let result = ajax.json(push.response);
					anotherGroups.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let list = $.paragraf(result[i]['name'], 'center');
						list.title = result[i]['description'];
						list.setAttribute('groupId', result[i]['id']);
						list.setAttribute('checked', 0);
						list.addEventListener('click', check);
						list.addEventListener('mouseover', mouseover);
						list.addEventListener('mouseout', mouseout);
						$.add(anotherGroups, list);
					}
				}
			}
			
			function check() {
				let isCheck = this.getAttribute('checked');
				if (isCheck != 0) {
					this.style.backgroundColor = 'transparent';
					this.setAttribute('checked', 0);
				} else {
					this.style.backgroundColor = map.get('fieldBackgroundColor');
					this.setAttribute('checked', 1);
				}
			}
	
			function addGroup() {
				let userNoGroupCollection = anotherGroups.childNodes;
				let varArr = [];
				let str = '';
				for (let i = 0;i < userNoGroupCollection.length;i++) {
					let checkControl = userNoGroupCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userNoGroupCollection[i].style.backgroundColor = 'transparent';
						userNoGroupCollection[i].setAttribute('checked', 0);
						varArr.push(userNoGroupCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						let gid = varArr[k].getAttribute('groupId');
						str = str + '/' + gid;
						$.rePos(anotherGroups, userGroups, varArr[k]);
					}
					addGroupAjax(str);
				} else {
					return false;
				}
			}
			
			function delGroup() {
				let userGroupCollection = userGroups.childNodes;
				let varArr = [];
				let str = '';
				for (let i = 0;i < userGroupCollection.length;i++) {
					let checkControl = userGroupCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userGroupCollection[i].style.backgroundColor = 'transparent';
						userGroupCollection[i].setAttribute('checked', 0);
						varArr.push(userGroupCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						let gid = varArr[k].getAttribute('groupId');
						str = str + '/' + gid;
						$.rePos(userGroups, anotherGroups, varArr[k]);
					}
					delGroupAjax(str);
				} else {
					return false;
				}
			}
			
			function addGroupAjax(str) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=addUserGroup';
				let body = new FormData(document.forms.personalForm);
				body.append('newGroupStr', str);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let result = push.response;
					alert(result);
				}
			}
			
			function delGroupAjax(str) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=delUserGroup';
				let body = new FormData(document.forms.personalForm);
				body.append('newGroupStr', str);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let result = push.response;
					alert(result);
				}
			}

			function mouseover() {
				this.style.opacity = '0.5';
				this.style.cursor = 'pointer';
				this.style.transition = '0.5s';
			}
			
			function mouseout() {
				this.style.opacity = '1';
				this.style.cursor = 'pointer';
				this.style.transition = 'none';
			}
			
		}
		
		function setUserDirs() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructDirsSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userDirsContainerTitle = $.flexbox('space-around', 'center');
			userDirsContainerTitle.style.marginBottom = '20px';
			$.add(navContent, userDirsContainerTitle);
			let userDirsTitle = $.flexelem(200, 1, 1);
			userDirsTitle.innerHTML = '<b>Пользовательские ресурсы</b>';
			$.add(userDirsContainerTitle, userDirsTitle);
			let selectBtnTitle = $.flexelem(200, 1, 1);
			selectBtnTitle.innerHTML = ' ';
			$.add(userDirsContainerTitle, selectBtnTitle);
			let anotherDirsTitle = $.flexelem(200, 1, 1);
			anotherDirsTitle.innerHTML = '<b>Доступные ресурсы</b>';
			$.add(userDirsContainerTitle, anotherDirsTitle);
			
			let userDirsContainer = $.flexbox('space-around', 'center');
			$.add(navContent, userDirsContainer);
			let userDirs = $.flexelem(200, 1, 1);
			$.add(userDirsContainer, userDirs);
			let selectBtn = $.flexelem(200, 1, 1);
			$.add(userDirsContainer, selectBtn);
			let anotherDirs = $.flexelem(200, 1, 1);
			$.add(userDirsContainer, anotherDirs);
			
			function constructDirsSetter() {
				selectBtn.innerHTML = '';
				let addUserDir = $.btn('Добавить', addDir);
				$.add(selectBtn, addUserDir);
				let delUserDir = $.btn('Убрать', delDir);
				$.add(selectBtn, delUserDir);
				getThisUserDirs();
				getAnotherDirs();
			}
			
			function getThisUserDirs() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getUserDirs';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnGroups);
				
				function returnGroups() {
					let result = ajax.json(push.response);
					userDirs.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let src = result[i]["src"];
						let access = result[i]["access"];
						let dirContainer = $.div();
						dirContainer.setAttribute('dirChecked', 0);
						dirContainer.addEventListener('click', checkDir);
						dirContainer.addEventListener('mouseover', mouseover);
						dirContainer.addEventListener('mouseout', mouseout);
						dirContainer.style.borderBottom = '1px solid ' + map.get('color');
						let dirAccessContainer = $.div();
						dirAccessContainer.style.display = 'block';
						let name = $.paragraf(src, 'left');
						let read = $.input('checkbox', 'read' + i,'');
						read.setAttribute('dir', src);
						let rLabel = $.label('read', read.id);
						let write = $.input('checkbox', 'write' + i,'');
						write.setAttribute('dir', src);
						let wLabel = $.label('write', write.id);
						let exec = $.input('checkbox', 'exec' + i,'');
						exec.setAttribute('dir', src);
						let eLabel = $.label('exec', exec.id);
						$.add(dirContainer, name);
						$.add(dirContainer, dirAccessContainer);
						$.add(dirAccessContainer, rLabel);
						$.add(dirAccessContainer, wLabel);
						$.add(dirAccessContainer, eLabel);
						$.add(rLabel, read);
						$.add(wLabel, write);
						$.add(eLabel, exec);
						$.add(userDirs, dirContainer);
						read.addEventListener('change', accessUpdate);
						write.addEventListener('change', accessUpdate);
						exec.addEventListener('change', accessUpdate);
						rLabel.addEventListener('click', stopProp);
						wLabel.addEventListener('click', stopProp);
						eLabel.addEventListener('click', stopProp);
						switch (access) {
							case 'r--':
								read.checked = true;
								break;
							case 'rw-':
								read.checked = true;
								write.checked = true;
								break;
							case 'rwx':
								read.checked = true;
								write.checked = true;
								exec.checked = true;
								break;
							default:
								break;
						}
					}
				}
			}
			
			function getAnotherDirs() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getNoUserDirs';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnGroups);
				
				function returnGroups() {
					let result = ajax.json(push.response);
					anotherDirs.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let src = result[i];
						let dirContainer = $.div();
						dirContainer.setAttribute('dirChecked', 0);
						dirContainer.addEventListener('click', checkDir);
						dirContainer.addEventListener('mouseover', mouseover);
						dirContainer.addEventListener('mouseout', mouseout);
						dirContainer.style.borderBottom = '1px solid ' + map.get('color');
						let dirAccessContainer = $.div();
						dirAccessContainer.style.display = 'none';
						let name = $.paragraf(src, 'left');
						let read = $.input('checkbox', 'readA' + i,'');
						read.setAttribute('dir', src);
						read.checked = true;
						let rLabel = $.label('read', read.id);
						let write = $.input('checkbox', 'writeA' + i,'');
						write.setAttribute('dir', src);
						let wLabel = $.label('write', write.id);
						let exec = $.input('checkbox', 'execA' + i,'');
						exec.setAttribute('dir', src);
						let eLabel = $.label('exec', exec.id);
						$.add(dirContainer, name);
						$.add(dirContainer, dirAccessContainer);
						$.add(dirAccessContainer, rLabel);
						$.add(dirAccessContainer, wLabel);
						$.add(dirAccessContainer, eLabel);
						$.add(rLabel, read);
						$.add(wLabel, write);
						$.add(eLabel, exec);
						$.add(anotherDirs, dirContainer);
						read.addEventListener('change', accessUpdate);
						write.addEventListener('change', accessUpdate);
						exec.addEventListener('change', accessUpdate);
						rLabel.addEventListener('click', stopProp);
						wLabel.addEventListener('click', stopProp);
						eLabel.addEventListener('click', stopProp);
					}
				}
			}
			
			function accessUpdate() {
				event.stopPropagation();
				let dirUpdate = this.getAttribute('dir');
				let parent = this.parentElement.parentElement;
				let readCh = parent.childNodes[0].lastChild.checked;
				let writeCh = parent.childNodes[1].lastChild.checked; 
				let execCh = parent.childNodes[2].lastChild.checked;
				updateDirAjax(dirUpdate, readCh, writeCh, execCh);
			}
			
			function checkDir() {
				let isCheck = this.getAttribute('dirChecked');
				if (isCheck != 0) {
					this.style.backgroundColor = 'transparent';
					this.setAttribute('dirChecked', 0);
				} else {
					this.style.backgroundColor = map.get('fieldBackgroundColor');
					this.setAttribute('dirChecked', 1);
				}
			}
			
			function addDir() {
				let userNoDirCollection = anotherDirs.childNodes;
				let varArr = [];
				for (let i = 0;i < userNoDirCollection.length;i++) {
					let checkControl = userNoDirCollection[i].getAttribute('dirChecked');
					if (checkControl != 0) {
						userNoDirCollection[i].style.backgroundColor = 'transparent';
						userNoDirCollection[i].setAttribute('dirChecked', 0);
						varArr.push(userNoDirCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(anotherDirs, userDirs, varArr[k]);
						varArr[k].lastChild.style.display = 'block';
						let thisDir = varArr[k].firstChild.innerHTML;
						addDirAjax(thisDir);
					}
				} else {
					return false;
				}
			}
			
			function delDir() {
				let userDirCollection = userDirs.childNodes;
				let varArr = [];
				for (let i = 0;i < userDirCollection.length;i++) {
					let checkControl = userDirCollection[i].getAttribute('dirChecked');
					if (checkControl != 0) {
						userDirCollection[i].style.backgroundColor = 'transparent';
						userDirCollection[i].setAttribute('dirChecked', 0);
						varArr.push(userDirCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(userDirs, anotherDirs, varArr[k]);
						varArr[k].lastChild.style.display = 'none';
						for (let j = 0;j < varArr[k].lastChild.childNodes.length;j++) {
							varArr[k].lastChild.childNodes[j].lastChild.checked = false;
						}
						let thisDir = varArr[k].firstChild.innerHTML;
						delDirAjax(thisDir);
					}
				} else {
					return false;
				}
			}
			
			function addDirAjax(dir) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=addUserDir';
				let body = new FormData(document.forms.personalForm);
				body.append('dir', dir);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}
			
			function delDirAjax(dir) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=delUserDir';
				let body = new FormData(document.forms.personalForm);
				body.append('dir', dir);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}
			
			function updateDirAjax(dir, read, write, exec) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=updateUserDir';
				let body = new FormData(document.forms.personalForm);
				body.append('dir', dir);
				body.append('read', read);
				body.append('write', write);
				body.append('exec', exec);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}

			function mouseover() {
				this.style.opacity = '0.5';
				this.style.cursor = 'pointer';
				this.style.transition = '0.5s';
			}
			
			function mouseout() {
				this.style.opacity = '1';
				this.style.cursor = 'pointer';
				this.style.transition = 'none';
			}
			
			function stopProp() {
				event.stopPropagation();
			}
		}
		
		function setUserApp() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userAppContainerTitle = $.flexbox('space-around', 'center');
			userAppContainerTitle.style.marginBottom = '20px';
			$.add(navContent, userAppContainerTitle);
			let userAppTitle = $.flexelem(200, 1, 1);
			userAppTitle.innerHTML = '<b>Пользовательские приложения</b>';
			$.add(userAppContainerTitle, userAppTitle);
			let selectBtnTitle = $.flexelem(200, 1, 1);
			selectBtnTitle.innerHTML = ' ';
			$.add(userAppContainerTitle, selectBtnTitle);
			let anotherAppTitle = $.flexelem(200, 1, 1);
			anotherAppTitle.innerHTML = '<b>Доступные приложения</b>';
			$.add(userAppContainerTitle, anotherAppTitle);
			
			let userAppContainer = $.flexbox('space-around', 'center');
			$.add(navContent, userAppContainer);
			let userApp = $.flexelem(200, 1, 1);
			$.add(userAppContainer, userApp);
			let selectBtn = $.flexelem(200, 1, 1);
			$.add(userAppContainer, selectBtn);
			let anotherApp = $.flexelem(200, 1, 1);
			$.add(userAppContainer, anotherApp);
			
			function constructAppSetter() {
				selectBtn.innerHTML = '';
				let addUserApp = $.btn('Добавить', addApp);
				$.add(selectBtn, addUserApp);
				let delUserApp = $.btn('Убрать', delApp);
				$.add(selectBtn, delUserApp);
				getUserApp();
				getAnotherApp();
			}
			
			function getUserApp() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getUserApp';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, showUserApp);
				
				function showUserApp() {
					let result = ajax.json(push.response);
					userApp.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let appName = $.paragraf(result[i]['name'], 'center');
						appName.addEventListener('click', checkApp);
						appName.addEventListener('mouseover', mouseover);
						appName.addEventListener('mouseout', mouseout);
						appName.setAttribute('checked', 0);
						appName.setAttribute('lid', result[i]['id']);
						$.add(userApp, appName);
					}
				}
			}
			
			function getAnotherApp() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getAnotherApp';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, showAnotherApp);
				
				function showAnotherApp() {
					let result = ajax.json(push.response);
					anotherApp.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let appName = $.paragraf(result[i]["name"], 'center');
						appName.addEventListener('click', checkApp);
						appName.addEventListener('mouseover', mouseover);
						appName.addEventListener('mouseout', mouseout);
						appName.setAttribute('checked', 0);
						appName.setAttribute('lid', result[i]['id']);
						$.add(anotherApp, appName);
					}
				}
			}
			
			function checkApp() {
				let isCheck = this.getAttribute('checked');
				if (isCheck != 0) {
					this.style.backgroundColor = 'transparent';
					this.setAttribute('checked', 0);
				} else {
					this.style.backgroundColor = map.get('fieldBackgroundColor');
					this.setAttribute('checked', 1);
				}
			}
			
			function addApp() {
				let userNoAppCollection = anotherApp.childNodes;
				let varArr = [];
				for (let i = 0;i < userNoAppCollection.length;i++) {
					let checkControl = userNoAppCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userNoAppCollection[i].style.backgroundColor = 'transparent';
						userNoAppCollection[i].setAttribute('checked', 0);
						varArr.push(userNoAppCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(anotherApp, userApp, varArr[k]);
						let lid = varArr[k].getAttribute('lid');
						addAppAjax(lid);
					}
				} else {
					return false;
				}
			}
			
			function delApp() {
				let userAppCollection = userApp.childNodes;
				let varArr = [];
				for (let i = 0;i < userAppCollection.length;i++) {
					let checkControl = userAppCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userAppCollection[i].style.backgroundColor = 'transparent';
						userAppCollection[i].setAttribute('checked', 0);
						varArr.push(userAppCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(userApp, anotherApp, varArr[k]);
						let lid = varArr[k].getAttribute('lid');
						delAppAjax(lid);
					}
				} else {
					return false;
				}
			}
			
			function addAppAjax(lid) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=addUserApp';
				let body = new FormData(document.forms.personalForm);
				body.append('lid', lid);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}
			
			function delAppAjax(lid) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=delUserApp';
				let body = new FormData(document.forms.personalForm);
				body.append('lid', lid);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}

			function mouseover() {
				this.style.opacity = '0.5';
				this.style.cursor = 'pointer';
				this.style.transition = '0.5s';
			}
			
			function mouseout() {
				this.style.opacity = '1';
				this.style.cursor = 'pointer';
				this.style.transition = 'none';
			}
			
			function stopProp() {
				event.stopPropagation();
			}
		}
		
		function setUserSet() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructSetSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userSetContainerTitle = $.flexbox('space-around', 'center');
			userSetContainerTitle.style.marginBottom = '20px';
			$.add(navContent, userSetContainerTitle);
			let userSetTitle = $.flexelem(200, 1, 1);
			userSetTitle.innerHTML = '<b>Пользовательские настройки</b>';
			$.add(userSetContainerTitle, userSetTitle);
			let selectBtnTitle = $.flexelem(200, 1, 1);
			selectBtnTitle.innerHTML = ' ';
			$.add(userSetContainerTitle, selectBtnTitle);
			let anotherSetTitle = $.flexelem(200, 1, 1);
			anotherSetTitle.innerHTML = '<b>Доступные настройки</b>';
			$.add(userSetContainerTitle, anotherSetTitle);
			
			let userSetContainer = $.flexbox('space-around', 'center');
			$.add(navContent, userSetContainer);
			let userSet = $.flexelem(200, 1, 1);
			$.add(userSetContainer, userSet);
			let selectBtn = $.flexelem(200, 1, 1);
			$.add(userSetContainer, selectBtn);
			let anotherSet = $.flexelem(200, 1, 1);
			$.add(userSetContainer, anotherSet);
			
			function constructSetSetter() {
				selectBtn.innerHTML = '';
				let addUserApp = $.btn('Добавить', addSet);
				$.add(selectBtn, addUserApp);
				let delUserApp = $.btn('Убрать', delSet);
				$.add(selectBtn, delUserApp);
				getUserSet();
				getAnotherSet();
			}
			
			function getUserSet() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getUserSet';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, showUserSet);
				
				function showUserSet() {
					let result = ajax.json(push.response);
					userSet.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let setName = $.paragraf(result[i]['name'], 'center');
						setName.addEventListener('click', checkSet);
						setName.addEventListener('mouseover', mouseover);
						setName.addEventListener('mouseout', mouseout);
						setName.setAttribute('checked', 0);
						setName.setAttribute('sid', result[i]['id']);
						$.add(userSet, setName);
					}
				}
			}
			
			function getAnotherSet() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getAnotherSet';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, showUserSet);
				
				function showUserSet() {
					let result = ajax.json(push.response);
					anotherSet.innerHTML = '';
					for (let i = 0;i < result.length;i++) {
						let setName = $.paragraf(result[i]['name'], 'center');
						setName.addEventListener('click', checkSet);
						setName.addEventListener('mouseover', mouseover);
						setName.addEventListener('mouseout', mouseout);
						setName.setAttribute('checked', 0);
						setName.setAttribute('sid', result[i]['id']);
						$.add(anotherSet, setName);
					}
				}
			}
			
			function checkSet() {
				let isCheck = this.getAttribute('checked');
				if (isCheck != 0) {
					this.style.backgroundColor = 'transparent';
					this.setAttribute('checked', 0);
				} else {
					this.style.backgroundColor = map.get('fieldBackgroundColor');
					this.setAttribute('checked', 1);
				}
			}
			
			function addSet() {
				let userNoSetCollection = anotherSet.childNodes;
				let varArr = [];
				for (let i = 0;i < userNoSetCollection.length;i++) {
					let checkControl = userNoSetCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userNoSetCollection[i].style.backgroundColor = 'transparent';
						userNoSetCollection[i].setAttribute('checked', 0);
						varArr.push(userNoSetCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(anotherSet, userSet, varArr[k]);
						let sid = varArr[k].getAttribute('sid');
						addSetAjax(sid);
					}
				} else {
					return false;
				}
			}
			
			function delSet() {
				let userSetCollection = userSet.childNodes;
				let varArr = [];
				for (let i = 0;i < userSetCollection.length;i++) {
					let checkControl = userSetCollection[i].getAttribute('checked');
					if (checkControl != 0) {
						userSetCollection[i].style.backgroundColor = 'transparent';
						userSetCollection[i].setAttribute('checked', 0);
						varArr.push(userSetCollection[i]);
						continue;
					} else {
						continue;
					}
				}
				if (varArr.length > 0) {
					for (let k = 0;k < varArr.length;k++) {
						$.rePos(userSet, anotherSet, varArr[k]);
						let sid = varArr[k].getAttribute('sid');
						delSetAjax(sid);
					}
				} else {
					return false;
				}
			}
			
			function addSetAjax(sid) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=setUserSid';
				let body = new FormData(document.forms.personalForm);
				body.append('sid', sid);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}
			
			function delSetAjax(sid) {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=delUserSid';
				let body = new FormData(document.forms.personalForm);
				body.append('sid', sid);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}

			function mouseover() {
				this.style.opacity = '0.5';
				this.style.cursor = 'pointer';
				this.style.transition = '0.5s';
			}
			
			function mouseout() {
				this.style.opacity = '1';
				this.style.cursor = 'pointer';
				this.style.transition = 'none';
			}
			
			function stopProp() {
				event.stopPropagation();
			}
		}
		
		function bannedUser() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructBannedSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userInfo = $.div();
			$.add(navContent, userInfo);
			
			function constructBannedSetter() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getUserInfo';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, showUserInfo);
				
				function showUserInfo() {
					let result = ajax.json(push.response);
					userInfo.innerHTML = '';
					let login = $.headline(result['login'], 3, 'left');
					let isban = $.paragraf('banned to 24.05.2022 22-00', 'left');
					if (result['ban'] > 0) {
						let banDate = new Date(result['bantime'] * 1000);
						let day = banDate.getDate();
						let month = banDate.getMonth();
						let year = banDate.getFullYear();
						let h = banDate.getHours();
						let m = banDate.getMinutes() + 1;
						let banData = day + '.' + month + '.' + year + ' ' + h + ':' + m;
						isban.innerHTML = 'пользователь заблокирован до ' + banData + '. Причина: ' + result['bandesc'];
					} else {
						isban.innerHTML = 'Доступ открыт';
					}
					$.add(userInfo, login);
					$.add(userInfo, isban);
					let setBan = $.btn('Заблокировать ', setBanAjax);
					setBan.style.display = 'inline';
					let delBan = $.btn(' Разблокировать', delBanAjax);
					delBan.style.display = 'inline';
					$.add(userInfo, setBan);
					$.add(userInfo, delBan);
				}
			}
			
			function setBanAjax() {
				let reason = prompt('reason', 'Укажите причину блокировки');
				let time = prompt('set hours', '1');
				if (time === null || reason === null) {
					return false;
				} else {
					let bantime = new Date();
					let setBanTime = Math.round((+time*1000*60*60 + bantime.getTime())/1000);
					userInfo.innerHTML = '';
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=user&action=setThisUserBan';
					let body = new FormData(document.forms.personalForm);
					body.append('bandesc', reason);
					body.append('bantime', setBanTime);
					let push = ajax.create('POST', body, url, returnMsg);
					
					function returnMsg() {
						//let result = push.response;
						//alert(result);
					}
				}
			}
			
			function delBanAjax() {
				userInfo.innerHTML = '';
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=reSetThisUserBan';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					//let result = push.response;
					//alert(result);
				}
			}
		}
		
		function userDelete() {
			navContent.innerHTML = '';
			let personalForm = $.form('personalForm');
			personalForm.style.display = 'inline';
			$.add(navContent, personalForm);
			getAllUsers(personalForm);
			
			let selectUser = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectUser.style.fontSize = '12px';
			selectUser.style.display = 'inline';
			$.add(navContent, selectUser);
			
			let userDel = $.div();
			$.add(navContent, userDel);
			
			function constructAppSetter() {
				userDel.innerHTML = 'загружаю...';
				setTimeout(btnCreate, 500);
				
				function btnCreate() {
					userDel.innerHTML = '';
					let delUser = $.btn(' Удалить пользователя', delUserAjax);
					delUser.style.display = 'inline';
					$.add(userDel, delUser);
				}
			}
			
			function delUserAjax() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=delUser';
				let body = new FormData(document.forms.personalForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let result = push.response;
					alert(result);
				}
			}
		}
		
		function showAllUsers() {
			navContent.innerHTML = '';
			let container = $.flexbox('space-around', 'flex-start');
			$.add(navContent, container);
			getAllUsersInfo();
			
			function getAllUsersInfo() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=user&action=getAllUsersInfo';
				let body = new FormData();
				let push = ajax.create('POST', body, url, returnUsers);
			
				function returnUsers() {
					container.innerHTML = '';
					let result = ajax.json(push.response);
					for (let i = 0;i < result.length;i++) {
						let user = $.flexelem(200, 1, 1);
						user.style.maxWidth = '200px';
						user.style.margin = '5px';
						user.style.padding = '5px';
						user.style.border = '3px solid ' + map.get('fieldBackgroundColor');
						let userName = $.headline(result[i]['login'], 2, 'left');
						let userBan = $.paragraf('', 'left');
						if (result[i]['ban'] > 0) {
							let banDate = new Date(result[i]['bantime'] * 1000);
							let day = banDate.getDate();
							let month = banDate.getMonth();
							let year = banDate.getFullYear();
							let h = banDate.getHours();
							let m = banDate.getMinutes() + 1;
							let banData = day + '.' + month + '.' + year + ' ' + h + ':' + m;
							userBan.innerHTML = 'пользователь заблокирован до ' + banData + '. Причина: ' + result[i]['bandesc'];
						} else {
							userBan.innerHTML = 'Доступ открыт';
						}
						let userPhone = $.paragraf('<b><i>Позвонить</i></b>: <a href="tel:' + result[i]['userPhone'] + '">' + result[i]['userPhone'] + '</a>', 'left');
						let userEmail = $.paragraf('<b><i>Написать</i></b>: <a href="mailto:' + result[i]['userEmail'] + '">' + result[i]['userEmail'] + '</a>', 'left');
						$.add(container, user);
						$.add(user, userName);
						$.add(user, userBan);
						$.add(user, userPhone);
						$.add(user, userEmail);
					}
				}
			}
		}
		
		function getAllUsers(personalForm) {
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=user&action=getAllUsers';
			let body = new FormData();
			let push = ajax.create('POST', body, url, returnUsers);
			
			function returnUsers() {
				let result = ajax.json(push.response);
				let selectArr = [];
				for (let i = 0;i < result.length;i++) {
					let value = result[i]["id"];
					let html = result[i]["login"];
					let medArr = [value, html];
					selectArr[i] = medArr;
				}
				let userList = $.select(selectArr, 'userList', '');
				userList.style.fontWeight = 'bold';
				let userListLabel = $.label('Выберите пользователя: ', userList.id);
				$.add(userListLabel, userList);
				$.add(personalForm, userListLabel);
			}
		}
	}
	
	this.accessGroupSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let allGroups = $.sublist('Группы', showAllGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, allGroups);
		let newGroups = $.sublist('Создать', createGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, newGroups);
		let usersInGroups = $.sublist('Пользователи', userInGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, usersInGroups);
		let dirAccess = $.sublist('Ресурсы', dirInGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, dirAccess);
		let appAccess = $.sublist('Приложения', appInGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, appAccess);
		let settingsAccess = $.sublist('Настройки', settingsInGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, settingsAccess);
		let delGroups = $.sublist('Удалить', delAccessGroup, '/kernel/resources/media/folder.png');
		$.add(navigator, delGroups);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function showAllGroup() {
			navContent.innerHTML = 'showAllGroup';
		}
		
		function createGroup() {
			navContent.innerHTML = '';
			
			let groupForm = $.form('groupForm')
			$.add(navContent, groupForm);
			
			let group = $.input('text', 'group', '');
			group.value = 'MyGroup';
			group.addEventListener('keyup', groupControl);
			let groupLabel = $.label('<br>Название группы: ', group.id);
			$.add(groupForm, groupLabel);
			$.add(groupLabel, group);
			
			let groupDesc = $.input('text', 'groupDesc', '');
			groupDesc.value = 'Описание группы';
			let groupDescLabel = $.label('<br>Описание группы: ', groupDesc.id);
			$.add(groupForm, groupDescLabel);
			$.add(groupDescLabel, groupDesc);
			
			let addNewGroup = $.btn('<br>добавить группу', createNewGroup);
			$.add(navContent, addNewGroup);
			
			function createNewGroup() {
				let strToValid = group.value;
				let valid = strToValid.match(/[A-Za-z0-9]{6,}/);
				if (valid === null) {
					alert('Логин должен быть длиной не менее 6 символов и содержать цифры и буквы латинского алфавита');
				} else {
					let ajax = new LibAjax();
					let url = '/desktop/action/?controller=access&action=addAccessGroup';
					let body = new FormData(document.forms.groupForm);
					let push = ajax.create('POST', body, url, returnMsg);
					
					function returnMsg() {
						let msg = push.response;
						alert(msg);
					}
					
				}	
			}
			
			function groupControl() {
				let ajax = new LibAjax();
				let url = '/desktop/action/?controller=access&action=groupAccessControl';
				let body = new FormData(document.forms.groupForm);
				let push = ajax.create('POST', body, url, returnMsg);
				
				function returnMsg() {
					let msg = push.response;
					if (msg) {
						group.style.backgroundColor = 'red';
					} else {
						group.style.backgroundColor = 'transparent';
						return false;
					}
				}
			}
		}
		
		function userInGroup() {
			navContent.innerHTML = '';
			let groupForm = $.form('groupForm');
			groupForm.style.display = 'inline';
			$.add(navContent, groupForm);
			getAllAccessGroup(groupForm);
			
			let selectGroup = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectGroup.style.fontSize = '12px';
			selectGroup.style.display = 'inline';
			$.add(navContent, selectGroup);
			
			function constructAppSetter() {
				alert('hello');
			}
		}
		
		function dirInGroup() {
			navContent.innerHTML = '';
			let groupForm = $.form('groupForm');
			groupForm.style.display = 'inline';
			$.add(navContent, groupForm);
			getAllAccessGroup(groupForm);
			
			let selectGroup = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectGroup.style.fontSize = '12px';
			selectGroup.style.display = 'inline';
			$.add(navContent, selectGroup);
			
			function constructAppSetter() {
				alert('hello');
			}
		}
		
		function appInGroup() {
			navContent.innerHTML = '';
			let groupForm = $.form('groupForm');
			groupForm.style.display = 'inline';
			$.add(navContent, groupForm);
			getAllAccessGroup(groupForm);
			
			let selectGroup = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectGroup.style.fontSize = '12px';
			selectGroup.style.display = 'inline';
			$.add(navContent, selectGroup);
			
			function constructAppSetter() {
				alert('hello');
			}
		}
		
		function settingsInGroup() {
			navContent.innerHTML = '';
			let groupForm = $.form('groupForm');
			groupForm.style.display = 'inline';
			$.add(navContent, groupForm);
			getAllAccessGroup(groupForm);
			
			let selectGroup = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectGroup.style.fontSize = '12px';
			selectGroup.style.display = 'inline';
			$.add(navContent, selectGroup);
			
			function constructAppSetter() {
				alert('hello');
			}
		}
		
		function delAccessGroup() {
			navContent.innerHTML = '';
			let groupForm = $.form('groupForm');
			groupForm.style.display = 'inline';
			$.add(navContent, groupForm);
			getAllAccessGroup(groupForm);
			
			let selectGroup = $.btn('Загрузить данные<br><br><br>', constructAppSetter);
			selectGroup.style.fontSize = '12px';
			selectGroup.style.display = 'inline';
			$.add(navContent, selectGroup);
			
			function constructAppSetter() {
				alert('hello');
			}
		}
		
		function getAllAccessGroup(groupForm) {
			let ajax = new LibAjax();
			let url = '/desktop/action/?controller=access&action=getAllAccessGroup';
			let body = new FormData();
			let push = ajax.create('POST', body, url, returnUsers);
			
			function returnUsers() {
				let result = ajax.json(push.response);
				let selectArr = [];
				for (let i = 0;i < result.length;i++) {
					let value = result[i]["id"];
					let html = result[i]["name"];
					let medArr = [value, html];
					selectArr[i] = medArr;
				}
				let groupList = $.select(selectArr, 'groupList', '');
				groupList.style.fontWeight = 'bold';
				let groupListLabel = $.label('Выберите пользователя: ', groupList.id);
				$.add(groupListLabel, groupList);
				$.add(groupForm, groupListLabel);
			}
		}
	}
	
	this.developmentSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let regApp = $.sublist('Регистрация приложения', test, '/kernel/resources/media/folder.png');
		$.add(navigator, regApp);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function test() {
			navContent.innerHTML = 'dev';
		}
	}
	
	this.filesAndDirsSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let allRes = $.sublist('Доступные', test, '/kernel/resources/media/folder.png');
		$.add(navigator, allRes);
		let resCreate = $.sublist('Создать', test, '/kernel/resources/media/folder.png');
		$.add(navigator, resCreate);
		let resDelete = $.sublist('Удалить', test, '/kernel/resources/media/folder.png');
		$.add(navigator, resDelete);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function test() {
			navContent.innerHTML = 'files and Dirs';
		}
	}
	
	this.notFoundThisSettings = function(contentField) {
		alert('notFoundThisSettings');
	}
	/*
	this.applicationSettings = function(contentField) {
		let appId = 'KernelSettingsManager';
		let app = document.getElementById(appId);
		contentField.innerHTML = '';
		$.add(contentField, this.backSpace(app, contentField));
		
		let navigator = $.submenu();
		navigator.addEventListener('contextmenu', noNavContext);
		navigator.style.overflow = 'auto';
		let navContent = $.div();
		navContent.style.clear = 'right';
		navContent.style.overflow = 'auto';
		$.add(contentField, navigator);
		$.add(contentField, navContent);
		
		let allApp = $.sublist('Доступные приложения', test, '/kernel/resources/media/folder.png');
		$.add(navigator, allApp);
		
		this.mutationController(navigator, contentField);
		
		function noNavContext() {
			event.stopPropagation();
			event.preventDefault();
		}
		
		function test() {
			navContent.innerHTML = 'app';
		}
	}
	*/
	this.mutationController = function(navigator, contentField) {
	
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
		navigatorObserver.observe(contentField, navigatorConfig);
	}
	
	this.backSpace = function(app, contentField) {
		let backSpaceButton = $.headline('Назад', 3, 'left');
		backSpaceButton.style.padding = '10px';
		backSpaceButton.addEventListener('mouseover', mouseover);
		backSpaceButton.addEventListener('mouseout', mouseout);
		backSpaceButton.addEventListener('click', comeBack);
		
		function mouseover() {
			this.style.opacity = '0.5';
			this.style.cursor = 'pointer';
			this.style.transition = '0.5s';
		}
		
		function mouseout() {
			this.style.opacity = '1';
			this.style.cursor = 'pointer';
			this.style.transition = 'none';
		}
		
		function comeBack() {
			let comeBackFoo = new KernelSettingsManager();
			comeBackFoo.getAllUserSettings(app, contentField);
		}
		
		return backSpaceButton;
	}
}
