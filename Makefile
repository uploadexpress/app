# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
YARNCMD=yarn
YARNINSTALL=$(YARNCMD) install
YARNBUILD=$(YARNCMD) build
BUILD_FOLDER=build
BINARY_NAME=uploadexpress
BINARY_UNIX=$(BINARY_NAME)_unix
FRONT_PATH=www
SERVER_MAIN_PATH=cmd/server/main.go
FRONT_BUILD_FOLDER=$(FRONT_PATH)/build
FRONT_DESTINATION=$(BUILD_FOLDER)/front

all: test build
build:
	$(GOBUILD) -o $(BUILD_FOLDER)/$(BINARY_NAME) -v $(SERVER_MAIN_PATH)
	cd $(FRONT_PATH); \
	$(YARNINSTALL); \
	$(YARNBUILD);
	cp -R $(FRONT_BUILD_FOLDER) $(FRONT_DESTINATION)
	if [ -e .env ]; \
		then cp .env build; \
	fi
test:
	$(GOTEST) -v ./...
clean:
	$(GOCLEAN)
	rm -rf $(BUILD_FOLDER)
	rm -rf $(FRONT_BUILD_FOLDER)
run:
	$(GOBUILD) -o $(BUILD_FOLDER)/$(BINARY_NAME) -v ./...
	./$(BINARY_NAME)
deps:
	$(GOGET) ./...
.PHONY: build