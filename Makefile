STACK_ID ?= 123123123
STACK_CONFIG_PATH ?= /tmp/stacks/helloworld

help:
	@echo "Use make run STEP_ID=123231123"
.PHONY: help

install:
	@echo "Seting up config files"
	@if [ ! -d $(STACK_CONFIG_PATH) ]; then \
        mkdir -p $(STACK_CONFIG_PATH); \
				ln -s $(CURDIR)/stack_config/* $(STACK_CONFIG_PATH); \
	else \
				echo "$(STACK_CONFIG_PATH) already exist. Nothing to do..."; \
  fi
.PHONY: install

build:
	@docker build -t makerdao/testchain-stack-helloworld .
.PHONY: build

run-local:
	STACK_ID=10442485691877829195 STACK_NAME=helloworld WEB_API_URL=http://localhost:4000 NATS_URL=http://localhost:4222 node src/index.js
.PHONY: run-local
