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

use kernel\controllers\KernelLogController as Log;

class KernelSistemMessengerController extends KernelControllerAbstract implements KernelControllerInterface {
	
	use KernelControllerTrait;
	
	private function APIlogMsg($args) {
		$uid = $args["uid"];
		$msg = $args["post"]["msg"];
		$return = array(
			"logMsg" => true
		);
		$log = new Log();
		$log->userLog($uid, $msg);
		$log->userLogApiBack($uid, $return);
		return true;
	}
	
}

?>