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
use kernel\abstracts\KernelRoutAbstract;
use kernel\interfaces\KernelRoutInterface;
use kernel\traits\KernelRoutTrait;

class KernelRoutController extends KernelRoutAbstract implements KernelRoutInterface {
	
	public $get = array();
	public $post = array();
	public $json = array();
	public $files = array();
	
	use KernelRoutTrait;
	
}

?>