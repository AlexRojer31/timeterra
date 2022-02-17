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

use kernel\models\KernelUsersModel as Users;

class KernelUserController extends KernelControllerAbstract implements KernelControllerInterface {
	
	use KernelControllerTrait;
	
	public function comparePassword($login, $password) {
		$users = new Users();
		$uid = $users->getUidByLogin($login);
		$users->set($uid);
		$passhash = $users->getUserChar("passhash");
		$compareHash = $this->passwordHasher($login, $password);
		if ($passhash === $compareHash) {
			$this->countBanAuthorization($uid, 0);
			return true;
		} else {
			$this->countBanAuthorization($uid, 1);
			$log = new Log();
			$msg = "Введен некорректный пароль.";
			$log->userLog($uid, $msg);
			return false;
		}
	}
	
	public function comparePincode($uid, $pincode) {
		$users = new Users();
		$users->set($uid);
		$pinhash = $users->getUserChar("pinhash");
		$compareHash = $this->pincodeHasher($pincode);
		if ($pinhash === $compareHash) {
			$this->countBanAuthorization($uid, 0);
			return true;
		} else {
			$this->countBanAuthorization($uid, 1);
			$log = new Log();
			$msg = "Введен некорректный пинкод.";
			$log->userLog($uid, $msg);
			return false;
		}
	}
	
	public function isBan($uid) {
		$users = new Users();
		$users->set($uid);
		$ban = $users->getUserChar("isban");
		if ($ban > 0) {
			$this->checkBanTime($uid);
			$ban = $users->getUserChar("isban");
			if ($ban) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	private function countBanAuthorization($uid, $count) {
		$users = new Users();
		$users->set($uid);
		$bancount = $users->getUserChar("bancount");
		if ($count > 0) {
			if ($bancount < 1) {
				$time = time();
				$bantime = 60*2 + $time;
				$bandesc = "Количество попыток авторизации превышено";
				$this->setBan($uid, $bantime, $bandesc);
			} else {
				$bancount = $bancount - 1;
				$users->setUserChar("bancount", $bancount);
			}
		} else {
			$this->checkBanTime($uid);
		}
	}
	
	private function checkBanTime($uid) {
		$users = new Users();
		$users->set($uid);
		$time = time();
		$bantime = $users->getUserChar("bantime");
		if ($bantime < $time) {
			if ($bantime != 0) {
				$this->resetBan($uid);
			}
		}
	}
	
	private function setBan($uid, $bantime, $bandesc) {
		$users = new Users();
		$users->set($uid);
		$users->setUserChar("isban", 1);
		$users->setUserChar("bantime", $bantime);
		$users->setUserChar("bancount", 0);
		$users->setUserChar("bandesc", $bandesc);
		$log = new Log();
		$msg = "Пользователь заблокирован до ".date("d-m-Y H:i:s", $bantime).". Причина: ".$bandesc;
		$log->userLog($uid, $msg);
	}
	
	private function resetBan($uid) {
		$users = new Users();
		$users->set($uid);
		$users->setUserChar("isban", 0);
		$users->setUserChar("bantime", 0);
		$users->setUserChar("bancount", 5);
		$users->setUserChar("bandesc", "Доступ открыт");
		$log = new Log();
		$msg = "Пользователь разблокирован";
		$log->userLog($uid, $msg);
	}
	
	private function passwordHasher($login, $password) {
		return md5($login.$password.TT_CRYPT);
	}
	
	private function pincodeHasher($pincode) {
		return md5($pincode.TT_CRYPT);
	}
	
}

?>