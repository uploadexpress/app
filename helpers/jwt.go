package helpers

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateAccessToken(secret string, subject string) (*string, error) {
	access := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": subject,
		"aud": "access",
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Minute * time.Duration(8760)).Unix(),
	})

	accessString, err := access.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	return &accessString, nil
}

func GenerateApiToken(secret string, subject, creator string) (*string, error) {
	access := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss": creator,
		"sub": subject,
		"aud": "api",
		"iat": time.Now().Unix(),
	})

	accessString, err := access.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	return &accessString, nil
}

func GetParsedToken(token, secret string) (*jwt.Token, error) {
	rawToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		// validate the alg
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	return rawToken, nil
}

func GetTokenAudience(token, secret string) (string, error) {
	rawToken, err := GetParsedToken(token, secret)
	if err != nil {
		return "", err
	}

	claims, ok := rawToken.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("could not parse the claims")
	}

	return claims["aud"].(string), nil
}

func ValidateJwtToken(token string, secret string, audience string) (jwt.MapClaims, error) {
	rawToken, err := GetParsedToken(token, secret)
	if err != nil {
		return nil, err
	}

	//validate signature
	if !rawToken.Valid {
		return nil, errors.New("token in invalid (wrong signature)")
	}

	claims, ok := rawToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("could not parse the claims")
	}

	//validate aud
	tokenAud := claims["aud"].(string)
	if tokenAud != audience {
		return nil, errors.New("token in invalid (wrong audience)")
	}

	//validate exp
	if tokenAud != "api" { // api tokens don't expire
		tokenExp := claims["exp"].(float64)
		if tokenExp < float64(time.Now().Unix()) {
			return nil, errors.New("token in invalid (expired)")
		}
	}

	return claims, nil
}
