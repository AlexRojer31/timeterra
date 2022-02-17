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
namespace kernel\abstracts;
use kernel\abstracts\KernelMainAbstract;

use kernel\classes\KernelTable;
use kernel\classes\KernelData;

abstract class KernelModelAbstract extends KernelMainAbstract {
	
    protected function t($table = "") {
    	return new KernelTable($table);
    }
	
    protected function d($table = "") {
    	return new KernelData($table);
    }
	
}

?>