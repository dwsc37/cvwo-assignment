package controllers

import (
	"net/http"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func GetTags(c *gin.Context) {
	var tags []models.Tag
	database.DB.Find(&tags)

	c.JSON(http.StatusOK, tags)
}
