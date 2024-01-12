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
	SyncDB()
	PreloadModules()
}

func PreloadModules() {
	modules := []models.Module{
		{Code: "CS1101S", Name: "Programming Methodology I"},
		{Code: "CS1231S", Name: "Discrete Structures"},
		{Code: "ES2660", Name: "Communicating in the Information Age"},
		{Code: "MA1521", Name: "Calculus for Computing"},
		{Code: "MA1522", Name: "Linear Algebra for Computing"},
		{Code: "GEC1044", Name: "Chinese Medicine: Theory and Practice"},
		{Code: "CS2030S", Name: "Programming Methodology II"},
		{Code: "CS2040S", Name: "Data Structures and Algorithms"},
		{Code: "IS1108", Name: "Digital Ethics and Data Privacy"},
		{Code: "CFG1002", Name: "Career Catalyst"},
		{Code: "GEA1000", Name: "Quantitative Reasoning with Data"},
	}

	for _, module := range modules {
		DB.Create(&module)
	}
}
