STACK_ID ?= 123123123
STACK_NAME ?= helloworld
STACK_CONFIG_PATH ?= /tmp/stacks/helloworld
DOCKER_ID_USER ?= makerdao

help:
	@echo "Use make run STEP_ID=123231123"
.PHONY: help

install:
	@echo "Seting up config files"
	@if [ ! -d $(STACK_CONFIG_PATH) ]; then \
        mkdir -p $(STACK_CONFIG_PATH); \
				cp -R $(CURDIR)/stack_config/* $(STACK_CONFIG_PATH); \
	else \
				echo "$(STACK_CONFIG_PATH) already exist. Replacing configs..."; \
				rm -rf $(STACK_CONFIG_PATH)/*; \
				cp -R $(CURDIR)/stack_config/* $(STACK_CONFIG_PATH); \
  fi
.PHONY: install

build:
	@docker build -t $(DOCKER_ID_USER)/testchain-stack-$(STACK_NAME) .
.PHONY: build

docker-push:
	@echo "Pushing docker image"
	@docker push $(DOCKER_ID_USER)/testchain-stack-$(STACK_NAME)
.PHONY: docker-push

run-local:
	STACK_ID=10442485691877829195 STACK_NAME=helloworld WEB_API_URL=http://localhost:4000 NATS_URL=http://localhost:4222 node src/index.js
.PHONY: run-local
