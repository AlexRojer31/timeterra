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
namespace kernel\routs;
use kernel\routs\KernelRoutController;

use kernel\controllers\KernelUserController as User;

use kernel\models\TemplateKernelModel as Test;

class KernelTestRout extends KernelRoutController {
	
	public function index() {
		echo "Hello Test!";
	}
	
	public function timer() {
		echo time();
	}
	
	public function crypter() {
		echo md5("useruser".TT_CRYPT)."<br>".md5("12345".TT_CRYPT);
	}
	
	public function test() {
		$model = new Test("qwerty");
		$model->set(4);
		echo $model->get();
	}
	
	public function testController($action, $args) {
		echo "Ajax test:<br>
		".$args["get"]["controller"]."<br>
		".urldecode($args["get"]["action"]);
	}
	
	public function userController($action, $args) {
		$start = new User();
		echo $start->API($action, $args);
	}
}

?>