package controllers

import (
	"net/http"
	"strconv"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func CreatePost(c *gin.Context) {
	var body struct {
		Title string
		Body  string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create post(invalid data)",
		})

		return
	}

	userValue, _ := c.Get("user")

	moduleID, err := strconv.Atoi(c.Param("moduleID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid module id",
		})

		return
	}
	post := models.Post{Title: body.Title, Body: body.Body, ModuleID: uint(moduleID), UserID: userValue.(models.User).ID}
	result := database.DB.Create(&post)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create post",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

func EditPost(c *gin.Context) {
	var body struct {
		Title string
		Body  string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to edit post(invalid data)",
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

	var post models.Post
	database.DB.First(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	if post.UserID != userValue.(models.User).ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post does not belong to you",
		})

		return
	}

	database.DB.Model(&post).Updates(models.Post{Title: body.Title, Body: body.Body})

	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

func DeletePost(c *gin.Context) {
	userValue, _ := c.Get("user")

	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	var post models.Post
	database.DB.First(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	if post.UserID != userValue.(models.User).ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post does not belong to you",
		})

		return
	}

	database.DB.Unscoped().Delete(&models.Post{}, postID)

	c.JSON(http.StatusOK, gin.H{})
}

func GetAllPosts(c *gin.Context) {
	var posts []models.Post
	database.DB.Find(&posts)

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
	})
}

func GetFeedPosts(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User
	var posts []models.Post
	database.DB.Preload("Modules.Posts").First(&user, userValue.(models.User).ID)

	for _, module := range user.Modules {
		posts = append(posts, module.Posts...)
	}
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
	})
}

func GetPost(c *gin.Context) {
	var post models.Post
	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.Find(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

func GetPostComments(c *gin.Context) {
	var post models.Post
	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.Preload("Comments").Find(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	c.JSON(http.StatusOK, gin.H{
		"comments": post.Comments,
	})
}
