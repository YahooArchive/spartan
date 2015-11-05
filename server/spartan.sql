-- MySQL dump 10.13  Distrib 5.6.26-74.0, for Linux (x86_64)
--
-- Host: localhost    Database: spartan3
-- ------------------------------------------------------
-- Server version	5.6.26-74.0-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AppInRoles`
--

DROP TABLE IF EXISTS `AppInRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AppInRoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  `appName` varchar(128) DEFAULT NULL,
  `roleName` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  KEY `appName` (`appName`),
  KEY `roleName` (`roleName`),
  CONSTRAINT `AppInRoles_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `AppInRoles_ibfk_2` FOREIGN KEY (`appName`) REFERENCES `Apps` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `AppInRoles_ibfk_3` FOREIGN KEY (`roleName`) REFERENCES `Roles` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Apps`
--

DROP TABLE IF EXISTS `Apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  `updatedBy` varchar(128) DEFAULT NULL,
  `ownedByUserGroup` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`),
  KEY `ownedByUserGroup` (`ownedByUserGroup`),
  CONSTRAINT `Apps_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Apps_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Apps_ibfk_3` FOREIGN KEY (`ownedByUserGroup`) REFERENCES `UserGroups` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MemberInApps`
--

DROP TABLE IF EXISTS `MemberInApps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MemberInApps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identity` varchar(1024) NOT NULL,
  `identityType` text,
  `role` varchar(32) DEFAULT NULL,
  `expiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `appName` varchar(128) DEFAULT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identity` (`identity`),
  KEY `appName` (`appName`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `MemberInApps_ibfk_1` FOREIGN KEY (`appName`) REFERENCES `Apps` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `MemberInApps_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `roleType` varchar(128) DEFAULT NULL,
  `roleHandle` varchar(128) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  `updatedBy` varchar(128) DEFAULT NULL,
  `ownedByUserGroup` varchar(128) DEFAULT NULL,
  `ownedByApp` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`),
  KEY `ownedByUserGroup` (`ownedByUserGroup`),
  KEY `ownedByApp` (`ownedByApp`),
  CONSTRAINT `Roles_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Roles_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Roles_ibfk_3` FOREIGN KEY (`ownedByUserGroup`) REFERENCES `UserGroups` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Roles_ibfk_4` FOREIGN KEY (`ownedByApp`) REFERENCES `Apps` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserGroups`
--

DROP TABLE IF EXISTS `UserGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserGroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  `updatedBy` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`),
  CONSTRAINT `UserGroups_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserGroups_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserInGroups`
--

DROP TABLE IF EXISTS `UserInGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserInGroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userType` varchar(128) DEFAULT NULL,
  `role` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userGroupName` varchar(128) DEFAULT NULL,
  `userid` varchar(128) DEFAULT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userGroupName` (`userGroupName`),
  KEY `userid` (`userid`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `UserInGroups_ibfk_1` FOREIGN KEY (`userGroupName`) REFERENCES `UserGroups` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserInGroups_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UserInGroups_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(128) NOT NULL,
  `type` varchar(32) DEFAULT NULL,
  `userkey` varchar(4096) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `createdBy` varchar(128) DEFAULT NULL,
  `role` varchar(32) DEFAULT NULL,
  `domain` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-03  7:10:03
