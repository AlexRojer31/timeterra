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

use kernel\models\KernelUserSettingsModel as UserSettings;
use kernel\models\KernelDesktopSchemsModel as DesktopSchems;
use kernel\models\KernelUserApplicationsModel as UserApplications;
use kernel\models\KernelApplicationsModel as Applications;

class KernelDesktopController extends KernelControllerAbstract implements KernelControllerInterface {
	
	use KernelControllerTrait;
	
	public function getIndexView() {
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopHeaderView.view.php";
		echo TT_META_VIEWPORT."\r\n";
		echo TT_FAVICON."\r\n";
		echo $this->includeCss();
		echo $this->includeApplications();
		echo $this->includeJs();
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopFooterView.view.php";
		exit;
	}
	
	public function getLoginView() {
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopLoginView.view.php";
		exit;
	}
	
	public function getPincodeView() {
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopPincodeView.view.php";
		exit;
	}
	
	public function getIncorrect() {
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopIncorrectView.view.php";
		exit;
	}
	
	public function getDenieded() {
		require_once TT_VIEWS."tt_desktop_views/KernelDesktopDeniededView.view.php";
		exit;
	}
	
	private function includeCss() {
		$echo = "";
		$f = $this->f();
		$result = $f->css(TT_CSS, "style");
		for ($i = 0;$i < count($result);$i++) {
			$echo = $echo.$result[$i];
		}
		return $echo;
	}
	
	private function includeJs() {
		$echo = "";
		$f = $this->f();
		$result = array();
		$resultKernel = $f->js(TT_JS, "load");
		$resultKWorkspace = $f->js(WS_JS, "load");
		$result = array_merge($resultKWorkspace, $resultKernel);
		for ($i = 0;$i < count($result);$i++) {
			$echo = $echo.$result[$i];
		}
		return $echo;
	}
	
	private function includeApplications() {
		$tt = $this->sc(trim(TT_JS, "/"));
		$ttArr = $tt->getAllLinks();
		$ws = $this->sc(trim(WS_JS, "/"));
		$wsArr = $ws->getAllLinks();
		$arr = array_merge($ttArr, $wsArr);
		$result = array();
		foreach ($arr as $fileName) {
			if (strripos($fileName, ".index.") != false) {
				$result[] = "<script type='text/javascript' src='/".$fileName."?version=".filectime($fileName)."' defer></script>\r\n";
			} else {
				continue;
			}
		}
		$str = implode("", $result);
		return $str;
	}
	
	private function APIgetDesktopSchema($args) {
		$uid = $args["uid"];
		$userSettings = new UserSettings();
		$userDesktopSchema = $userSettings->getUserSettings($uid, "desktopSchema");
		$desktopSchems = new DesktopSchems();
		$schemaArr = $desktopSchems->getSchema($userDesktopSchema);
		$log = new Log();
		$msg = "Загрузка схемы рабочего стола.";
		$log->userLog($uid, $msg);
		$log->userLogApiBack($uid, $schemaArr);
		return json_encode($schemaArr);
	}
	
	private function APIgetAppAdditionalScriptsVersion($args) {
		$uid = $args["uid"];
		$appName = $args["post"]["appName"];
		$scripts = $args["post"]["scripts"];
		$scripts = json_decode($scripts);
		$return = array();
		for ($i = 0;$i < count($scripts);$i++) {
			$fileName = trim($scripts[$i], "/");
			if (is_file($fileName)) {
				$return[$i] = "/".$fileName."?version=".filectime($fileName);
			} else {
				$return[$i] = false;
			}
		}
		$log = new Log();
		$log->userLogApiBack($uid, $return);
		return json_encode($return);
	}
	
	private function APIgetUserDesktopApplications($args) {
		$uid = $args["uid"];
		$userApplications = new UserApplications();
		$applicationsArr = $userApplications->getUserApplications($uid);
		$applications = new Applications();
		$return = array();
		for ($i = 0;$i < count($applicationsArr);$i++) {
			$applications->set($applicationsArr[$i]["aid"]);
			$return[] = $applications->getApplicationInfo();
		}
		$log = new Log();
		$msg = "Загрузка ярлыков приложений рабочего стола.";
		$log->userLog($uid, $msg);
		$log->userLogApiBack($uid, $return);
		return json_encode($return);
	}
	
}

?>