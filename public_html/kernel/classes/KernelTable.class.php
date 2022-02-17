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
use kernel\traits\KernelMysqlTrait;
use kernel\interfaces\KernelTableInterface;
use mysqli;

class KernelTable implements KernelTableInterface {
	
	private $name;
	private $mysql;
	
	use KernelMysqlTrait;
	
	public function __construct($name = "") {
		$this->mysql = new mysqli(TT_DATABASE_HOST, TT_DATABASE_USER, TT_DATABASE_PASSWORD, TT_DATABASE_NAME);
		$this->name = $name;
	}
	
	public function create($columns = "") {
		$query = "create table $this->name ($columns)";
		return $this->mysql->query($query);
	}
	
	public function update($alter = "") {
		$query = "alter table $this->name $alter";
		return $this->mysql->query($query);
	}
	
	public function del() {
		$query = "drop table $this->name";
		return $this->mysql->query($query);
	}
	
}

?>