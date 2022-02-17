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

use kernel\models\KernelApplicationsModel as Applications;
use kernel\models\KernelApplicationTagsModel as ApplicationTags;

class KernelApplicationsManagerController extends KernelControllerAbstract implements KernelControllerInterface {
	
	use KernelControllerTrait;
	
	private function APIgetApplicationCategorys($args) {
		$uid = $args["uid"];
		$applicationTags = new ApplicationTags();
		$allTags = $applicationTags->getAllTags();
		$return = array();
		for ($i = 0;$i < count($allTags);$i++) {
			$applicationTags->set($allTags[$i]["id"]);
			$info = $applicationTags->getTagInfo();
			$return[] = $info;
		}
		$log = new Log();
		$log->userLogApiBack($uid, $return);
		return json_encode($return);
	}
	
	private function APIgetAccessUserApplicationsInCategory($args) {
		$uid = $args["uid"];
		$categorId = $args["post"]["categoryId"];
		$applications = new Applications();
		$allApplications = $applications->getAllApplications();
		$return = array();
		for ($i = 0;$i < count($allApplications);$i++) {
			$applications->set($allApplications[$i]["id"]);
			$info = $applications->getApplicationInfo();
			if ($info["tid"] === $categorId) {
				$return[] = $info;
				continue;
			} else {
				continue;
			}
		}
		$log = new Log();
		//$msg = "hello";
		//$log->userLog($uid, $msg);
		$log->userLogApiBack($uid, $return);
		return json_encode($return);
	}
	
}

?>