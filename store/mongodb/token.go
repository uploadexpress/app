package mongodb

import (
	"net/http"

	"github.com/globalsign/mgo/bson"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

// CreateToken checks if token  already exists, and if not, creates it
func (db *mongo) CreateToken(token *models.Token) error {
	session := db.Session.Copy()
	defer session.Close()
	tokens := db.C(models.TokensCollection).With(session)

	token.Id = bson.NewObjectId().Hex()
	err := token.BeforeCreate()
	if err != nil {
		return err
	}

	err = tokens.Insert(token)
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "token_creation_failed", "Failed to insert the token in the database", err)
	}

	return nil
}

// FindTokenById allows to retrieve a token by its id
func (db *mongo) FindTokenById(id string) (*models.Token, error) {
	session := db.Session.Copy()
	defer session.Close()
	tokens := db.C(models.TokensCollection).With(session)

	token := &models.Token{}
	err := tokens.FindId(id).One(token)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "token_not_found", "Token not found", err)
	}

	return token, err
}

// GetAllToken allows to get all tokens
func (db *mongo) GetAllTokens() ([]*models.Token, error) {
	session := db.Session.Copy()
	defer session.Close()

	tokens := db.C(models.TokensCollection).With(session)

	list := []*models.Token{}
	if err := tokens.Find(params.M{}).All(&list); err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "tokens_not_found", "Token not found", err)
	}

	return list, nil
}

// UpdateToken allows to update one or more token characteristics
func (db *mongo) UpdateToken(tokenId string, params params.M) error {
	session := db.Session.Copy()
	defer session.Close()
	tokens := db.C(models.TokensCollection).With(session)

	if err := tokens.UpdateId(tokenId, params); err != nil {
		return helpers.NewError(http.StatusInternalServerError, "token_update_failed", "Failed to update the token", err)
	}

	return nil
}

// DeleteToken allows to delete a token by its id
func (db *mongo) DeleteToken(tokenId string) error {
	session := db.Session.Copy()
	defer session.Close()
	tokens := db.C(models.TokensCollection).With(session)

	err := tokens.Remove(bson.M{"_id": tokenId})
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "token_delete_failed", "Failed to delete the token", err)
	}

	return nil
}
