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
namespace kernel\models;
use kernel\abstracts\KernelModelAbstract;
use kernel\interfaces\KernelModelInterface;
use kernel\traits\KernelModelTrait;

class KernelUsersModel extends KernelModelAbstract implements KernelModelInterface {
	
	use KernelModelTrait;
	
	private $id;
	private $table = TT_TABLE_PREFIX."users";
	
	public function getUidByLogin($login) {
		$d = $this->d($this->table);
		$result = $d->get("id", "where login='$login'", "order by id", "desc", "limit 1");
		if ($result) {
			return $result[0]["id"];
		} else {
			return false;
		}
	}
	
	public function getUserChar($name) {
		$result = $this->getUserInfo();
		if ($result) {
			return $result[$name];
		} else {
			return false;
		}
	}
	
	public function setUserChar($name, $value) {
		$d = $this->d($this->table);
		$id = $this->id;
		if (is_numeric($value)) {
			$d->set("$name=$value", "id=$id");
		} else {
			$d->set("$name='$value'", "id=$id");
		}
	}
	
	private function getUserInfo() {
		$d = $this->d($this->table);
		$id = $this->id;
		$result = $d->get("id, login, passhash, pinhash, gid, isban, bandesc, bantime, bancount", "where id=$id", "order by id", "desc", "limit 1");
		if ($result) {
			return $result[0];
		} else {
			return false;
		}
	}
	
	
}

?>