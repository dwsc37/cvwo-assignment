package controllers

import (
	"net/http"
	"sort"

	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/models"
	"github.com/gin-gonic/gin"
)

func GetHomePosts(c *gin.Context){
	userValue, _ := c.Get("user")

	var user models.User

	database.DB.Preload("Modules.Posts").First(&user, userValue.(models.User).ID)


	var postListResponse []PostResponse

	for _, module := range user.Modules {
		for _, post := range module.Posts {
			commentCount := database.DB.Model(&post).Association("Comments").Count()
			likeCount := database.DB.Model(&post).Association("LikedUsers").Count()
			isLiked := (database.DB.Model(&post).Where("id = ?", userValue.(models.User).ID).Association("LikedUsers").Count()) == 1
			postListResponse = append(postListResponse, PostResponse{Post: post, LikeCount: uint(likeCount), CommentCount: uint(commentCount), IsLiked: isLiked})
		}
	}

	sort.Slice(postListResponse, func(i, j int) bool {
		return postListResponse[i].CreatedAt.After(postListResponse[j].CreatedAt)
	})
	c.JSON(http.StatusOK, postListResponse)
}


func GetAllPosts(c *gin.Context){
	var posts []models.Post

	database.DB.Preload("Tags").Find(&posts)

	userValue, _ := c.Get("user")

	var postListResponse []PostResponse

	for _, post := range posts {
		commentCount := database.DB.Model(&post).Association("Comments").Count()
		likeCount := database.DB.Model(&post).Association("LikedUsers").Count()
		isLiked := (database.DB.Model(&post).Where("id = ?", userValue.(models.User).ID).Association("LikedUsers").Count()) == 1
		postListResponse = append(postListResponse, PostResponse{Post: post, LikeCount: uint(likeCount), CommentCount: uint(commentCount), IsLiked: isLiked})
	}

	sort.Slice(postListResponse, func(i, j int) bool {
		return postListResponse[i].CreatedAt.After(postListResponse[j].CreatedAt)
	})
	c.JSON(http.StatusOK, postListResponse)
}

func GetUserPosts(c *gin.Context){
	username := c.Param("username");
	var user models.User

	database.DB.First(&user, "username = ?", username)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid username",
		})

		return
	}
	var posts []models.Post

	database.DB.Preload("Tags").Where("username = ?",user.Username).Find(&posts)

	var postListResponse []PostResponse

	for _, post := range posts {
		commentCount := database.DB.Model(&post).Association("Comments").Count()
		likeCount := database.DB.Model(&post).Association("LikedUsers").Count()
		isLiked := (database.DB.Model(&post).Where("id = ?", user.ID).Association("LikedUsers").Count()) == 1
		postListResponse = append(postListResponse, PostResponse{Post: post, LikeCount: uint(likeCount), CommentCount: uint(commentCount), IsLiked: isLiked})
	}

	sort.Slice(postListResponse, func(i, j int) bool {
		return postListResponse[i].CreatedAt.After(postListResponse[j].CreatedAt)
	})
	c.JSON(http.StatusOK, postListResponse)
}


