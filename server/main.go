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
		c.Header("Access-Control-Allow-Origin", os.Getenv("CLIENT"))       // Adjust the domain accordingly
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE") // Add the allowed HTTP methods
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

	//module routes
	r.PUT("/api/modules/:moduleID/subscribe", controllers.Subscribe)
	r.PUT("/api/modules/:moduleID/unsubscribe", controllers.Unsubscribe)
	r.GET("/api/modules/", controllers.GetAllModules)
	r.GET("/api/modules/:moduleID", controllers.GetModule)
	r.GET("/api/modules/:moduleID/posts", controllers.GetModulePosts)

	//post routes
	r.POST("/api/posts/create/:moduleID", controllers.CreatePost)
	r.PUT("/api/posts/edit/:postID", controllers.EditPost)
	r.DELETE("/api/posts/delete/:postID", controllers.DeletePost)
	r.GET("/api/posts/all", controllers.GetAllPosts)
	r.GET("/api/posts/feed", controllers.GetFeedPosts)
	r.GET("/api/posts/:postID", controllers.GetPost)
	r.GET("/api/posts/:postID/comments", controllers.GetPostComments)

	//comment routes
	r.POST("/api/comments/create/:postID", controllers.CreateComment)
	r.PUT("/api/comments/edit/:commentID", controllers.EditComment)
	r.DELETE("/api/comments/delete/:commentID", controllers.DeleteComment)

	//logout
	r.POST("/api/logout", controllers.Logout)

	r.Run()
}
