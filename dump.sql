-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Дек 03 2021 г., 19:42
-- Версия сервера: 5.6.39-83.1
-- Версия PHP: 7.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ck97210_erp`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tt_access_applications`
--

CREATE TABLE IF NOT EXISTS `tt_access_applications` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `gid` int(255) NOT NULL,
  `aid` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_access_applications`
--

INSERT INTO `tt_access_applications` (`id`, `gid`, `aid`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `tt_access_dirs`
--

CREATE TABLE IF NOT EXISTS `tt_access_dirs` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `gid` int(255) NOT NULL,
  `resource` varchar(3000) NOT NULL,
  `access` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_access_dirs`
--

INSERT INTO `tt_access_dirs` (`id`, `gid`, `resource`, `access`) VALUES
(1, 1, 'upload', 'rwx'),
(2, 1, 'kernel', 'rwx'),
(3, 1, 'workspace', 'rwx'),
(4, 5, 'upload/root', 'rwx');

-- --------------------------------------------------------

--
-- Структура таблицы `tt_access_groups`
--

CREATE TABLE IF NOT EXISTS `tt_access_groups` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `description` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_access_groups`
--

INSERT INTO `tt_access_groups` (`id`, `name`, `description`) VALUES
(1, 'superuser', 'Группа доступа суперпользователя'),
(2, 'administrator', 'Группа доступа администраторов ERP системы'),
(3, 'developer', 'Группа доступа для разработчиков ERP системы'),
(4, 'user', 'Группа доступа для пользователя user'),
(5, 'root', 'Пользователь');

-- --------------------------------------------------------

--
-- Структура таблицы `tt_access_settings`
--

CREATE TABLE IF NOT EXISTS `tt_access_settings` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `gid` int(255) NOT NULL,
  `sid` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `tt_applications`
--

CREATE TABLE IF NOT EXISTS `tt_applications` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `description` varchar(3000) NOT NULL,
  `action` varchar(300) NOT NULL,
  `icon` varchar(300) NOT NULL,
  `tid` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_applications`
--

INSERT INTO `tt_applications` (`id`, `name`, `description`, `action`, `icon`, `tid`) VALUES
(1, 'Покупайка', 'Приложение для работы с контрагентами при организации снабжения', 'buyall', '/kernel/resources/media/tt_application_icons/logo.svg', 2),
(2, 'Продавайка', 'Приложение для автоматизации работы департаментов продаж', 'sellall', '/kernel/resources/media/tt_application_icons/logo.svg', 1),
(3, 'Конвеер', 'Приложение для автоматизации работы конвеерного производства', 'togotoconstruct', '/kernel/resources/media/tt_application_icons/logo.svg', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `tt_application_tags`
--

CREATE TABLE IF NOT EXISTS `tt_application_tags` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `description` varchar(3000) NOT NULL,
  `icon` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_application_tags`
--

INSERT INTO `tt_application_tags` (`id`, `name`, `description`, `icon`) VALUES
(1, 'Продажи', 'Приложения, созданные в помощь департаментам продаж с целью оптимизации и автоматизации их работы', '/kernel/resources/media/tt_application_icons/logo.svg'),
(2, 'Закупки', 'Приложения для автоматизации отделов снабжения', '/kernel/resources/media/tt_application_icons/logo.svg'),
(3, 'Производство', 'Приложения для автоматизации процессов производства', '/kernel/resources/media/tt_application_icons/logo.svg'),
(4, 'Документооборот', 'Приложения для выстраивания документооборота', '/kernel/resources/media/tt_application_icons/logo.svg');

-- --------------------------------------------------------

--
-- Структура таблицы `tt_desktop_schems`
--

CREATE TABLE IF NOT EXISTS `tt_desktop_schems` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `parameter` varchar(300) NOT NULL,
  `value` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_desktop_schems`
--

INSERT INTO `tt_desktop_schems` (`id`, `name`, `parameter`, `value`) VALUES
(1, 'timeterra', 'color', 'rgba(0, 0, 0, 1)'),
(2, 'timeterra', 'fontFamily', 'arial'),
(3, 'timeterra', 'navBackgroundColor', 'rgba(58, 106, 102, 0.9)'),
(4, 'timeterra', 'backgroundColor', 'rgba(255, 255, 255, 0.7)'),
(5, 'timeterra', 'backgroundImg', '/kernel/resources/media/tt_schems/ttlight.png'),
(6, 'timeterra', 'navColor', 'rgba(255, 255, 255, 0.9)'),
(7, 'timeterra', 'workFieldBackgroundColor', 'rgba(105, 133, 156, 0.9)'),
(8, 'timeterra', 'desktopSchemeName', 'timeterra'),
(9, 'timeterra', 'desctopSchemeIcon', '/kernel/resources/media/tt_schems/timeTerraLight.png');

-- --------------------------------------------------------

--
-- Структура таблицы `tt_settings_tags`
--

CREATE TABLE IF NOT EXISTS `tt_settings_tags` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `description` varchar(3000) NOT NULL,
  `icon` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `tt_users`
--

CREATE TABLE IF NOT EXISTS `tt_users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `login` varchar(300) NOT NULL,
  `passhash` varchar(300) NOT NULL,
  `pinhash` varchar(300) NOT NULL,
  `gid` varchar(300) NOT NULL,
  `isban` int(255) NOT NULL,
  `bandesc` varchar(3000) NOT NULL,
  `bantime` int(255) NOT NULL,
  `bancount` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_users`
--

INSERT INTO `tt_users` (`id`, `login`, `passhash`, `pinhash`, `gid`, `isban`, `bandesc`, `bantime`, `bancount`) VALUES
(1, 'root', '83b0805136854521ed7e7842a60d5830', '91286f061e31e6af7398009da5510bf9', '1/5', 0, 'Доступ открыт', 0, 5),
(2, 'user', 'f3a3711344d8f424a7e858fa0e9d63d1', '91286f061e31e6af7398009da5510bf9', '4', 0, 'Доступ открыт', 0, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `tt_user_applications`
--

CREATE TABLE IF NOT EXISTS `tt_user_applications` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `uid` int(255) NOT NULL,
  `aid` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_user_applications`
--

INSERT INTO `tt_user_applications` (`id`, `uid`, `aid`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `tt_user_sessions`
--

CREATE TABLE IF NOT EXISTS `tt_user_sessions` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `ip` varchar(300) NOT NULL,
  `agent` varchar(300) NOT NULL,
  `hash` varchar(3000) NOT NULL,
  `logindate` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `tt_user_settings`
--

CREATE TABLE IF NOT EXISTS `tt_user_settings` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `uid` int(255) NOT NULL,
  `name` varchar(300) NOT NULL,
  `value` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tt_user_settings`
--

INSERT INTO `tt_user_settings` (`id`, `uid`, `name`, `value`) VALUES
(1, 1, 'desktopSchema', 'timeterra'),
(2, 2, 'desktopSchema', 'timeterra');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
