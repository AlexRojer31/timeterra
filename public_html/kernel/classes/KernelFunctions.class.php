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
use kernel\classes\KernelCookie as Cookie;
use kernel\classes\KernelSession as Session;

class KernelFunctions {
	
	public function test() {
		echo "test";
	}
	
	public function requireFiles($dir, $type="") {
		$filesArray = scandir($dir);
		foreach ($filesArray as $fileName) {
			$fileNameSearch = "tt".$fileName;
			if (strripos($fileNameSearch, $type) != false) {
				require_once $dir.$fileName;
			} else {
				continue;
			}
		}
	}
	
	public function js($dir, $type="") {
		$result = array();
		$filesArray = scandir($dir);
		foreach ($filesArray as $fileName) {
			$fileNameSearch = "tt".$fileName;
			if (strripos($fileNameSearch, $type) != false) {
				$result[] = "<script type='text/javascript' src='/".$dir.$fileName."?version=".filectime($dir.$fileName)."' defer></script>\r\n";
			} else {
				continue;
			}
		}
		return $result;
	}
	
	public function css($dir, $type="") {
		$result = array();
		$filesArray = scandir($dir);
		foreach ($filesArray as $fileName) {
			$fileNameSearch = "tt".$fileName;
			if (strripos($fileNameSearch, $type) != false) {
				$result[] = "<link rel='stylesheet' href='/".$dir.$fileName."?version=".filectime($dir.$fileName)."'>\r\n";
			} else {
				continue;
			}
		}
		return $result;
	}
	
	public function translit($string) {
		$converter = array(
		"??" => "a",   "??" => "e",   "??" => "y",   "??" => "o",   "??" => "u",   "??" => "sh",   "??" => "e",
		"??" => "b",   "??" => "e",   "??" => "k",   "??" => "p",   "??" => "f",   "??" => "sch",  "??" => "yu",
		"??" => "v",   "??" => "zh",  "??" => "l",   "??" => "r",   "??" => "h",   "??" => "",     "??" => "ya",
		"??" => "g",   "??" => "z",   "??" => "m",   "??" => "s",   "??" => "c",   "??" => "y",  
		"??" => "d",   "??" => "i",   "??" => "n",   "??" => "t",   "??" => "ch",  "??" => "", 
		
		"??" => "A",   "??" => "E",   "??" => "Y",   "??" => "O",   "??" => "U",   "??" => "SH",    "??" => "E",
		"??" => "B",   "??" => "E",   "??" => "K",   "??" => "P",   "??" => "F",   "??" => "SCH",   "??" => "YU",
		"??" => "V",   "??" => "ZH",  "??" => "L",   "??" => "R",   "??" => "H",   "??" => "",      "??" => "YA",
		"??" => "G",   "??" => "Z",   "??" => "M",   "??" => "S",   "??" => "C",   "??" => "Y",  
		"??" => "D",   "??" => "I",   "??" => "N",   "??" => "T",   "??" => "CH",  "??" => "", 
		);
		
		$string = mb_ereg_replace("[[:space:]]", "-", $string);
		$string = trim($string, "[[:space:]]");
		$string = trim($string, "-");
		
		$newString = strtr($string, $converter);
		
		return $newString;
	}
	
	public function setConfigCookies($kernelCookie, $workSpaceCookie) {
		$dataBaseCookie = array();
		$allCookie = array_merge($kernelCookie, $workSpaceCookie, $dataBaseCookie);
		$cookie = new Cookie();
		foreach ($allCookie as $key => $value) {
			$cookie->set($key, $value);
		};
	}
	
	public function setConfigSessions($kernelSessions, $workSpaceSessions) {
		$dataBaseSessions = array();
		$allSessions = array_merge($kernelSessions, $workSpaceSessions, $dataBaseSessions);
		$session = new Session();
		foreach ($allSessions as $key => $value) {
			$session->set($key, $value);
		};
	}
	
	public function isKey($arr, $searchKey) {
		$result = false;
		if (is_array($arr)) {
			foreach ($arr as $key=>$value) {
				if ($key === $searchKey) {
					if ($this->isVar($value)) {
						$result = true;
						break;
					} else {
						continue;
					}
				} else {
					continue;
				}
			}
			return $result;
		} else {
			return false;
		}	
	}
	
	public function isVar($var) {
		if (!isset($var) || empty($var)) {
			return false;
		} else {
			return true;
		}
	}
	
	public function parseStr($str, $divider, $position) {
		$arr = explode($divider, $str);
		if ($position) {
			$value = $arr[$position];
		} else {
			$position = count($arr) - 1;
			$value = $arr[$position];
		}
		return $value;
	}
		
}

?>