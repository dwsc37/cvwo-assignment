package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username      string    `gorm:"unique"`
	Password      string    `gorm:"not null"`
	Posts         []Post    `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comments      []Comment `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Modules       []Module  `gorm:"many2many:user_subscriptions;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	LikedPosts    []Post    `gorm:"many2many:user_post_likes;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	LikedComments []Comment `gorm:"many2many:user_comment_likes;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Module struct {
	gorm.Model
	Code  string `gorm:"unique"`
	Name  string `gorm:"unique"`
	Posts []Post `gorm:"foreignKey:ModuleCode;references:Code;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Users []User `gorm:"many2many:user_subscriptions;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Post struct {
	gorm.Model
	Title      string
	Body       string
	Username   string    `gorm:"not null"`
	ModuleCode string    `gorm:"not null"`
	Comments   []Comment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	LikedUsers []User    `gorm:"many2many:user_post_likes;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Tags       []Tag     `gorm:"many2many:post_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Comment struct {
	gorm.Model
	Body string
	//Score  uint `gorm:"default:0"`
	PostID     uint   `gorm:"not null"`
	Username   string `gorm:"not null"`
	LikedUsers []User `gorm:"many2many:user_comment_likes;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Tag struct {
	gorm.Model
	Name string `gorm:"unique"`
}
