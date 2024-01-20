package controllers

import (
	"net/http"
	"sort"
	"strconv"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func CreatePost(c *gin.Context) {
	var body struct {
		Title      string
		Body       string
		Tags       []models.Tag
		ModuleCode string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create post(invalid data)",
		})

		return
	}

	userValue, _ := c.Get("user")

	post := models.Post{Title: body.Title, Body: body.Body, ModuleCode: body.ModuleCode, Username: userValue.(models.User).Username}
	result := database.DB.Create(&post)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create post",
		})

		return
	}
	for _, tag := range body.Tags {
		database.DB.Model(&post).Association("Tags").Append(&tag)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post created!",
	})
}

func LikePost(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User = userValue.(models.User)
	var post models.Post

	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.First(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.Model(&user).Association("LikedPosts").Append(&post)

	c.JSON(http.StatusOK, gin.H{
		"message": "Liked post!",
	})

}

func UnlikePost(c *gin.Context) {
	userValue, _ := c.Get("user")

	var user models.User = userValue.(models.User)
	var post models.Post

	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.First(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.Model(&user).Association("LikedPosts").Delete(&post)

	c.JSON(http.StatusOK, gin.H{
		"message": "Unliked post!",
	})
}

func EditPost(c *gin.Context) {
	var body struct {
		Title      string
		Body       string
		Tags       []models.Tag
		ModuleCode string
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

	if post.ID == 0 || post.ModuleCode != body.ModuleCode {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	if post.Username != userValue.(models.User).Username {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post does not belong to you",
		})

		return
	}
	database.DB.Model(&post).Updates(models.Post{Title: body.Title, Body: body.Body})
	database.DB.Model(&post).Association("Tags").Replace(body.Tags)

	c.JSON(http.StatusOK, gin.H{
		"message": "Post edited!",
	})
}

func DeletePost(c *gin.Context) {
	userValue, _ := c.Get("user")

	var post models.Post
	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	database.DB.First(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	if post.Username != userValue.(models.User).Username {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post does not belong to you",
		})

		return
	}

	database.DB.Unscoped().Delete(&models.Post{}, post.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted!",
	})
}

func GetPost(c *gin.Context) {
	userValue, _ := c.Get("user")
	var post models.Post
	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	database.DB.Preload("Tags").Find(&post, postID)

	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}
	commentCount := database.DB.Model(&post).Association("Comments").Count()
	likeCount := database.DB.Model(&post).Association("LikedUsers").Count()
	isLiked := (database.DB.Model(&post).Where("id = ?", userValue.(models.User).ID).Association("LikedUsers").Count()) == 1
	postResponse := PostResponse{Post: post, LikeCount: uint(likeCount), CommentCount: uint(commentCount), IsLiked: isLiked}
	c.JSON(http.StatusOK, postResponse)
}

type CommentRespone struct{
	models.Comment
	LikeCount uint
	IsLiked bool
}
func GetPostComments(c *gin.Context) {
	userValue, _ := c.Get("user")

	postID, err := strconv.Atoi(c.Param("postID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid post id",
		})

		return
	}

	var comments []models.Comment
	database.DB.Preload("LikedUsers").Where("post_id = ?", postID).Find(&comments)
	
	var commentResponses []CommentRespone
	for _, comment := range comments{
		likeCount := database.DB.Model(&comment).Association("LikedUsers").Count()
		isLiked := (database.DB.Model(&comment).Where("id = ?", userValue.(models.User).ID).Association("LikedUsers").Count()) == 1

		commentResponses = append(commentResponses, CommentRespone{Comment: comment, LikeCount: uint(likeCount), IsLiked: isLiked})
	}

	sort.Slice(commentResponses, func(i, j int) bool {
		return commentResponses[i].CreatedAt.After(commentResponses[j].CreatedAt)
	})
	c.JSON(http.StatusOK, commentResponses)
}
