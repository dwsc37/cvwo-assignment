package controllers

import (
	"net/http"
	"time"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

type UserInfo struct {
	Username string
	CreatedAt time.Time
	NumPosts uint
	NumComments uint
	NumSubscriptions uint
}
func GetUserInfo(c *gin.Context){
	username := c.Param("username")

	var user models.User

	database.DB.First(&user, "username = ?", username)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid username",
		})

		return
	}

	numPosts := database.DB.Model(&user).Association("Posts").Count()
	numComments := database.DB.Model(&user).Association("Comments").Count()
	numSubscriptions := database.DB.Model(&user).Association("Modules").Count()

	userResponse := UserInfo{Username: username, CreatedAt: user.CreatedAt, NumPosts: uint(numPosts), NumComments: uint(numComments), NumSubscriptions: uint(numSubscriptions)}

	c.JSON(http.StatusOK, userResponse)
}