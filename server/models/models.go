package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string    `gorm:"unique"`
	Password string    `gorm:"not null"`
	Posts    []Post    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comments []Comment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Modules  []Module  `gorm:"many2many:user_subscriptions"`
}

type Module struct {
	gorm.Model
	Code        string `gorm:"unique"`
	Description string
	Posts       []Post `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Post struct {
	gorm.Model
	Title    string
	Body     string
	Score    uint      `gorm:"default:0"`
	UserID   uint      `gorm:"not null"`
	ModuleID uint      `gorm:"not null"`
	Comments []Comment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Comment struct {
	gorm.Model
	Body   string
	Score  uint `gorm:"default:0"`
	PostID uint `gorm:"not null"`
	UserID uint `gorm:"not null"`
}

/*type Tag struct {
	gorm.Model
	tagName string
}
*/
