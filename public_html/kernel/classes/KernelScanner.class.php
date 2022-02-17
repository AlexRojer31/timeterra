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

class KernelScanner {

	private $filesArr = [];
	
	public function __construct($dirrectory) {
		$this->dirrectory = $dirrectory;
	}
	
	public function getAllFiles() {
		$files = array();
		$arr = $this->getLinksArr();
		foreach($arr as $value) {
			$filesArr = explode("/", $value);
			$lastChild = count($filesArr);
			$files[] = $filesArr[$lastChild-1];
		}
		return $files;
	}
	
	public function getAllLinks() {
		$files = $this->getLinksArr();
		return $files;
	}
	
	private function scanDirs($dirrectory) {
		$dirrectoryCallBack = $dirrectory;
		$public = scandir($dirrectoryCallBack);
		foreach ($public as $value) {
			if ($value !== "." && $value !== "..") {
				$dirrectory = $dirrectoryCallBack."/".$value;
				if (is_file($dirrectory)) {
					$this->filesArr[] = $dirrectory;
				} else {
					$this->scanDirs($dirrectory);
				}
			}
		}
	}
	
	private function creatFilesArr() {
		foreach ($this->filesArr as $i => $name) { 
			unset($this->filesArr[$i]); 
		}
		$this->scanDirs($this->dirrectory);
	}
	
	private function getLinksArr() {
		$this->creatFilesArr();
		return $this->filesArr;
	}

}

?>