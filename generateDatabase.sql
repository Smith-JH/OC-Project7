-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema project7app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema project7app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `project7app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `project7app` ;

-- -----------------------------------------------------
-- Table `project7app`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project7app`.`Users` (
  `UserID` VARCHAR(64) NOT NULL DEFAULT(uuid()),
  `Username` VARCHAR(15) NOT NULL,
  `Email` VARCHAR(320) CHARACTER SET 'utf8' NOT NULL,
  `Password` CHAR(60) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `Username` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `Email` (`Email` ASC) VISIBLE,
  UNIQUE INDEX `UserID_UNIQUE` (`UserID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `project7app`.`Posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project7app`.`Posts` (
  `PostID` VARCHAR(64) NOT NULL DEFAULT(uuid()),
  `UserID` VARCHAR(64) NOT NULL,
  `Title` TEXT NOT NULL,
  `Text` TEXT NOT NULL,
  `DateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PostID`),
  UNIQUE INDEX `PostID_UNIQUE` (`PostID` ASC) VISIBLE,
  INDEX `posts_ibfk_1` (`UserID` ASC) VISIBLE,
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `project7app`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `project7app`.`Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project7app`.`Comments` (
  `CommentID` INT NOT NULL AUTO_INCREMENT,
  `ParentID` INT NOT NULL DEFAULT '0',
  `ReplyTo` VARCHAR(15) NULL,
  `Comment` TEXT NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  `PostID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`CommentID`),
  UNIQUE INDEX `CommentID_UNIQUE` (`CommentID` ASC) VISIBLE,
  INDEX `comments_ibfk_1` (`UserID` ASC) VISIBLE,
  INDEX `comments_ibfk_2` (`PostID` ASC) VISIBLE,
  INDEX `comments_ibfk_3` (`ParentID` ASC) VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `project7app`.`Users` (`UserID`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`PostID`)
    REFERENCES `project7app`.`Posts` (`PostID`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3`
    FOREIGN KEY (`ParentID`)
    REFERENCES `project7app`.`Comments` (`CommentID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 135
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;