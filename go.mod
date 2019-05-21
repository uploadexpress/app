module github.com/uploadexpress/app

go 1.12

require (
	github.com/BurntSushi/toml v0.3.1 // indirect
	github.com/armon/consul-api v0.0.0-20180202201655-eb2c6b5be1b6 // indirect
	github.com/asaskevich/govalidator v0.0.0-20190424111038-f61b66f89f4a
	github.com/aws/aws-sdk-go v1.19.34
	github.com/coreos/etcd v3.3.10+incompatible // indirect
	github.com/coreos/go-etcd v2.0.0+incompatible // indirect
	github.com/coreos/go-semver v0.2.0 // indirect
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/disintegration/imageorient v0.0.0-20180920195336-8147d86e83ec
	github.com/disintegration/imaging v1.6.0
	github.com/gin-contrib/gzip v0.0.1
	github.com/gin-gonic/gin v1.4.0
	github.com/globalsign/mgo v0.0.0-20181015135952-eeefdecb41b8
	github.com/h2non/filetype v1.0.8
	github.com/joho/godotenv v1.3.0
	github.com/mitchellh/mapstructure v1.1.2
	github.com/nicksnyder/go-i18n/v2 v2.0.0
	github.com/sirupsen/logrus v1.4.2
	github.com/spf13/cast v1.3.0 // indirect
	github.com/spf13/pflag v1.0.3 // indirect
	github.com/spf13/viper v1.2.1
	github.com/xordataexchange/crypt v0.0.3-0.20170626215501-b2862e3d0a77 // indirect
	golang.org/x/crypto v0.0.0-20190513172903-22d7a77e9e5f
	golang.org/x/net v0.0.0-20190520210107-018c4d40a106
	golang.org/x/sys v0.0.0-20190520201301-c432e742b0af // indirect
	golang.org/x/text v0.3.2
	golang.org/x/tools v0.0.0-20190520220859-26647e34d3c0 // indirect
	gopkg.in/check.v1 v1.0.0-20180628173108-788fd7840127 // indirect
	gopkg.in/mail.v2 v2.3.1
	gopkg.in/mgo.v2 v2.0.0-20180705113604-9856a29383ce
)

replace github.com/ugorji/go v1.1.4 => github.com/ugorji/go/codec v0.0.0-20190204201341-e444a5086c43
