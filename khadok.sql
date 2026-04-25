-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 27, 2025 at 01:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `khadok`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'sadik', 'sadik@gmail.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `consumer_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stakeholder_id` int(10) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `consumer_id`, `item_id`, `quantity`, `added_at`, `updated_at`, `stakeholder_id`, `item_name`, `item_price`) VALUES
(33, 1, 23, 2, '2025-01-23 15:41:11', '2025-01-26 19:03:21', 3437, 'Chicken Cheese Burger ', 500.00),
(42, 0, 24, 1, '2025-01-26 23:25:47', '2025-01-26 23:25:47', 3437, 'lemon tea', 123.00);

-- --------------------------------------------------------

--
-- Table structure for table `consumer`
--

CREATE TABLE `consumer` (
  `consumer_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumer`
--

INSERT INTO `consumer` (`consumer_id`, `name`, `email`, `password`, `phone_number`) VALUES
(0, 'sadik ', 'sadik@gmail.com', '$2b$10$69VuL2QoXHvmHZs.MIAD3u84AT7BU4JtHwj6Y9xIAvs1qIPan.7/q', '01937890430'),
(1, 'sorol', 'sorol@gmail.com', '$2b$10$tmLEacmAUFE.WcuMjz121uMsK8P7VOiQWoffz2pmzwF4UuM2CMAsu', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `consumer_location`
--

CREATE TABLE `consumer_location` (
  `consumer_id` int(11) NOT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `delivery_id` int(11) NOT NULL,
  `consumer_id` int(11) DEFAULT NULL,
  `rider_id` int(11) DEFAULT NULL,
  `delivery_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery`
--

INSERT INTO `delivery` (`delivery_id`, `consumer_id`, `rider_id`, `delivery_date`, `status`, `total_amount`) VALUES
(3, 0, 0, '2025-01-27 00:27:46', 'pending', 123.00);

-- --------------------------------------------------------

--
-- Table structure for table `dine_in`
--

CREATE TABLE `dine_in` (
  `dine_in_id` int(11) NOT NULL,
  `consumer_id` int(11) DEFAULT NULL,
  `stakeholder_id` int(11) DEFAULT NULL,
  `table_size` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `message` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dine_in`
--

INSERT INTO `dine_in` (`dine_in_id`, `consumer_id`, `stakeholder_id`, `table_size`, `quantity`, `booking_date`, `booking_time`, `status`, `message`) VALUES
(8, 0, 3437, 2, 1, '2025-01-30', '08:38:00', 'complete', '2ew'),
(9, 0, 3437, 2, 5, '2025-01-29', '22:25:00', 'complete', 'book');

-- --------------------------------------------------------

--
-- Table structure for table `interior`
--

CREATE TABLE `interior` (
  `interior_id` int(11) NOT NULL,
  `stakeholder_id` int(11) DEFAULT NULL,
  `table_type` enum('2','4','8','16','5') DEFAULT NULL,
  `availability` int(10) DEFAULT 1,
  `picture` varchar(255) DEFAULT NULL,
  `bookable` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interior`
--

INSERT INTO `interior` (`interior_id`, `stakeholder_id`, `table_type`, `availability`, `picture`, `bookable`) VALUES
(13, 3437, '4', 5, NULL, 5),
(14, 3437, '2', 10, NULL, 10),
(15, 3437, '5', 3, NULL, 3),
(16, 3437, '8', 3, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `interior_pic`
--

CREATE TABLE `interior_pic` (
  `pic_id` int(10) NOT NULL,
  `stakeholder_id` int(10) NOT NULL,
  `pic` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interior_pic`
--

INSERT INTO `interior_pic` (`pic_id`, `stakeholder_id`, `pic`) VALUES
(14, 3437, '1737556042657-680349713-shot-panoramic-composition-bedroom.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `stakeholder_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `item_price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `item_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `stakeholder_id`, `item_name`, `category`, `item_price`, `description`, `item_picture`) VALUES
(1, 3435, 'burger', '', 100.00, 'delicious', NULL),
(2, 3435, 'pizza', '', 200.00, 'yummy', NULL),
(6, 12, 'fries', '', 80.00, 'yum', NULL),
(7, 3435, 'fries', 'Appetizer', 50.00, 'crisp', NULL),
(13, 3435, 'coffee', 'Beverage', 20.00, 'cold coffee', NULL),
(19, 3438, 'lemon tea', 'tea', 234.00, 'dftr', NULL),
(20, 3438, 'uhiuh', 'kjgh', 151.00, 'jib', NULL),
(22, 3437, 'chocolate coffee', 'Coffee', 234.00, 'yum', '1735968483421-536851220-pexels-chevanon-312418.jpg'),
(23, 3437, 'Chicken Cheese Burger ', 'Burger', 500.00, 'Triple Patty Chicken Burger', '1735992188685-852497590-pexels-myfoodie-2702674.jpg'),
(24, 3437, 'lemon tea', 'Tea', 123.00, 'lemon ginger tea ', '1735992449219-51224287-pexels-mareefe-1638280.jpg'),
(25, 3437, 'Four Season Pizza', 'Pizza', 550.00, '12 inch Pizza with shredded mozzarella cheese  ', '1735996011097-483631314-pexels-catscoming-367915.jpg'),
(26, 3437, 'Beef Cheese Taco', 'Taco', 420.00, 'Yummy beef steak taco', '1735996978037-214337940-pexels-chitokan-2092507.jpg'),
(27, 3437, 'BBQ Chicken Burger', 'Burger', 480.00, 'Burger with special BBQ sauce ', '1735999076309-701329842-pexels-david-geib-1265112-3220617.jpg'),
(28, 3437, 'Chicken Sandwich ', 'Sandwhich', 220.00, 'yum', '1736012395834-229192332-pexels-erin-wang-385309-1647163.jpg'),
(29, 3437, 'Masala Tea', 'tea', 150.00, 'Yum', '1737353941091-75282520-pexels-juliasakelli-905485.jpg'),
(30, 3437, 'Beef Cheese Burger', 'Burger', 550.00, 'Yumm', '1737376888650-50902712-pexels-valeriya-580612.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `stakeholder_id` int(10) NOT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `consumer_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `stakeholder_id`, `menu_id`, `consumer_id`, `order_date`, `status`, `total_amount`) VALUES
(19, 3437, NULL, 0, '2025-01-27 00:27:46', 'pending', 123.00);

-- --------------------------------------------------------

--
-- Table structure for table `pickup`
--

CREATE TABLE `pickup` (
  `pickup_id` int(11) NOT NULL,
  `consumer_id` int(11) DEFAULT NULL,
  `pickup_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `stakeholder_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pickup`
--

INSERT INTO `pickup` (`pickup_id`, `consumer_id`, `pickup_date`, `status`, `total_amount`, `stakeholder_id`) VALUES
(4, 0, '2025-01-26 19:42:34', 'pending', 1550.00, 3437),
(7, 0, '2025-01-26 23:24:27', 'pending', 246.00, 3437);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `consumer_id` int(11) DEFAULT NULL,
  `stakeholder_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rider`
--

CREATE TABLE `rider` (
  `rider_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rider`
--

INSERT INTO `rider` (`rider_id`, `name`, `email`, `password`, `phone_number`) VALUES
(0, 'sorol', 'sorol@gmail.com', '$2b$10$gqe2tV6p0ZFoET9eyrGqQ.AIfDoagrkmquZtzERwIMHq14g1M/yLm', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rider_location`
--

CREATE TABLE `rider_location` (
  `rider_id` int(11) NOT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('consumer','stakeholder','rider') NOT NULL,
  `login_time` datetime NOT NULL,
  `logout_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`session_id`, `user_id`, `user_type`, `login_time`, `logout_time`) VALUES
(330737, 3437, 'stakeholder', '2025-01-16 07:03:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(255) NOT NULL,
  `expires` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stakeholder`
--

CREATE TABLE `stakeholder` (
  `stakeholder_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `restaurant_name` varchar(100) DEFAULT NULL,
  `ratings` float DEFAULT NULL,
  `area` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stakeholder`
--

INSERT INTO `stakeholder` (`stakeholder_id`, `name`, `email`, `password`, `restaurant_name`, `ratings`, `area`, `address`, `picture`) VALUES
(0, 'sorol', 'sorol@gmail.com', '$2b$10$9LW/gBizwvhLbTiEIkRKsuAMngHzYieoNAXaFoZMiITaP2nBrV3Sy', '22s', NULL, NULL, NULL, NULL),
(12, 'rtrt', 'w@gmail.com', '123', 'Khanas', 4.7, NULL, NULL, NULL),
(20, 'dfdf', 'swe2@gmail.com', '123', 'Chillox', 5, NULL, NULL, NULL),
(2444, 'erw', 'd4@gmail.com', '123', 'Chick Fill A', 3.3, NULL, NULL, NULL),
(3434, 'erw', 'd@gmail.com', '123', 'Kudos', 3.2, NULL, NULL, NULL),
(3435, 'sadik ', 'sadik@gmail.com', '123', 'Chill', 0, NULL, NULL, NULL),
(3436, 'sadik2 ', 'sad@gmail.com', '$2y$10$tTrmmE0qKPXindmZnjbYouxjbmenPFqkoo9SAUQ5zJrfWFRITZLQO', 'In N Out', 0, NULL, NULL, NULL),
(3437, 'sadik2 ', 'sadik2@gmail.com', '$2b$10$er4oxY1ClwmB2YBeiAdz.uGy8yUcYCVrx3oEDNorXo9/aawVyPYBO', '23ss2', NULL, 'shonir akhra', '4/1, Gobindapur Bajar, Shonir Akhra, Jatrabari', NULL),
(3438, 'Sadik Mahmud ', 's@gmail.com', '$2b$10$qN8ZLNfhNxZSewWwSdfgn.gIc8PcFWReMwO.1wRzfgve97S2FO45q', 'XYZ', NULL, NULL, NULL, NULL),
(3439, 'erer', 's2@gmail.com', '$2b$10$i9qTGwjBycgc.ahdJ2t8wuE9nghvV6P7YDe/mdJQ/GVmT8OaSEVuK', '3633', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stakeholder_location`
--

CREATE TABLE `stakeholder_location` (
  `stakeholder_id` int(11) NOT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `cart_ibfk_3` (`stakeholder_id`);

--
-- Indexes for table `consumer`
--
ALTER TABLE `consumer`
  ADD PRIMARY KEY (`consumer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `consumer_location`
--
ALTER TABLE `consumer_location`
  ADD PRIMARY KEY (`consumer_id`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`delivery_id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `rider_id` (`rider_id`);

--
-- Indexes for table `dine_in`
--
ALTER TABLE `dine_in`
  ADD PRIMARY KEY (`dine_in_id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `stakeholder_id` (`stakeholder_id`);

--
-- Indexes for table `interior`
--
ALTER TABLE `interior`
  ADD PRIMARY KEY (`interior_id`),
  ADD KEY `stakeholder_id` (`stakeholder_id`);

--
-- Indexes for table `interior_pic`
--
ALTER TABLE `interior_pic`
  ADD PRIMARY KEY (`pic_id`),
  ADD KEY `for_key1` (`stakeholder_id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`),
  ADD KEY `stakeholder_id` (`stakeholder_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `pickup`
--
ALTER TABLE `pickup`
  ADD PRIMARY KEY (`pickup_id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `for_ke2` (`stakeholder_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `stakeholder_id` (`stakeholder_id`);

--
-- Indexes for table `rider`
--
ALTER TABLE `rider`
  ADD PRIMARY KEY (`rider_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `rider_location`
--
ALTER TABLE `rider_location`
  ADD PRIMARY KEY (`rider_id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `stakeholder`
--
ALTER TABLE `stakeholder`
  ADD PRIMARY KEY (`stakeholder_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `stakeholder_location`
--
ALTER TABLE `stakeholder_location`
  ADD PRIMARY KEY (`stakeholder_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dine_in`
--
ALTER TABLE `dine_in`
  MODIFY `dine_in_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `interior`
--
ALTER TABLE `interior`
  MODIFY `interior_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `interior_pic`
--
ALTER TABLE `interior_pic`
  MODIFY `pic_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `pickup`
--
ALTER TABLE `pickup`
  MODIFY `pickup_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menu` (`menu_id`),
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `consumer_location`
--
ALTER TABLE `consumer_location`
  ADD CONSTRAINT `consumer_location_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`);

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`),
  ADD CONSTRAINT `delivery_ibfk_2` FOREIGN KEY (`rider_id`) REFERENCES `rider` (`rider_id`);

--
-- Constraints for table `dine_in`
--
ALTER TABLE `dine_in`
  ADD CONSTRAINT `dine_in_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`),
  ADD CONSTRAINT `dine_in_ibfk_2` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `interior`
--
ALTER TABLE `interior`
  ADD CONSTRAINT `interior_ibfk_1` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `interior_pic`
--
ALTER TABLE `interior_pic`
  ADD CONSTRAINT `for_key1` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);

--
-- Constraints for table `pickup`
--
ALTER TABLE `pickup`
  ADD CONSTRAINT `for_ke2` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`),
  ADD CONSTRAINT `pickup_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`consumer_id`) REFERENCES `consumer` (`consumer_id`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);

--
-- Constraints for table `rider_location`
--
ALTER TABLE `rider_location`
  ADD CONSTRAINT `rider_location_ibfk_1` FOREIGN KEY (`rider_id`) REFERENCES `rider` (`rider_id`);

--
-- Constraints for table `stakeholder_location`
--
ALTER TABLE `stakeholder_location`
  ADD CONSTRAINT `stakeholder_location_ibfk_1` FOREIGN KEY (`stakeholder_id`) REFERENCES `stakeholder` (`stakeholder_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
