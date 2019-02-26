package models

import (
	"net/http"
	"strings"

	"github.com/asaskevich/govalidator"
	"github.com/uploadexpress/app/helpers"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id        string `json:"id" bson:"_id,omitempty" valid:"-"`
	FirstName string `json:"first_name" bson:"first_name" valid:"required"`
	LastName  string `json:"last_name" bson:"last_name" valid:"required"`
	Password  string `json:"password" bson:"password" valid:"required"`
	Email     string `json:"email" bson:"email" valid:"email,required"`
}

type SanitizedUser struct {
	Id        string `json:"id" bson:"_id,omitempty"`
	FirstName string `json:"first_name" bson:"first_name"`
	LastName  string `json:"last_name" bson:"last_name"`
	Email     string `json:"email" bson:"email"`
}

func (user *User) BeforeCreate() error {
	user.Email = strings.ToLower(user.Email)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "encryption_failed", "Failed to generate the crypted password", err)
	}
	user.Password = string(hashedPassword)

	_, err = govalidator.ValidateStruct(user)
	if err != nil {
		return helpers.NewError(http.StatusBadRequest, "input_not_valid", err.Error(), err)
	}

	return nil
}

func (user *User) Sanitize() SanitizedUser {
	return SanitizedUser{user.Id, user.FirstName, user.LastName, user.Email}
}

const UsersCollection = "users"
