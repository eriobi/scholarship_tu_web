-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2025 at 05:56 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

CREATE TABLE `qualification` (
  `qua_id` int(11) NOT NULL,
  `std_year` int(1) UNSIGNED NOT NULL,
  `std_gpa` decimal(3,2) UNSIGNED NOT NULL,
  `std_income` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`qua_id`, `std_year`, `std_gpa`, `std_income`) VALUES
(3, 2, 3.00, 0),
(4, 2, 3.00, 0);

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
  `scho_desp` varchar(50) NOT NULL,
  `scho_file` varchar(500) NOT NULL COMMENT 'file_path',
  `is_active` tinyint(1) NOT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarship_info`
--

INSERT INTO `scholarship_info` (`scholarship_id`, `scho_name`, `scho_year`, `qualification`, `scho_type`, `scho_source`, `start_date`, `end_date`, `scho_desp`, `scho_file`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 'ทุนจำปา', 2568, 0, 'ทุนเหมาจ่าย', 'ทุนภายนอก', '2025-12-01', '2025-12-10', 'ทุนเพื่อนักศึกษาที่ขาดแคลนทุนทรัพย์', '', 1, 0, '2025-10-15 09:40:35', '2025-10-24 12:34:20'),
(5, 'ทุน testupdate', 2568, 0, 'ทุนเหมาจ่าย', 'ทุนภายนอก', '2025-10-08', '2025-10-22', 'อัปเดตคำอธิบาย', '', 1, 0, '2025-10-18 11:43:05', '2025-10-28 07:49:53'),
(6, 'ทุน delete', 2568, 3, 'ทุนระยะยาว', 'ทุนภายนอก', '2025-10-18', '2025-10-30', '', '', 1, 0, '2025-10-28 08:12:51', '2025-10-28 08:12:51');

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
(680741145, 2, 'กิติยาวี', 'ส่องแสง', 2, 2.47, 0, 0, '0000-00-00 00:00:00', '2025-10-19 14:18:56');

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
(14, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InNpcmltYS5rYXZAZ21haWwuY29tIiwiaWF0IjoxNzYwNzQ2ODQwLCJleHAiOjE3NjA3NTc2NDB9.M1Ud0_stnZySxy0eSSMpDtFfu1xjDQjJEc0fN1HhOTs', 1, '2025-10-18 07:20:40', '2025-10-18 00:20:40');

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
  MODIFY `bookmark_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `dab_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enroll`
--
ALTER TABLE `enroll`
  MODIFY `enroll_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `qualification`
--
ALTER TABLE `qualification`
  MODIFY `qua_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `scholarship_info`
--
ALTER TABLE `scholarship_info`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
