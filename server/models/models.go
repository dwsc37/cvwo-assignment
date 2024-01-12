package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string    `gorm:"unique"`
	Password string    `gorm:"not null"`
	Posts    []Post    `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comments []Comment `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Modules  []Module  `gorm:"many2many:user_subscriptions"`
}

type Module struct {
	gorm.Model
	Code  string `gorm:"unique"`
	Name  string `gorm:"unique"`
	Posts []Post `gorm:"foreignKey:ModuleCode;references:Code;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Users []User `gorm:"many2many:user_subscriptions"`
}

type Post struct {
	gorm.Model
	Title string
	Body  string
	//Score    uint      `gorm:"default:0"`
	Username   string    `gorm:"not null"`
	ModuleCode string    `gorm:"not null"`
	Comments   []Comment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Comment struct {
	gorm.Model
	Body string
	//Score  uint `gorm:"default:0"`
	PostID   uint   `gorm:"not null"`
	Username string `gorm:"not null"`
}

/*type Tag struct {
	gorm.Model
	tagName string
}
*/
