package controllers

import (
	"net/http"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

type ModuleRespone struct {
	models.Module
	UserCount    uint
	IsSubscribed bool
}

func GetAllModules(c *gin.Context) {
	var modules []models.Module
	database.DB.Order("code").Find(&modules)

	userValue, _ := c.Get("user")

	var user models.User
	var subscribedModules []models.Module

	database.DB.First(&user, userValue.(models.User).ID)
	database.DB.Model(&user).Association("Modules").Find(&subscribedModules)

	var moduleResponses []ModuleRespone
	for _, module := range modules {
		userCount := database.DB.Model(&module).Association("Users").Count()
		isSubscribed := false
		for _, subscribedModule := range subscribedModules {
			if subscribedModule.ID == module.ID {
				isSubscribed = true
				break
			}
		}
		moduleResponses = append(moduleResponses, ModuleRespone{Module: module, UserCount: uint(userCount), IsSubscribed: isSubscribed})
	}

	c.JSON(http.StatusOK, gin.H{
		"modules": moduleResponses,
	})
}

func GetModule(c *gin.Context) {
	var module models.Module
	moduleCode := c.Param("moduleCode")

	database.DB.First(&module, "code = ?", moduleCode)

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
