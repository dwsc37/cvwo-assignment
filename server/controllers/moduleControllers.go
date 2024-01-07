package controllers

import (
	"net/http"
	"strconv"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func Subscribe(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User
	var module models.Module

	database.DB.First(&user, userValue.(models.User).ID)

	moduleID, err := strconv.Atoi(c.Param("moduleID"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}

	database.DB.First(&module, moduleID)

	if user.ID == 0 || module.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user or module",
		})

		return
	}

	database.DB.Model(&user).Association("Modules").Append(&module)

	c.JSON(http.StatusOK, gin.H{
		"message": "Subscribed to " + module.Code + "!",
	})
}

func Unsubscribe(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User
	var module models.Module

	database.DB.First(&user, userValue.(models.User).ID)

	moduleID, err := strconv.Atoi(c.Param("moduleID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	database.DB.First(&module, moduleID)

	if user.ID == 0 || module.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user or module",
		})

		return
	}

	database.DB.Model(&user).Association("Modules").Delete(&module)

	c.JSON(http.StatusOK, gin.H{
		"message": "Unsubscribed from " + module.Code + "!",
	})
}

func GetAllModules(c *gin.Context) {
	var modules []models.Module
	database.DB.Find(&modules)

	c.JSON(http.StatusOK, gin.H{
		"modules": modules,
	})
}

func GetModule(c *gin.Context) {
	var module models.Module
	moduleID, err := strconv.Atoi(c.Param("moduleID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	database.DB.Find(&module, moduleID)

	if module.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	c.JSON(http.StatusOK, gin.H{
		"module": module,
	})
}

func GetModulePosts(c *gin.Context) {
	var module models.Module
	moduleID, err := strconv.Atoi(c.Param("moduleID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	database.DB.Preload("Posts").Find(&module, moduleID)

	if module.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	c.JSON(http.StatusOK, gin.H{
		"posts": module.Posts,
	})
}
