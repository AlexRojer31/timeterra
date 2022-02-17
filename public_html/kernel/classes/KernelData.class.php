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
use kernel\interfaces\KernelDataInterface;
use kernel\traits\KernelMysqlTrait;

use mysqli;

class KernelData implements KernelDataInterface {
	
	private $name;
	private $mysql;
	
	use KernelMysqlTrait;
	
	public function __construct($name = "") {
		$this->mysql = new mysqli(TT_DATABASE_HOST, TT_DATABASE_USER, TT_DATABASE_PASSWORD, TT_DATABASE_NAME);
		$this->name = $name;
	}
	
	public function add($columns = "", $values = "") {
		$query = "insert into $this->name ($columns) values ($values)";
		return $this->mysql->query($query);
	}
	
	public function set($set = "", $where = "") {
		$query = "update $this->name set $set where $where";
		return $this->mysql->query($query);
	}
	
	public function get($data = "", $where = "", $order = "", $desc = "", $limit = "") {
		$query = "select $data from $this->name $where $order $desc $limit";
		$result = $this->mysql->query($query);
		if (!$result) {
			return false;
		} else {
			while ($row = $result->fetch_array()) {
				$rows[] = $row;
			}
			return $rows = (!empty($rows)) ? $rows : false;
		}
	}
	
	public function del($where = "") {
		$query = "delete from $this->name where $where";
		return $this->mysql->query($query);
	}
	
}

?>