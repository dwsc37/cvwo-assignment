package database

import (
	"os"

	"github.com/dwsc37/cvwo-assignment/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() {
	var err error
	dsn := os.Getenv("DB")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Cannot connect to db")
	}
}

func SyncDB() {
	DB.AutoMigrate(&models.User{}, &models.Module{}, &models.Post{}, &models.Comment{})
}

func ResetDB() {
	DB.Migrator().DropTable(&models.User{}, &models.Module{}, &models.Post{}, &models.Comment{})
}
