<?php
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
namespace timeterra;
use kernel\classes\KernelFunctions as Foo;
use kernel\classes\KernelRouter as Rout;

final class Loader {
	
	const TYPE_CONST = [
		
		"class",
		"controller",
		"model",
		"interface",
		"trait",
		"rout",
		"abstract",
		
	];
	
	static public function register() {
		spl_autoload_register(function($className) {
			$className = str_replace("\\","/", $className);
			for ($i =0;$i < count(Loader::TYPE_CONST); $i++) {
				if (file_exists($className.".".Loader::TYPE_CONST[$i].".php")) {
			    	include $className.".".Loader::TYPE_CONST[$i].".php";
				} else {
					continue;
				}
			}
		});		
	}
	
	static public function startTimeTerra() {
		$foo = new Foo();
		$foo->requireFiles("kernel/configuration/", "config");
		$foo->requireFiles("workspace/configuration/", "config");
		session_start();
		$foo->setConfigSessions(TT_SESSIONS, WS_SESSIONS);
		$foo->setConfigCookies(TT_COOKIES, WS_COOKIES);
		$startTimeTerra = new Rout();
	}
	
}
?>
