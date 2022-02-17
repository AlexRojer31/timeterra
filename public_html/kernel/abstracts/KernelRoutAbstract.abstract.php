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
namespace kernel\abstracts;
use kernel\abstracts\KernelMainAbstract;

use kernel\classes\KernelSession;
use kernel\classes\KernelCookie;

use kernel\controllers\KernelFilesSistemController as Files;

use kernel\models\KernelUsersModel as Users;

abstract class KernelRoutAbstract extends KernelMainAbstract {
	
    protected function s() {
    	return new KernelSession();
    }
	
    protected function c() {
    	return new KernelCookie();
    }
	
    protected function set($get = "") {
		$json = file_get_contents("php://input");
		$json = json_decode($json);
		$this->json = $json;
		$this->post = $_POST;
		$this->files = $_FILES;
		$this->get = $get;
    }
	
    protected function get($actionMethod = "", $action = "") {
		if ($actionMethod) {
			$action = $actionMethod;
			$this->$action();
		} else {
			if ($action == "") {
				$this->index();
			} else {
				header("location: ".TT_NOT_FOUND_METHOD."?method=$action");
			}
		}
    }
	
    protected function is($methods = "", $action = "") {
		$actionMethod = false;
		foreach($methods as $method) {
			if ($method == "__construct") {
				continue;
			} else {
				$methodStr = "tt".$method;
				if (stripos($methodStr, $action)) {
					$actionMethod = $method;
					break;
				} else {
					continue;
				}
			}
		}
		return $actionMethod;
    }
	
}

?>