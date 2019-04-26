package store

import (
	"context"

	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

//CreateToken checks if token already exists, and if not, creates it
func CreateToken(c context.Context, record *models.Token) error {
	return FromContext(c).CreateToken(record)
}

// FindTokenById allows to retrieve a token by its id
func FindTokenById(c context.Context, id string) (*models.Token, error) {
	return FromContext(c).FindTokenById(id)
}

// GetAllToken allows to get all tokens
func GetAllTokens(c context.Context) ([]*models.Token, error) {
	return FromContext(c).GetAllTokens()
}

// UpdateToken allows to update one or more token characteristics
func UpdateToken(c context.Context, tokenId string, params params.M) error {
	return FromContext(c).UpdateToken(tokenId, params)
}

// DeleteToken allows to delete a token by its id
func DeleteToken(c context.Context, tokenId string) error {
	return FromContext(c).DeleteToken(tokenId)
}
