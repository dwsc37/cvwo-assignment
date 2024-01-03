package main

import (
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

	//auth routes
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	r.Use(middleware.RequireAuth)
	r.GET("/ping", func(c *gin.Context) {
		userValue, _ := c.Get("user")
		c.JSON(200, gin.H{
			"user": userValue,
		})
	})

	//module routes
	r.PUT("/modules/:moduleID/subscribe", controllers.Subscribe)
	r.PUT("/modules/:moduleID/unsubscribe", controllers.Unsubscribe)
	r.GET("/modules/", controllers.GetAllModules)
	r.GET("/modules/:moduleID", controllers.GetModule)
	r.GET("/modules/:moduleID/posts", controllers.GetModulePosts)

	//post routes
	r.POST("/posts/create/:moduleID", controllers.CreatePost)
	r.PUT("/posts/edit/:postID", controllers.EditPost)
	r.DELETE("/posts/delete/:postID", controllers.DeletePost)
	r.GET("/posts/all", controllers.GetAllPosts)
	r.GET("/posts/feed", controllers.GetFeedPosts)
	r.GET("/posts/:postID", controllers.GetPost)
	r.GET("/posts/:postID/comments", controllers.GetPostComments)

	//comment routes
	r.POST("/comments/create/:postID", controllers.CreateComment)
	r.PUT("/comments/edit/:commentID", controllers.EditComment)
	r.DELETE("/comments/delete/:commentID", controllers.DeleteComment)

	//logout
	r.POST("/logout", controllers.Logout)

	r.Run()
}
