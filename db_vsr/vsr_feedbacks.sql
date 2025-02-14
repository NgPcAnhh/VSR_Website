CREATE DATABASE  IF NOT EXISTS `vsr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vsr`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vsr
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL,
  `gmail` varchar(255) NOT NULL,
  `feedbacks` text NOT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,'katokid7@gmail.com','great app','2025-01-22 15:39:56'),(2,'timekiller0408@gmail.com','great app','2025-01-22 15:43:12'),(3,'timekiller0408@gmail.com','timekiller0408@gmail.com','2025-01-22 15:43:54'),(4,'timekiller0408@gmail.com','timekiller0408@gmail.com','2025-01-22 15:45:59'),(5,'timekiller0408@gmail.com','hello world','2025-01-22 15:50:28'),(6,'timekiller0408@gmail.com','hello world','2025-01-22 15:50:30'),(7,'timekiller0408@gmail.com','hello','2025-01-22 15:52:46'),(8,'timekiller0408@gmail.com','hello world','2025-01-22 16:53:24');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-14 21:49:44
