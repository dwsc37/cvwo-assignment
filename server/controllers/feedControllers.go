package controllers

import "github.com/gin-gonic/gin"

func getHomePosts(c *gin.Context){
	/*var posts []models.Post

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
	c.JSON(http.StatusOK, postListResponse)*/
}


func getAllPosts(c *gin.Context){

}

func getUserPosts(c *gin.Context){
	
}

func getUserLikedPosts(c *gin.Context){

}