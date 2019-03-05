package mongodb

import (
	"net/http"

	"github.com/globalsign/mgo/bson"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

func (db *mongo) CreateUser(user *models.User) error {
	session := db.Session.Copy()
	defer session.Close()
	users := db.C(models.UsersCollection).With(session)

	user.Id = bson.NewObjectId().Hex()
	err := user.BeforeCreate()
	if err != nil {
		return helpers.NewError(http.StatusBadRequest, "input_not_valid", err.Error(), err)
	}

	if count, _ := users.Find(bson.M{"email": user.Email}).Count(); count > 0 {
		return helpers.NewError(http.StatusConflict, "user_already_exists", "User already exists", err)
	}

	err = users.Insert(user)
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "user_creation_failed", "Failed to insert the user in the database", err)
	}

	return nil
}

func (db *mongo) FindUserById(id string) (*models.User, error) {
	session := db.Session.Copy()
	defer session.Close()
	users := db.C(models.UsersCollection).With(session)

	user := &models.User{}
	err := users.FindId(id).One(user)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "user_not_found", "User not found", err)
	}

	return user, err
}

func (db *mongo) FindUser(params params.M) (*models.User, error) {
	session := db.Session.Copy()
	defer session.Close()
	users := db.C(models.UsersCollection).With(session)

	user := &models.User{}

	err := users.Find(params).One(user)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "user_not_found", "User not found", err)
	}

	return user, err
}

func (db *mongo) DeleteUser(user *models.User, userId string) error {
	session := db.Session.Copy()
	defer session.Close()
	users := db.C(models.UsersCollection).With(session)

	err := users.Remove(bson.M{"_id": userId})
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "user_delete_failed", "Failed to delete the user", err)
	}

	return nil
}

func (db *mongo) UserCount() (int, error) {
	session := db.Session.Copy()
	defer session.Close()
	users := db.C(models.UsersCollection).With(session)

	count, err := users.Count()
	if err != nil {
		return 0, helpers.NewError(http.StatusInternalServerError, "user_count_failed", "Failed to count the users", err)
	}

	return count, nil
}
