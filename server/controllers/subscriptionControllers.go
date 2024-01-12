package controllers

import (
	"net/http"
	"sort"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func Subscribe(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User
	var module models.Module

	database.DB.First(&user, userValue.(models.User).ID)

	moduleCode := c.Param("moduleCode")

	database.DB.First(&module, "code = ?", moduleCode)

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

	moduleCode := c.Param("moduleCode")

	database.DB.First(&module, "code = ?", moduleCode)

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

func GetSubscribedModules(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User
	var subscribedModules []models.Module

	database.DB.First(&user, userValue.(models.User).ID)
	database.DB.Model(&user).Association("Modules").Find(&subscribedModules)
	sort.Slice(subscribedModules, func(i, j int) bool {
		return subscribedModules[i].Code < subscribedModules[j].Code
	})
	c.JSON(http.StatusOK, gin.H{
		"modules": subscribedModules,
	})
}
