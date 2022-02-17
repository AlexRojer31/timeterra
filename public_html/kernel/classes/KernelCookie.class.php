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
namespace kernel\classes;
use kernel\abstracts\KernelSessionAbstract;
use kernel\interfaces\KernelSessionInterface;

class KernelCookie extends KernelSessionAbstract implements KernelSessionInterface {
	
	public function set($name = "", $value = "") {	
		if ($this->is($_COOKIE, $name)) {
			$_COOKIE[$name] = $value;
		} else {
			setcookie($name, $value, time()+TT_COOKIES_TIME, "/", TT_HOST_NAME, TT_COOKIES_SECURE, TT_COOKIES_HTTPONLY);
			usleep(100);
		}
		if ($this->get($name)) {
			return true;
		} else {
			return false;
		}
	}
	
	public function get($name = "") {	
		if ($this->is($_COOKIE, $name)) {
			$result = $_COOKIE[$name];
			return $result;
		} else {
			return false;
		}
	}
	
	public function del($name = "") {
		if ($this->is($_COOKIE, $name)) {
			unset($_COOKIE[$name]);
			setcookie($name, null, -1, "/", TT_HOST_NAME);
			usleep(100);
		}
		if ($this->get($name)) {
			return false;
		} else {
			return true;
		}
	}
	
}

?>