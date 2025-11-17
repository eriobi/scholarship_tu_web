-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2025 at 11:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `adm_name` varchar(50) NOT NULL,
  `adm_lastname` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_id`, `user_id`, `adm_name`, `adm_lastname`, `created_at`, `updated_at`) VALUES
(1, 1, 'สิริมา', 'กวีวัฒนากูร', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `admin_message`
--

CREATE TABLE `admin_message` (
  `adm_mes_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `mes_title` varchar(255) NOT NULL,
  `mes_desp` varchar(225) NOT NULL,
  `mes_status` varchar(225) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification`
--

CREATE TABLE `admin_notification` (
  `adm_noti_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `noti_type` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookmark`
--

CREATE TABLE `bookmark` (
  `bookmark_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `scho_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmark`
--

INSERT INTO `bookmark` (`bookmark_id`, `student_id`, `scho_id`, `is_active`, `created_at`, `updated_at`) VALUES
(64, 680741145, 8, 1, '2025-11-17 15:24:50', '2025-11-17 15:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `dab_id` int(11) NOT NULL,
  `std_id` int(11) NOT NULL,
  `scho_id` int(11) NOT NULL,
  `enroll_id` int(11) NOT NULL,
  `std_all_total` int(100) NOT NULL,
  `std_1_total` int(100) NOT NULL,
  `std_2_total` int(100) NOT NULL,
  `std_3_total` int(100) NOT NULL,
  `std_4_total` int(100) NOT NULL,
  `std_no_scho` int(100) NOT NULL,
  `rate` decimal(3,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enroll`
--

CREATE TABLE `enroll` (
  `enroll_id` int(11) NOT NULL,
  `std_id` int(11) NOT NULL,
  `scho_id` int(11) NOT NULL,
  `qua_id` int(11) NOT NULL,
  `enroll_status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ตารางเริ่มรับสมัครทุน';

--
-- Dumping data for table `enroll`
--

INSERT INTO `enroll` (`enroll_id`, `std_id`, `scho_id`, `qua_id`, `enroll_status`, `created_at`, `updated_at`) VALUES
(6, 680741145, 8, 5, 1, '2025-11-14 18:51:05', '2025-11-14 18:51:05');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_id` int(11) NOT NULL,
  `news_title` varchar(255) DEFAULT NULL,
  `news_content` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `news_title`, `news_content`, `created_at`, `updated_at`, `is_active`) VALUES
(16, 'test ', 'ประกาศ', '2025-11-05 06:27:48', '2025-11-05 06:27:48', 1),
(17, 'test 2', 'สวัสดี', '2025-11-05 06:30:01', '2025-11-05 07:15:53', 1);

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

CREATE TABLE `qualification` (
  `qua_id` int(11) NOT NULL,
  `std_year` int(1) UNSIGNED NOT NULL,
  `std_gpa` decimal(3,2) UNSIGNED NOT NULL,
  `std_income` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`qua_id`, `std_year`, `std_gpa`, `std_income`) VALUES
(5, 2, 3.00, '0'),
(6, 1, 3.50, '100000');

-- --------------------------------------------------------

--
-- Table structure for table `scholarship_info`
--

CREATE TABLE `scholarship_info` (
  `scholarship_id` int(11) NOT NULL,
  `scho_name` varchar(50) NOT NULL,
  `scho_year` int(1) NOT NULL,
  `qualification` int(11) NOT NULL,
  `scho_type` varchar(20) NOT NULL COMMENT 'ทุนเหมาจ่ายหรือทุนระยะยาว',
  `scho_source` varchar(20) NOT NULL COMMENT 'ทุนภายในหรือทุนภายนอก',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `scho_desp` varchar(255) NOT NULL,
  `image_file` varchar(255) DEFAULT NULL,
  `scho_file` varchar(500) DEFAULT NULL COMMENT 'file_path',
  `is_active` tinyint(1) NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship_info`
--

INSERT INTO `scholarship_info` (`scholarship_id`, `scho_name`, `scho_year`, `qualification`, `scho_type`, `scho_source`, `start_date`, `end_date`, `scho_desp`, `image_file`, `scho_file`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(8, 'ทุน test', 2568, 5, 'ทุนระยะยาว', 'ทุนภายใน', '2025-11-13', '2025-11-26', 'test ', '1763109390034-CSTU.png', '1763108548048-Screenshot 2025-05-07 065504.pdf', 1, 0, '2025-11-12 08:46:07', '2025-11-17 07:47:01'),
(9, 'ทุนจำปา', 2568, 6, 'ทุนเหมาจ่าย', 'ทุนภายนอก', '2025-11-19', '2025-11-29', 'มีจิตอาสา', NULL, '', 1, 0, '2025-11-12 10:23:00', '2025-11-12 10:23:00');

-- --------------------------------------------------------

--
-- Table structure for table `std_notification`
--

CREATE TABLE `std_notification` (
  `std_noti_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `std_noti_type` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `std_name` varchar(30) NOT NULL,
  `std_lastname` varchar(30) NOT NULL,
  `std_year` int(2) UNSIGNED NOT NULL,
  `std_gpa` decimal(3,2) NOT NULL,
  `std_income` int(10) UNSIGNED NOT NULL,
  `Bookmark` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_id`, `user_id`, `std_name`, `std_lastname`, `std_year`, `std_gpa`, `std_income`, `Bookmark`, `created_at`, `updated_at`) VALUES
(680741145, 2, 'กิติยาวี', 'ส่องแสง', 2, 3.25, 0, 0, '0000-00-00 00:00:00', '2025-11-14 18:22:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) NOT NULL,
  `decryption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `line_id` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role`, `email`, `password`, `decryption`, `line_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'sirima.kav@gmail.com', '$2b$10$Nbtr29E0.o94jbgjvn01Y.rzkFg0K.s9DkRAI/nVCkXdOModJXD.m', '', '', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'student', 'daw@gmail.com', '$2b$10$hVcmpvMHF5638HHqPLX.KuFhayc3h.J3sYQQhB./iqukTSbmWYSNW', '', '', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users_session`
--

CREATE TABLE `users_session` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_session`
--

INSERT INTO `users_session` (`session_id`, `user_id`, `token`, `is_active`, `created_at`, `updated_at`) VALUES
(11, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYwNDkxOTg4LCJleHAiOjE3NjA1MDI3ODh9.kCm8IYVxZitR5_1eDw_XSQuWT8CaACD0FZAJev6lIeY', 1, '2025-10-15 08:33:08', '2025-10-15 01:33:08'),
(12, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYwNDk0MDY3LCJleHAiOjE3NjA1MDQ4Njd9.LlSpl4DH_4vpYxbciROq11w5H0-xVXf0JuiZ3fiEYaI', 1, '2025-10-15 09:07:47', '2025-10-15 02:07:47'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYwNTgyMDg1LCJleHAiOjE3NjA1OTI4ODV9.oOJ5UAxStw_6mCWI2hFUjs9SSTo6nsM8Cy6suuZAlRI', 1, '2025-10-16 09:34:45', '2025-10-16 02:34:45'),
(14, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYwNzQ2ODQwLCJleHAiOjE3NjA3NTc2NDB9.M1Ud0_stnZySxy0eSSMpDtFfu1xjDQjJEc0fN1HhOTs', 1, '2025-10-18 07:20:40', '2025-10-18 00:20:40'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYyMTU1NDU5LCJleHAiOjE3NjIxNjYyNTl9._IOGuMeEZ8w2CAd_qNL3ic6rb8QhshmmDmgxmwC5oj4', 1, '2025-11-03 14:37:39', '2025-11-03 07:37:39'),
(16, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYyMjk4Njc1LCJleHAiOjE3NjIzMDIyNzV9.ZcH9vlOi4foB7oAQbk9qc4I_DklsTLTt9DA67PLNeYM', 1, '2025-11-05 06:24:35', '2025-11-04 23:24:35'),
(17, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjIzMDE4NjAsImV4cCI6MTc2MjMwNTQ2MH0.bV6QtB60P2ATLBaNWGQnowyUgtw-ZE2a62VdZj4ke1s', 1, '2025-11-05 07:17:40', '2025-11-05 00:17:40'),
(18, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYyMzA1MTkxLCJleHAiOjE3NjIzMDg3OTF9.Fr1ktxLZNaF3tfQnVFSY3kjLayZy_x6PPHHEYjrjgbY', 1, '2025-11-05 08:13:11', '2025-11-05 01:13:11'),
(19, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjIzMDUyMTUsImV4cCI6MTc2MjMwODgxNX0.CI9mSX9cBrUXh_PDHVlECYopHlOVQFhaiFJNojsIN9c', 1, '2025-11-05 08:13:35', '2025-11-05 01:13:35'),
(20, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYyOTAxNDkxLCJleHAiOjE3NjI5MDUwOTF9.m2EV6kRZ_LZSR4MBgQwZU1dS0WVX9OBLEGza2Orf-XQ', 1, '2025-11-12 05:51:31', '2025-11-11 22:51:31'),
(21, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjI5MTc3OTksImV4cCI6MTc2MjkyMTM5OX0.SSdMiapZhlskfdf2cbRO9lP8HpsVl63No-0AWq3r-Xc', 1, '2025-11-12 10:23:19', '2025-11-12 03:23:19'),
(22, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYyOTE4MDk3LCJleHAiOjE3NjI5MjE2OTd9.IJBWkEfbVANeDPB28CAI8jANU0mL9lAh7ceJ8qhJWWc', 1, '2025-11-12 10:28:17', '2025-11-12 03:28:17'),
(23, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjI5MTgxOTUsImV4cCI6MTc2MjkyMTc5NX0.1xfGvlvtrdxSoeaGdtOYZcrZfidhqhAJX9kzMbwai9E', 1, '2025-11-12 10:29:55', '2025-11-12 03:29:55'),
(24, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDU1MzMsImV4cCI6MTc2MzAwOTEzM30.hojblcJZ01Y-F685zz5pJlXluyLnPGzE5LBI7ZSYJeY', 1, '2025-11-13 10:45:33', '2025-11-13 03:45:33'),
(25, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDU1NDQsImV4cCI6MTc2MzAwOTE0NH0.rSjTnzb_3B-aZaj8uwWh7k5fE7YgsIQTigU2Ofjj3Z8', 1, '2025-11-13 10:45:44', '2025-11-13 03:45:44'),
(26, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDU2OTIsImV4cCI6MTc2MzAwOTI5Mn0.jtPgcVBXUEQj_BxG_uwP04r-x_SpmE_o1Q9uerylpbU', 1, '2025-11-13 10:48:12', '2025-11-13 03:48:12'),
(27, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDU5NzUsImV4cCI6MTc2MzAwOTU3NX0.FxL5OjSelS5jTRMXH8_D7eEudhPbjF3HXRLn9epLkhY', 1, '2025-11-13 10:52:55', '2025-11-13 03:52:55'),
(28, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDYxMDgsImV4cCI6MTc2MzAwOTcwOH0.j1Qby9G5ZOrj2b30v2cMg1VirtXKwY3XsPWN1Eb_7_4', 1, '2025-11-13 10:55:08', '2025-11-13 03:55:08'),
(29, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMDYxNDUsImV4cCI6MTc2MzAwOTc0NX0.UaoH_RCzIZDfrgJvz23KrwsWVN_9qVaQkYuE3fI9JPc', 1, '2025-11-13 10:55:45', '2025-11-13 03:55:45'),
(30, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYzMDA2MTY0LCJleHAiOjE3NjMwMDk3NjR9.YJ2qoVorjysKXMaPhLztKh3oAm8Gp5ZmiNSfiLsMgTo', 1, '2025-11-13 10:56:04', '2025-11-13 03:56:04'),
(31, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMwMjQ4MDUsImV4cCI6MTc2MzYyOTYwNX0.m7oQRenXruTrZONivjPd100V6dhJP750fVZSpZXKL94', 1, '2025-11-13 16:06:45', '2025-11-13 09:06:45'),
(32, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYzMDkxMTkyLCJleHAiOjE3NjM2OTU5OTJ9.JekFtIM2RAqKfVwfkaCUPoflcs5HQSHNl8QLIreGpyI', 1, '2025-11-14 10:33:12', '2025-11-14 03:33:12'),
(33, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMxMTg4MjUsImV4cCI6MTc2MzcyMzYyNX0.xkCe0EJPGKJ6JoopQ9VOLTT-eZwYmfI0SaaJCZLGXuM', 1, '2025-11-14 18:13:45', '2025-11-14 11:13:45'),
(34, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMxMjA3NTUsImV4cCI6MTc2MzcyNTU1NX0.Uactnro7RJIdN1m87ZeB1LpR0GjHzaZlMfsbObPRZLI', 1, '2025-11-14 18:45:55', '2025-11-14 11:45:55'),
(35, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImRhd0BnbWFpbC5jb20iLCJpYXQiOjE3NjMzNTk3ODgsImV4cCI6MTc2Mzk2NDU4OH0.xh9Xm7nnKU1IFxEPbJDTbHYPn-69r3eR8KoPY93Uas4', 1, '2025-11-17 13:09:48', '2025-11-17 06:09:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_id`),
  ADD KEY `User_id` (`user_id`);

--
-- Indexes for table `admin_message`
--
ALTER TABLE `admin_message`
  ADD PRIMARY KEY (`adm_mes_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `admin_notification`
--
ALTER TABLE `admin_notification`
  ADD PRIMARY KEY (`adm_noti_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `admin_notification_ibfk_3` (`student_id`);

--
-- Indexes for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD PRIMARY KEY (`bookmark_id`),
  ADD KEY `Student_id` (`student_id`),
  ADD KEY `scho_id` (`scho_id`);

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`dab_id`),
  ADD KEY `std_id` (`std_id`),
  ADD KEY `scho_id` (`scho_id`),
  ADD KEY `enroll_id` (`enroll_id`);

--
-- Indexes for table `enroll`
--
ALTER TABLE `enroll`
  ADD PRIMARY KEY (`enroll_id`),
  ADD KEY `std_id` (`std_id`),
  ADD KEY `scho_id` (`scho_id`),
  ADD KEY `qua_id` (`qua_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`);

--
-- Indexes for table `qualification`
--
ALTER TABLE `qualification`
  ADD PRIMARY KEY (`qua_id`),
  ADD KEY `qua_id` (`qua_id`);

--
-- Indexes for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  ADD PRIMARY KEY (`scholarship_id`),
  ADD KEY `qualification` (`qualification`);

--
-- Indexes for table `std_notification`
--
ALTER TABLE `std_notification`
  ADD PRIMARY KEY (`std_noti_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_id`),
  ADD UNIQUE KEY `std_id` (`std_id`),
  ADD KEY `User_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_session`
--
ALTER TABLE `users_session`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `session_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_message`
--
ALTER TABLE `admin_message`
  MODIFY `adm_mes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_notification`
--
ALTER TABLE `admin_notification`
  MODIFY `adm_noti_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookmark`
--
ALTER TABLE `bookmark`
  MODIFY `bookmark_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `dab_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enroll`
--
ALTER TABLE `enroll`
  MODIFY `enroll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `qualification`
--
ALTER TABLE `qualification`
  MODIFY `qua_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `std_notification`
--
ALTER TABLE `std_notification`
  MODIFY `std_noti_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users_session`
--
ALTER TABLE `users_session`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `admin_message`
--
ALTER TABLE `admin_message`
  ADD CONSTRAINT `admin_message_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`Admin_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admin_notification`
--
ALTER TABLE `admin_notification`
  ADD CONSTRAINT `admin_notification_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`Admin_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admin_notification_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD CONSTRAINT `bookmark_std` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scho_id` FOREIGN KEY (`scho_id`) REFERENCES `scholarship_info` (`scholarship_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `dashboard_ibfk_2` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `dashboard_ibfk_3` FOREIGN KEY (`scho_id`) REFERENCES `scholarship_info` (`scholarship_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `enroll` FOREIGN KEY (`enroll_id`) REFERENCES `enroll` (`enroll_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enroll`
--
ALTER TABLE `enroll`
  ADD CONSTRAINT `enroll_ibfk_3` FOREIGN KEY (`scho_id`) REFERENCES `scholarship_info` (`scholarship_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `qua_id` FOREIGN KEY (`qua_id`) REFERENCES `qualification` (`qua_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `std_id` FOREIGN KEY (`std_id`) REFERENCES `student` (`std_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  ADD CONSTRAINT `fk_scholarship_qualification` FOREIGN KEY (`qualification`) REFERENCES `qualification` (`qua_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `std_notification`
--
ALTER TABLE `std_notification`
  ADD CONSTRAINT `std_notification_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`std_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_session`
--
ALTER TABLE `users_session`
  ADD CONSTRAINT `session_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
