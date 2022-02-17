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
namespace kernel\controllers;
use kernel\abstracts\KernelControllerAbstract;
use kernel\interfaces\KernelControllerInterface;
use kernel\traits\KernelControllerTrait;

use kernel\controllers\KernelFileSistemController as FS;

use kernel\models\KernelUsersModel as Users;

class KernelLogController extends KernelControllerAbstract implements KernelControllerInterface {
	
	use KernelControllerTrait;
	
	public function userLogApiFront($uid, $args) {
		$users = new Users($uid);
		$userLogin = $users->getUserChar("login");
		if ($userLogin != "") {
			$src = TT_LOGS."api_log/".$userLogin.".log";
			$log = json_encode($args);
			$string = date("d-m-Y H:i:s", time()).": Запрос: ".$log."\r\n";
			$files = new FS();
			$files->write($src, $string);
		}
	}
	
	public function userLogApiBack($uid, $args) {
		$users = new Users($uid);
		$userLogin = $users->getUserChar("login");
		if ($userLogin != "") {
			$src = TT_LOGS."api_log/".$userLogin.".log";
			$log = json_encode($args);
			$string = date("d-m-Y H:i:s", time()).": Ответ: ".$log."\r\n";
			$files = new FS();
			$files->write($src, $string);
		}
	}
	
	public function userLog($uid, $msg) {
		$users = new Users($uid);
		$userLogin = $users->getUserChar("login");
		if ($userLogin != "") {
			$src = TT_LOGS."user_log/".$userLogin.".log";
			$string = date("d-m-Y H:i:s", time()).": ".$msg."\r\n";
			$files = new FS();
			$files->write($src, $string);
		}
	}
	
}

?>