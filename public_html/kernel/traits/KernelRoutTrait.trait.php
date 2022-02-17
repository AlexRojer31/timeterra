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
namespace kernel\traits;

trait KernelRoutTrait {
	
	public function __construct($action = "", $get = "") {
		$this->set($get);
		$methods = get_class_methods($this);
		$actionMethod = $this->is($methods, $action);
		$this->get($actionMethod, $action);	
	}
	
	public function index() {
		echo "Стартовый метод класса RoutController должен быть переопределен при наследовании!";
	}
	
	public function ajax() {
		$s = $this->s();
		$controller = $this->get["controller"]."Controller";
		$action = $this->get["action"];
		$args = array(
			"uid" => $s->get("uid"),
			"get" => $this->get,
			"post" => $this->post,
			"files" => $this->files,
			"json" => $this->json,
		);
		$this->$controller($action, $args);
	}
}

?>