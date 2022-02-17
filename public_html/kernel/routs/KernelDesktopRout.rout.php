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

use kernel\controllers\KernelDesktopController as Desktop;
use kernel\controllers\KernelUserController as User;
use kernel\controllers\KernelLogController as Log;
use kernel\controllers\KernelSistemMessengerController as SistemMessenger;
use kernel\controllers\KernelApplicationsManagerController as ApplicationsManager;

use kernel\models\KernelUserSessionsModel as UserSessions;
use kernel\models\KernelUsersModel as Users;

class KernelDesktopRout extends KernelRoutController {
	
	public function index() {
		if ($this->authentication()) {
			$s = $this->s();
			$hash = $s->get("hash");
			if ($hash) {
				$uid = $s->get("uid");
				$user = new User();
				if ($user->isBan($uid)) {
					header("location: /desktop/accessDenieded/");
					exit;
				} else {
					$users = new Users();
					$users->set($uid);
					$pinhash = $users->getUserChar("pinhash");
					if ($hash === $pinhash) {
						$desktop = new Desktop();
						$desktop->getIndexView();
					} else {
						header("location: /desktop/logoff/");
						exit;
					}
				}
			} else {
				header("location: /desktop/pincode/");
				exit;
			}
		} else {
			header("location: /desktop/login/");
			exit;
		}
	}
	
	public function passwordAuthorization() {
		$login = $this->post["login"];
		$password = $this->post["password"];
		$user = new User();
		$users = new Users();
		$uid = $users->getUidByLogin($login);
		if ($user->comparePassword($login, $password)) {
			if ($user->isBan($uid)) {
				header("location: /desktop/accessDenieded/");
				exit;
			} else {
				$users->set($uid);
				$s = $this->s();
				$s->set("uid", $uid);
				$s->set("hash", $users->getUserChar("pinhash"));
				$this->setUserSession();
				header("location: /desktop/");
				exit;
			}
		} else {
			if ($user->isBan($uid)) {
				header("location: /desktop/accessDenieded/");
				exit;
			} else {
				header("location: /desktop/incorrectAuthorization/");
				exit;
			}	
		}
	}
	
	public function pinAuthorization() {
		$pincode = $this->post["pincode"];
		$user = new User();
		$s = $this->s();
		$uid = $s->get("uid");
		if ($user->isBan($uid)) {
			header("location: /desktop/accessDenieded/");
			exit;
		} else {
			if ($user->comparePincode($uid, $pincode)) {
				$users = new Users();
				$users->set($uid);
				$s->set("hash", $users->getUserChar("pinhash"));
				$this->setUserSession();
				header("location: /desktop/");
				exit;
			} else {
				header("location: /desktop/incorrectAuthorization/");
				exit;
			}
		}
	}
	
	public function login() {
		$desktop = new Desktop();
		$desktop->getLoginView();
	}
	
	public function pincode() {
		$desktop = new Desktop();
		$desktop->getPincodeView();
	}
	
	public function logout() {
		$s = $this->s();
		$c = $this->c();
		$log = new Log();
		$msg = "Выход на устройстве.";
		$log->userLog($s->get("uid"), $msg);
		$s->del("uid");
		$s->del("hash");
		$c->del("hash");
		header("location: /");
		exit;
	}
	
	public function logoff() {
		$uid = $this->getUidBySession();
		$userSessions = new UserSessions();
		$userSessions->dropSessionsByUid($uid);
		$s = $this->s();
		$c = $this->c();
		$log = new Log();
		$msg = "Выход на всех устройствах.";
		$log->userLog($uid, $msg);
		$s->del("uid");
		$s->del("hash");
		$c->del("hash");
		header("location: /");
		exit;
	}
	
	public function accessDenieded() {
		$desktop = new Desktop();
		$desktop->getDenieded();
	}
	
	public function incorrectAuthorization() {
		$desktop = new Desktop();
		$desktop->getIncorrect();
	}
	
	public function desktopController($action, $args) {
		$log = new Log();
		$log->userLogApiFront($args["uid"], $args);
		$start = new Desktop();
		echo $start->API($action, $args);
	}
	
	public function userController($action, $args) {
		$log = new Log();
		$log->userLogApiFront($args["uid"], $args);
		$start = new User();
		echo $start->API($action, $args);
	}
	
	public function sistemMessengerController($action, $args) {
		$log = new Log();
		$log->userLogApiFront($args["uid"], $args);
		$start = new SistemMessenger();
		echo $start->API($action, $args);
	}
	
	public function applicationsManagerController($action, $args) {
		$log = new Log();
		$log->userLogApiFront($args["uid"], $args);
		$start = new ApplicationsManager();
		echo $start->API($action, $args);
	}
	
	private function authentication() {
		$s = $this->s();
		$uid = $s->get("uid");
		if ($uid) {
			return true;
		} else {
			$uid = $this->getUidBySession();
			if ($uid) {
				$s->set("uid", $uid);
				return true;
			} else {
				return false;
			}
		}
	}
	
	private function setUserSession() {
		$data = $this->getData();
		$userSessions = new UserSessions();
		$hash = $userSessions->addSesion($data);
		$c = $this->c();
		$c->set("hash", $hash);
		$s = $this->s();
		$log = new Log();
		$msg = "Выполнен вход: ip - ".$data["ip"]."; agent - ".$data["agent"];
		$log->userLog($s->get("uid"), $msg);
	}
	
	private function getUidBySession() {
		$c = $this->c();
		$hash = $c->get("hash");
		$userSessions = new UserSessions();
		$uid = $userSessions->getUidBySessionHash($hash);
		return $uid;
	}
	
	private function getData() {
		$s = $this->s();
		$c = $this->c();
		$data = array(
			"uid" => $s->get("uid"),
			"pinHash" => $s->get("hash"),
			"sesHash" => $c->get("hash"),
			"time" => time(),
			"ip" => $_SERVER["REMOTE_ADDR"],
			"agent" => $_SERVER["HTTP_USER_AGENT"],
		);
		return $data;
	}
	
}

?>