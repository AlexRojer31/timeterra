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

class KernelUserSessionsModel extends KernelModelAbstract implements KernelModelInterface {
	
	use KernelModelTrait;
	
	private $id;
	private $table = TT_TABLE_PREFIX."user_sessions";
	
	public function addSesion($data) {
		$ip = $data["ip"];
		$agent = $data["agent"];
		$logindate = $data["time"];
		$uid = $data["uid"];
		if (!$uid) {
			$uid = 1;
		}
		$d = $this->d($this->table);
		$hash = $this->sessionHasher($ip, $agent, $uid);
		$columns = "ip, agent, hash, logindate, uid";
		$values = "'$ip', '$agent', '$hash', $logindate, $uid";
		$d->add($columns, $values);
		return $hash;
	}
	
	public function getUidBySessionHash($hash) {
		$result = $this->getSession($hash);
		if ($result) {
			return $result["uid"];
		} else {
			return false;
		}
	}
	
	public function dropSessionsByUid($uid) {
		$d = $this->d($this->table);
		$result = $d->del("uid=$uid");
		return $result;
	}
	
	private function getSession($hash) {
		$d = $this->d($this->table);
		$result = $d->get("id, ip, agent, hash, logindate, uid", "where hash='$hash'", "order by id", "desc", "limit 1");
		if ($result) {
			return $result[0];
		} else {
			return false;
		}
	}
	
	private function sessionHasher($ip, $agent, $uid) {
		$hash = md5($ip.$agent.$uid);
		return $hash;
	}
	
	
}

?>