package main

import (
	"net/http"
	"os"

	"github.com/dwsc37/cvwo-assignment/controllers"
	"github.com/dwsc37/cvwo-assignment/database"
	"github.com/dwsc37/cvwo-assignment/initialisers"
	"github.com/dwsc37/cvwo-assignment/middleware"
	"github.com/gin-gonic/gin"
)

func init() {
	initialisers.LoadEnv()
	database.ConnectToDB()
	//database.ResetDB()
	database.SyncDB()
}

func main() {
	r := gin.Default()

	// Enable CORS for all routes
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", os.Getenv("CLIENT"))              // Adjust the domain accordingly
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE") // Add the allowed HTTP methods
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	})

	//auth routes
	r.POST("/api/register", controllers.Register)
	r.POST("/api/login", controllers.Login)

	r.Use(middleware.RequireAuth)
	r.GET("/api/validate", controllers.Validate)

	//subscription routes
	r.PUT("/api/subs/sub/:moduleCode", controllers.Subscribe)
	r.PUT("/api/subs/unsub/:moduleCode", controllers.Unsubscribe)
	r.GET("/api/subs", controllers.GetSubscribedModules)

	//module routes
	r.GET("/api/modules/all", controllers.GetAllModules)
	r.GET("/api/module/:moduleCode", controllers.GetModule)
	r.GET("/api/module/:moduleCode/posts", controllers.GetModulePosts)

	//tag routes
	r.GET("/api/tags", controllers.GetTags)

	//post routes
	r.POST("/api/posts/create", controllers.CreatePost)
	r.PUT("/api/posts/like/:postID", controllers.LikePost)
	r.PUT("/api/posts/unlike/:postID", controllers.UnlikePost)
	r.PATCH("/api/posts/edit/:postID", controllers.EditPost)
	r.DELETE("/api/posts/delete/:postID", controllers.DeletePost)
	r.GET("/api/post/:postID", controllers.GetPost)
	r.GET("/api/post/:postID/comments",controllers.GetPostComments)

	//comment routes
	r.POST("/api/comments/create/:postID", controllers.CreateComment)
	r.PUT("/api/comments/like/:commentID", controllers.LikeComment)
	r.PUT("/api/comments/unlike/:commentID", controllers.UnlikeComment)
	r.PATCH("/api/comments/edit/:commentID", controllers.EditComment)
	r.DELETE("/api/comments/delete/:commentID", controllers.DeleteComment)

	//feed routes
	r.GET("/api/all", controllers.GetAllPosts)
	r.GET("/api/home", controllers.GetHomePosts)
	r.GET("/api/profile", controllers.GetUserPosts)
	
	//logout
	r.POST("/api/logout", controllers.Logout)

	r.Run(os.Getenv("PORT"))
}
