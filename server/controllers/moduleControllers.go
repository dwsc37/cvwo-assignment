package controllers

import (
	"net/http"
	"sort"

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

	c.JSON(http.StatusOK, moduleResponses)
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

	userCount := database.DB.Model(&module).Association("Users").Count()

	userValue, _ := c.Get("user")
	isSubscribed := (database.DB.Model(&module).Where("id = ?", userValue.(models.User).ID).Association("Users").Count()) == 1
	moduleResponse := ModuleRespone{Module: module, UserCount: uint(userCount), IsSubscribed: isSubscribed}

	c.JSON(http.StatusOK, moduleResponse)
}

type PostResponse struct {
	models.Post
	LikeCount    uint
	CommentCount uint
	IsLiked      bool
}

func GetModulePosts(c *gin.Context) {
	moduleCode := c.Param("moduleCode")

	var posts []models.Post

	database.DB.Preload("Tags").Where("module_code = ?", moduleCode).Find(&posts)

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
