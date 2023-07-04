-- MariaDB dump 10.19  Distrib 10.11.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: voucher
-- ------------------------------------------------------
-- Server version	10.11.3-MariaDB-1:10.11.3+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` char(26) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `holder_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners` (
  `id` char(26) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `is_publish` smallint(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES
('01h4gnt9583xvxbkkj9ep24c5w','sample/1.webp','Banner 0','<h1>Banner </h1>',NULL,NULL,NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL),
('01h4gnt959eb05qysdkjmmqvy5','sample/2.webp','Banner 1','<h1>Banner </h1>',NULL,NULL,NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL),
('01h4gnt95a98p5kwbzp10m8per','sample/3.webp','Banner 2','<h1>Banner </h1>',NULL,NULL,NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_as_data_partners`
--

DROP TABLE IF EXISTS `customer_as_data_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_as_data_partners` (
  `id` char(26) NOT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `image_selfie` varchar(255) DEFAULT NULL,
  `file_statement` varchar(255) DEFAULT NULL,
  `file_agreement` varchar(255) DEFAULT NULL,
  `additional_json` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_as_data_partners`
--

LOCK TABLES `customer_as_data_partners` WRITE;
/*!40000 ALTER TABLE `customer_as_data_partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_as_data_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_carts`
--

DROP TABLE IF EXISTS `customer_carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_carts` (
  `id` char(26) NOT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `sale_id` char(26) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `entity_id` char(26) DEFAULT NULL,
  `price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `additional_info_json` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_carts`
--

LOCK TABLES `customer_carts` WRITE;
/*!40000 ALTER TABLE `customer_carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_level_histories`
--

DROP TABLE IF EXISTS `customer_level_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_level_histories` (
  `id` char(26) NOT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `customer_level_id` char(26) DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_level_histories`
--

LOCK TABLES `customer_level_histories` WRITE;
/*!40000 ALTER TABLE `customer_level_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_level_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_levels`
--

DROP TABLE IF EXISTS `customer_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_levels` (
  `id` char(26) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `min_amount` decimal(20,2) NOT NULL DEFAULT 0.00,
  `max_amount` decimal(20,2) NOT NULL DEFAULT 0.00,
  `max_loan` decimal(20,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_levels`
--

LOCK TABLES `customer_levels` WRITE;
/*!40000 ALTER TABLE `customer_levels` DISABLE KEYS */;
INSERT INTO `customer_levels` VALUES
('01h4gnt8xz5ytcgkzgtk4ha8ts','Basic','sample/basic.png','<p><span style=\"font-size: 18pt;\"><strong>&nbsp;Level Ini Basic&nbsp;</strong></span></p>\n                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>\n                <p>&nbsp;</p>\n                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>\n                <pre>&nbsp; 1. contoh 1</pre>\n                <pre>&nbsp; 2. contoh 2</pre>\n                <p>&nbsp;</p>','basic',100000.00,500000.00,0.00,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL),
('01h4gnt8y32yrgmj3abhey6rga','Silver','sample/silver.png','<p><span style=\"font-size: 18pt;\"><strong>&nbsp;Level Ini Silver&nbsp;</strong></span></p>\n                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>\n                <p>&nbsp;</p>\n                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>\n                <pre>&nbsp; 1. contoh 1</pre>\n                <pre>&nbsp; 2. contoh 2</pre>\n                <p>&nbsp;</p>','silver',100000.00,1000000.00,0.00,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL),
('01h4gnt8y4rycd6ftypz3bkkes','Gold','sample/gold.png','<p><span style=\"font-size: 18pt;\"><strong>&nbsp;Level Ini Gold&nbsp;</strong></span></p>\n                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>\n                <p>&nbsp;</p>\n                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>\n                <pre>&nbsp; 1. contoh 1</pre>\n                <pre>&nbsp; 2. contoh 2</pre>\n                <p>&nbsp;</p>','gold',100000.00,2000000.00,0.00,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL),
('01h4gnt8y66bf9aajhcp2rqtmv','Platinum','sample/platinum.png','<p><span style=\"font-size: 18pt;\"><strong>&nbsp;Level Ini Platinum&nbsp;</strong></span></p>\n                <p>&nbsp; deskripsi berikut menjelaskan tentang level&nbsp;</p>\n                <p>&nbsp;</p>\n                <p>&nbsp; ini adalah sample deskripsi :&nbsp;</p>\n                <pre>&nbsp; 1. contoh 1</pre>\n                <pre>&nbsp; 2. contoh 2</pre>\n                <p>&nbsp;</p>','platinum',100000.00,3000000.00,0.00,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `customer_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_location_favorite`
--

DROP TABLE IF EXISTS `customer_location_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_location_favorite` (
  `location_id` char(26) DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_location_favorite`
--

LOCK TABLES `customer_location_favorite` WRITE;
/*!40000 ALTER TABLE `customer_location_favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_location_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_refferals`
--

DROP TABLE IF EXISTS `customer_refferals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_refferals` (
  `id` char(26) NOT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `refferal_id` char(26) DEFAULT NULL,
  `customer_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_refferals`
--

LOCK TABLES `customer_refferals` WRITE;
/*!40000 ALTER TABLE `customer_refferals` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_refferals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` char(26) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `referral_code` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `deposit_balance` decimal(20,2) NOT NULL DEFAULT 0.00,
  `poin_balance` decimal(20,2) NOT NULL DEFAULT 0.00,
  `identity_verified` smallint(6) NOT NULL DEFAULT 0,
  `identity_image` varchar(255) DEFAULT NULL,
  `customer_level_id` char(26) DEFAULT NULL,
  `google_oauth_response` text DEFAULT NULL,
  `poin_expired_at` timestamp NULL DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposit_histories`
--

DROP TABLE IF EXISTS `deposit_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposit_histories` (
  `id` char(26) NOT NULL,
  `debit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `description` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `account_id` char(26) DEFAULT NULL,
  `deposit_location_id` char(26) DEFAULT NULL,
  `related_type` varchar(255) DEFAULT NULL,
  `related_id` varchar(255) DEFAULT NULL,
  `is_valid` smallint(6) NOT NULL DEFAULT 0,
  `type` smallint(6) NOT NULL DEFAULT 0,
  `image_prove` varchar(255) DEFAULT NULL,
  `payment_channel` varchar(255) DEFAULT NULL,
  `payment_token` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `payment_response` text DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposit_histories`
--

LOCK TABLES `deposit_histories` WRITE;
/*!40000 ALTER TABLE `deposit_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `deposit_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposit_locations`
--

DROP TABLE IF EXISTS `deposit_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposit_locations` (
  `id` char(26) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gmap_url` varchar(1000) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `open_hour` varchar(255) DEFAULT NULL,
  `close_hour` varchar(255) DEFAULT NULL,
  `is_active` smallint(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposit_locations`
--

LOCK TABLES `deposit_locations` WRITE;
/*!40000 ALTER TABLE `deposit_locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `deposit_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `infos`
--

DROP TABLE IF EXISTS `infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `infos` (
  `id` char(26) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `is_publish` smallint(6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infos`
--

LOCK TABLES `infos` WRITE;
/*!40000 ALTER TABLE `infos` DISABLE KEYS */;
INSERT INTO `infos` VALUES
('01h4gnt956ez8gkswtvas3tn9g','Welcome to our new site','\n                <div class=\"p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50\" role=\"alert\">Info: Welcome to new WBB site, <span style=\"text-decoration: underline;\"><a href=\"http://google.com\" target=\"_blank\" rel=\"noopener\">klik disini</a></span></div>\n            ',NULL,NULL,1,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `infos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_profile_prices`
--

DROP TABLE IF EXISTS `location_profile_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_profile_prices` (
  `id` char(26) NOT NULL,
  `location_profile_id` char(26) DEFAULT NULL,
  `customer_level_id` char(26) DEFAULT NULL,
  `price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `display_price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(20,0) NOT NULL DEFAULT 0,
  `price_poin` decimal(20,2) NOT NULL DEFAULT 0.00,
  `bonus_poin` decimal(20,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_profile_prices`
--

LOCK TABLES `location_profile_prices` WRITE;
/*!40000 ALTER TABLE `location_profile_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `location_profile_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_profiles`
--

DROP TABLE IF EXISTS `location_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_profiles` (
  `id` char(26) NOT NULL,
  `location_id` char(26) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `quota` varchar(255) DEFAULT NULL,
  `display_note` varchar(255) DEFAULT NULL,
  `expired` varchar(255) DEFAULT NULL,
  `expired_unit` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `min_stock` int(11) NOT NULL DEFAULT 0,
  `price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `display_price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(20,0) NOT NULL DEFAULT 0,
  `price_poin` decimal(20,2) NOT NULL DEFAULT 0.00,
  `bonus_poin` decimal(20,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_profiles`
--

LOCK TABLES `location_profiles` WRITE;
/*!40000 ALTER TABLE `location_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `location_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` char(26) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(33,'2014_10_12_000000_create_users_table',1),
(34,'2014_10_12_100000_create_password_resets_table',1),
(35,'2019_08_19_000000_create_failed_jobs_table',1),
(36,'2019_12_14_000001_create_personal_access_tokens_table',1),
(37,'2023_02_05_130618_create_settings_table',1),
(38,'2023_02_05_153320_create_permissions_table',1),
(39,'2023_02_05_153325_create_roles_table',1),
(40,'2023_02_05_153330_create_role_permissions_table',1),
(41,'2023_05_24_130511_create_banners_table',1),
(42,'2023_05_24_130521_create_notifications_table',1),
(43,'2023_05_24_130522_create_vouchers_table',1),
(44,'2023_05_24_130552_create_customers_table',1),
(45,'2023_05_24_130604_create_locations_table',1),
(46,'2023_05_24_130630_create_customer_levels_table',1),
(47,'2023_05_24_130641_create_customer_level_histories_table',1),
(48,'2023_05_24_130646_create_deposit_histories_table',1),
(49,'2023_05_24_130709_create_customer_refferals_table',1),
(50,'2023_05_24_130715_create_sales_table',1),
(51,'2023_05_24_130718_create_sale_items_table',1),
(52,'2023_05_24_182840_create_accounts_table',1),
(53,'2023_05_24_183208_create_infos_table',1),
(54,'2023_06_03_033734_create_paylater_histories_table',1),
(55,'2023_06_04_234950_create_paylater_customers_table',1),
(56,'2023_06_16_045835_create_poin_histories_table',1),
(57,'2023_06_16_045840_create_poin_rewards_table',1),
(58,'2023_06_16_071000_create_location_profiles_table',1),
(59,'2023_06_16_071008_create_location_profile_prices_table',1),
(60,'2023_06_16_071025_create_customer_location_favorites_table',1),
(61,'2023_06_16_071037_create_customer_carts_table',1),
(62,'2023_06_16_071723_create_deposit_locations_table',1),
(63,'2023_06_28_142741_create_customer_as_data_partners_table',1),
(64,'2023_06_30_011011_create_paylater_tenor_histories_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` char(26) NOT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `entity_id` char(26) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_read` smallint(6) NOT NULL DEFAULT 0,
  `url` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paylater_customers`
--

DROP TABLE IF EXISTS `paylater_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paylater_customers` (
  `id` char(26) NOT NULL,
  `description` text DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `limit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `usage` decimal(20,2) NOT NULL DEFAULT 0.00,
  `day_deadline` smallint(6) NOT NULL DEFAULT 0,
  `day_deadline_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paylater_customers`
--

LOCK TABLES `paylater_customers` WRITE;
/*!40000 ALTER TABLE `paylater_customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `paylater_customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paylater_histories`
--

DROP TABLE IF EXISTS `paylater_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paylater_histories` (
  `id` char(26) NOT NULL,
  `debit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `description` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `next_payment` timestamp NULL DEFAULT NULL,
  `not_fullpayment_reason` varchar(255) DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `type` smallint(6) NOT NULL DEFAULT 0,
  `is_valid` smallint(6) NOT NULL DEFAULT 0,
  `image_prove` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paylater_histories`
--

LOCK TABLES `paylater_histories` WRITE;
/*!40000 ALTER TABLE `paylater_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `paylater_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paylater_tenor_histories`
--

DROP TABLE IF EXISTS `paylater_tenor_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paylater_tenor_histories` (
  `id` char(26) NOT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `day_deadline` smallint(6) DEFAULT NULL,
  `file_agreement` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paylater_tenor_histories`
--

LOCK TABLES `paylater_tenor_histories` WRITE;
/*!40000 ALTER TABLE `paylater_tenor_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `paylater_tenor_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` char(26) NOT NULL,
  `label` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES
('01H4GNT8YA2D3T5A8EM12RY8Y0','View Dashboard','view-dashboard',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y1','Create Admin','create-user',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y2','Update Admin','update-user',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y3','View Admin','view-user',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y4','Delete Admin','delete-user',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y5','Create Rule','create-role',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y6','Update Rule','update-role',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y7','View Rule','view-role',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y8','Delete Rule','delete-role',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Y9','Create Banner','create-banner',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YA','Update Banner','update-banner',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YB','View Banner','view-banner',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YC','Delete Banner','delete-banner',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YD','Create Info','create-info',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YE','Update Info','update-info',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YF','View Info','view-info',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YG','Delete Info','delete-info',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YH','Create Voucher','create-voucher',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YJ','Update Voucher','update-voucher',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YK','View Voucher','view-voucher',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YM','Delete Voucher','delete-voucher',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YN','Bulk Delete Voucher','bulk-delete-voucher',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YP','Create Customer','create-customer',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YQ','Update Customer','update-customer',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YR','View Customer','view-customer',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YS','Delete Customer','delete-customer',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YT','Update Customer Level','update-customer-level',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YV','View Customer Level','view-customer-level',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YW','Create Mitra','create-mitra',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YX','Update Mitra','update-mitra',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YY','View Mitra','view-mitra',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8YZ','Delete Mitra','delete-mitra',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z0','Update Limit Mitra','update-limit-mitra',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z1','Update Limit Tenor','update-limit-tenor',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z2','Create Pembayaran Hutang','create-paylater-repayment',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z3','Update Pembayaran Hutang','update-paylater-repayment',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z4','View Pembayaran Hutang','view-paylater-repayment',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z5','View Customer Verification','view-customer-verification',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z6','View Setting','view-setting',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z7','View Setting Payment Gatewat','view-setting-payment-gateway',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z8','View Setting Affilate','view-setting-affilate',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8Z9','View Deposit','view-deposit',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZA','Update Deposit','update-deposit',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZB','View Sale','view-sale',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZC','Create Poin Reward','create-poin-reward',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZD','Update Poin Reward','update-poin-reward',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZE','View Poin Reward','view-poin-reward',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZF','Delete Poin Reward','delete-poin-reward',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZG','Create Bank Account','create-account',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZH','Update Bank Account','update-account',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZJ','View Bank Account','view-account',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZK','Delete Bank Account','delete-account',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZM','Create Lokasi','create-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZN','Update Lokasi','update-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZP','View Lokasi','view-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZQ','Delete Lokasi','delete-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZR','Create Profile Lokasi','create-location-profile',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZS','Update Profile Lokasi','update-location-profile',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZT','View Profile Lokasi','view-location-profile',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZV','Delete Profile Lokasi','delete-location-profile',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZW','Create Deposit Lokasi','create-deposit-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZX','Update Deposit Lokasi','update-deposit-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZY','View Deposit Lokasi','view-deposit-location',NULL,NULL),
('01H4GNT8YA2D3T5A8EM12RY8ZZ','Delete Deposit Lokasi','delete-deposit-location',NULL,NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poin_histories`
--

DROP TABLE IF EXISTS `poin_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `poin_histories` (
  `id` char(26) NOT NULL,
  `debit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(20,2) NOT NULL DEFAULT 0.00,
  `description` varchar(255) DEFAULT NULL,
  `narration` text DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `related_type` varchar(255) DEFAULT NULL,
  `related_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poin_histories`
--

LOCK TABLES `poin_histories` WRITE;
/*!40000 ALTER TABLE `poin_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `poin_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poin_rewards`
--

DROP TABLE IF EXISTS `poin_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `poin_rewards` (
  `id` char(26) NOT NULL,
  `amount_buy` decimal(20,2) NOT NULL DEFAULT 0.00,
  `bonus_poin` decimal(20,2) NOT NULL DEFAULT 0.00,
  `customer_level_id` char(26) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poin_rewards`
--

LOCK TABLES `poin_rewards` WRITE;
/*!40000 ALTER TABLE `poin_rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `poin_rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `id` char(26) NOT NULL,
  `role_id` char(26) NOT NULL,
  `permission_id` char(26) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES
('01h4gnt8zzvbwn1my7renjtzxv','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y0','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt900b9398dh8mytxakbn','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y1','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt900b9398dh8mytxakbp','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y2','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt901sf47vbe9f0e265bp','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y3','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt902vr1qymfzemdwnr7z','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y4','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt902vr1qymfzemdwnr80','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y5','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt9034vr4j2hzs4cxpn4k','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y6','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt9041hpsw9519etqkmhn','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y7','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt906vc4s9bdqm4sz8dey','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y8','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt907nb063xtzktrmytxx','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Y9','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt907nb063xtzktrmytxy','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YA','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt908x3sr2jkex7tkgp0a','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YB','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90ay49wbqvw6vqsb74z','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YC','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90b7dzh1xwz93da7mzt','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YD','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90czqa1w3r7nwd1yvac','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YE','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90czqa1w3r7nwd1yvad','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YF','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90d2rcb9zb9m9bkh65v','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YG','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90ervgnw6v4aajwbhfq','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YH','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90f2ye3tpd20dnrrdqm','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YJ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90f2ye3tpd20dnrrdqn','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YK','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90gejrx0ygh9agyvvbr','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YM','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90h67bggj8qpek14dy1','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YN','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90jr9n9phxwb7mec4pz','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YP','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90kj751wdehn2d31kdf','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YQ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90mmzh553b4kpm1mwbm','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YR','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90nj4dcpxkk74tspgt5','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YS','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90py6k6mqzknpc7438t','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YT','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90qqhwv34ft2hc1dcnh','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YV','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90qqhwv34ft2hc1dcnj','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YW','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90sd7bwx06gtgntvwk8','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YX','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90sd7bwx06gtgntvwk9','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YY','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90v97sgr9nn0j60jrhh','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8YZ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90w9hkc6za9n3kh2gf0','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z0','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90x6483ambz6fmjyqsp','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z1','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90y1jpetb4rxw96c9s4','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z2','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90y1jpetb4rxw96c9s5','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z3','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt90z90w38ncd0vw34x9p','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z4','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt910am4gg6v0j9e074vq','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z5','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt910am4gg6v0j9e074vr','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z6','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt911cfhebztfees7g1p8','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z7','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt912bcjztezwhdb093qz','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z8','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt913xk78te47stmdtfyw','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8Z9','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt913xk78te47stmdtfyx','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZA','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt914k4ra965w5peaqh50','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZB','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt915e1rrmk573q09np10','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZC','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt915e1rrmk573q09np11','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZD','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91696fteh3ahszc0jpa','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZE','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt917ym42fgjqdbhwgy87','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZF','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91899dv0t4dt19xmaky','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZG','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91899dv0t4dt19xmakz','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZH','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt9199bry6b58m3gc8ppq','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZJ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91azyrn0fqfpe4qfpmf','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZK','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91bg3k606hs5hdr1re7','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZM','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91bg3k606hs5hdr1re8','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZN','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91c2hnkc8aegvxmyem0','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZP','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91dwztcr25raj97xef9','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZQ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91dwztcr25raj97xefa','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZR','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91ewfsbkm1bbn19qmd1','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZS','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91fcrmmva6vbwjqvaqn','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZT','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91fcrmmva6vbwjqvaqp','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZV','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91gcd93py3yvszx8dje','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZW','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91gcd93py3yvszx8djf','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZX','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91hvks1r7a3rt6gzxnr','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZY','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL),
('01h4gnt91je1p8jkww7k0nr4zw','01h4gnt8zs5r6py02pgfn0613h','01H4GNT8YA2D3T5A8EM12RY8ZZ','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` char(26) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES
('01h4gnt8zs5r6py02pgfn0613h','admin','2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_items` (
  `id` char(26) NOT NULL,
  `sale_id` char(26) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `entity_id` char(26) DEFAULT NULL,
  `price` decimal(20,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `additional_info_json` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_items`
--

LOCK TABLES `sale_items` WRITE;
/*!40000 ALTER TABLE `sale_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `id` char(26) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `customer_id` char(26) DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT NULL,
  `amount` decimal(20,2) NOT NULL DEFAULT 0.00,
  `payed_with` varchar(255) DEFAULT NULL,
  `payment_token` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `payment_response` varchar(255) DEFAULT NULL,
  `payment_channel` varchar(255) DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` char(26) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES
('01h4gnt8x4kvat2cxxt3f9btzr','OPEN_WEBSITE_NAME','Welcome to Voucher App','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8x5ap44y1xt3xkyhvb0','SHARE_TEXT','<p>Baru Beli Voucher nih</p>','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8x6ffyx17mc01yz9p4z','AFFILATE_ENABLED','0','checkbox',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8x7f9ns079ehdrv264n','AFFILATE_POIN_AMOUNT','0','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8x888kn2ypwtsvd6trc','AFFILATE_DOWNLINE_POIN_AMOUNT','0','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xa4m8bqvb0axwjnd2z','AFFILATE_SHARE_REFFERAL_CODE','Yuk daftar dapatkan bonus poin','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xc8jwpfbpc2w7ecvqv','AFFILATE_ALLOWED_LEVELS','[]','json',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xdfg5pqh368s4j67qt','MIDTRANS_SERVER_KEY','SB-Mid-server-UA0LQbY4aALV0CfLLX1v7xs8','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xeyy8xg7dwksh9m1a7','MIDTRANS_CLIENT_KEY','SB-Mid-client-xqqkspzoZOM10iUG','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xfvc8hecysbtweab3j','MIDTRANS_MERCHANT_ID','G561244367','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xge76qyz9dp2wj2858','MIDTRANS_LOGO','sample/midtrans_logo.png','image',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xheqj3bnh1smsj0j63','MIDTRANS_ENABLED','1','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xkh6e3f3g9wgtyw79f','MIDTRANS_ADMIN_FEE','2500','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xma0hbbnfakmy2s01s','ENABLE_CASH_DEPOSIT','1','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xn3r2s7q4v4mzb67hz','TEXT_CASH_DEPOSIT','Setor Tunai di Kantor WBB','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xn3r2s7q4v4mzb67j0','ADMINFEE_CASH_DEPOSIT','1000','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xpys4nqaycd98cxvvk','ENABLE_MANUAL_TRANSFER','1','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xqed1tamtmtr93fby0','ADMINFEE_MANUAL_TRANSFER','2500','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xs0mzjswx2q0gnetf2','MAX_MANUAL_TRANSFER_TIMEOUT','2','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xtpw4vrest39jpm4nz','MANUAL_TRANSFER_OPEN_HOUR','00:00','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xw0m5j0xykj4ks59dx','MANUAL_TRANSFER_CLOSE_HOUR','23:59','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59'),
('01h4gnt8xxhf7wssg7v64qvse3','MAX_POINT_EXPIRED','90','text',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` char(26) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `role_id` char(26) DEFAULT NULL,
  `phone_wa` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
('01h4gnt93cajeba5s7enjfyq59','Super Administrator','root@admin.com',NULL,'$2y$10$7hpo61w4JQR4hD/X5vXOEO5fe6zas8/esT4/dkspM5erbhMC4h.tu',NULL,NULL,'81325307692','sample/logo-jago.png','root',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL),
('01h4gnt953x566pt7bq752pd1t','Administator','admin@admin.com',NULL,'$2y$10$5/YkaGN/E6GWvJm5yI98o.UGN0A9L4bJ5FO5Il1QFZKuAiAK4kUO6',NULL,'01h4gnt8zs5r6py02pgfn0613h','81325307692','sample/logo-jago.png','admin',NULL,'2023-07-04 21:44:59','2023-07-04 21:44:59',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vouchers` (
  `id` char(26) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `location_profile_id` char(26) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `quota` varchar(255) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `is_sold` smallint(6) NOT NULL DEFAULT 0,
  `additional_json` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` char(26) DEFAULT NULL,
  `updated_by` char(26) DEFAULT NULL,
  `deleted_by` char(26) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-04 14:47:42
