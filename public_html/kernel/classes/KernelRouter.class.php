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
use kernel\abstracts\KernelMainAbstract;

use kernel\routs\KernelErrorPagesRout;

class KernelRouter extends KernelMainAbstract {
	
	private $startRout = TT_INDEX;
	private $errorRout = TT_ERROR;
	
	private $controller;
	private $action;
	private $query;
	private $uri;
	
	public function __construct() {
		$this->controller = $this->getController();
		$this->action = $this->getAcion();
		$this->query = $this->getQuery();
		if ($this->controller != "") {
			$this->uri = $this->createUri();
		} else {
			$this->uri = $this->startRout;
		};
		$this->start();
	}
	
	private function start() {
		$start = $this->uri;
		if ($start) {
			$controller = new $start($this->action, $this->query);
		} else {
			$start = $this->errorRout;
			$notFound = $this->controller;
			$this->query = array(
				"controller" => $notFound	
			);
			$controller = new $start("notFound", $this->query);
		}
	}
	
	private function getController() {
		$path = $this->getPath();
		if (strripos($path, "/")) {
			$pathArr = explode("/", $path);
			return $pathArr[0];
		} else {
			return $path;
		}
	}
	
	private function getAcion() {
		$path = $this->getPath();
		if (strripos($path, "/")) {
			$pathArr = explode("/", $path);
			return $pathArr[1];
		} else {
			return "";
		}
	}
	
	private function getUri() {
		return parse_url($_SERVER["REQUEST_URI"]);
	}
	
	private function getPath() {
		$f = $this->f();
		if ($f->iskey($this->getUri(), "path")) {
			return trim($this->getUri()["path"], "/");
		} else {
			return false;
		}
	}
	
	private function getQuery() {
		$queryArr = array();
		if (!empty($this->getUri()["query"])) {
			$query = trim($this->getUri()["query"], "/");
			if (strripos($query, "&")) {
				$parceQueryArr = explode("&", $query);
				foreach ($parceQueryArr as $value) {
					if (strripos($value, "=")) {
						$queryElemArr = explode("=", $value);
						$queryArr[$queryElemArr[0]] = $queryElemArr[1];
					} else {
						$queryArr[] = $value;
					}
				}
			} else {
				if (strripos($query, "=")) {
					$queryElemArr = explode("=", $query);
					$queryArr[$queryElemArr[0]] = $queryElemArr[1];
				} else {
					$queryArr[] = $query;
				}
			}
		} else {
			$queryArr[] = false;
		}
		return $queryArr;
	}
	
	private function createUri() {
		$newUri = false;
		$kernel = $this->sc('kernel/routs');
		$kernelControllers = $kernel->getAllLinks();
		$workspace = $this->sc('workspace/routs');
		$workspaceControllers = $workspace->getAllLinks();
		$controllers = array_merge($kernelControllers, $workspaceControllers);
		$controllers = str_replace("/", "\\", $controllers);
		$controllersRoutArr = array();
		for ($i = 0;$i < count($controllers);$i++) {
			$value = explode(".", $controllers[$i]);
			if ($value[1] == "rout") {
				$controllersRoutArr[] = $controllers[$i];
				continue;
			} else {
				continue;
			}
		}
		$controllersArr = array();
		for ($i = 0;$i < count($controllersRoutArr);$i++) {
			$value = explode(".", $controllersRoutArr[$i]);
			$controllersArr[] = $value[0];
		}
		for ($i = 0;$i < count($controllersArr);$i++) {
			$hrefArr = explode("\\", $controllersArr[$i]);
			$thisHrefName = $hrefArr[count($hrefArr) - 1];
			if (stripos("tt".$thisHrefName, $this->controller)) {
				$newUri = $controllersArr[$i];
				break;
			} else {
				continue;	
			}
		}
		return $newUri;
	}
	
}

?>