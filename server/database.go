package server

import "github.com/globalsign/mgo"

func (a *API) SetupDatabase() (*mgo.Session, error) {
	session, err := mgo.Dial(a.Config.GetString("db_host"))
	if err != nil {
		return nil, err
	}

	session.SetMode(mgo.Nearest, true)

	a.Database = session.DB(a.Config.GetString("db_name"))

	return session, nil
}
