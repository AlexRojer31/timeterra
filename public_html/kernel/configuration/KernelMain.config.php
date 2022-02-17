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
define("TT_HOST_NAME", $_SERVER["SERVER_NAME"]);
define("TT_MAIL", "info@timeterra.org");
define("TT_CRYPT", "timeterra");

define("TT_INDEX", "kernel\\routs\\TemplateKernelRout");
define("TT_ERROR", "kernel\\routs\\KernelErrorRout");
define("TT_NOT_FOUND_CONTROLLER", "/error/notFound/");
define("TT_NOT_FOUND_METHOD", "/error/notMethod");

define("TT_TABLE_PREFIX", "tt_");

define("TT_LOGS", "kernel/logs/");
define("TT_VIEWS", "kernel/views/");
define("TT_RESOURCES", "kernel/resources/");
define("TT_CSS", TT_RESOURCES."css/");
define("TT_JS", TT_RESOURCES."js/");
define("TT_MEDIA", TT_RESOURCES."media/");

define("WS_VIEWS", "workspace/views/");
define("WS_RESOURCES", "workspace/resources/");
define("WS_CSS", WS_RESOURCES."css/");
define("WS_JS", WS_RESOURCES."js/");
define("WS_MEDIA", WS_RESOURCES."media/");

define("TT_FAVICON", "<link rel='icon' href='/".TT_MEDIA."tt_favicons/logo.svg'>");
define("TT_META_VIEWPORT", "<meta name='viewport' content='width=device-width, initial-scale=1'>");



?>