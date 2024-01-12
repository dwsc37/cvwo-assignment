package controllers

import (
	"net/http"
	"strconv"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	var body struct {
		Body string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create comment(invalid data)",
		})

		return
	}

	userValue, _ := c.Get("user")

	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	comment := models.Comment{Body: body.Body, PostID: uint(postID), Username: userValue.(models.User).Username}
	result := database.DB.Create(&comment)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create comment",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment created!",
	})
}

func EditComment(c *gin.Context) {
	var body struct {
		Body string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to edit comment(invalid data)",
		})

		return
	}

	userValue, _ := c.Get("user")

	commentID, err := strconv.Atoi(c.Param("commentID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid comment id",
		})

		return
	}

	var comment models.Comment
	database.DB.First(&comment, commentID)

	if comment.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid comment id",
		})

		return
	}

	if comment.Username != userValue.(models.User).Username {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Comment does not belong to you",
		})

		return
	}

	database.DB.Model(&comment).Updates(models.Comment{Body: body.Body})

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment edited!",
	})
}

func DeleteComment(c *gin.Context) {
	userValue, _ := c.Get("user")

	commentID, err := strconv.Atoi(c.Param("commentID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid comment id",
		})

		return
	}

	var comment models.Comment
	database.DB.First(&comment, commentID)

	if comment.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid comment id",
		})

		return
	}

	if comment.Username != userValue.(models.User).Username {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Comment does not belong to you",
		})

		return
	}

	database.DB.Unscoped().Delete(&models.Comment{}, commentID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment deleted!",
	})
}
