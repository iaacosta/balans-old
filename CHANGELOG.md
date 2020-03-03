# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2020-03-03)


### Features

* **account:** adds balance + resolvers and schema to query them ([b876b84](https://github.com/cho19/finanzie/commit/b876b843edfd33aa078ce233000c971d07008294))
* **accounts:** adds CRUD actions for credit accounts + integration with currencies ([21f4d38](https://github.com/cho19/finanzie/commit/21f4d38300055fe536499bd70b094a514acbcbac))
* **accounts:** adds debit account model + create and get all queries ([59d2158](https://github.com/cho19/finanzie/commit/59d21586dec7bbc58a820a5eba87ca0668250e4c))
* **accounts:** adds getOne, update and remove actions for debit accounts ([da871b5](https://github.com/cho19/finanzie/commit/da871b59d0931173814bbf22fa02cbcea7c99afa))
* **accounts:** adds validation on credit accounts ([ec9131f](https://github.com/cho19/finanzie/commit/ec9131f755b28dff5aa602db1082298f730918ba))
* **accounts:** adds validation to debit accounts ([93395ad](https://github.com/cho19/finanzie/commit/93395adc551f675112961e73239458a933610f53))
* **backend:** adds timestamps to created models ([78c1e3b](https://github.com/cho19/finanzie/commit/78c1e3b4b8ccca09d3914f4cca4535c0e9c89583))
* **category:** adds resolvers and schemas for category model ([74a41c5](https://github.com/cho19/finanzie/commit/74a41c51e17167327a88abfd67840dae535f36dc))
* **currency:** adds circular query between debit accounts and currencies ([e9895ce](https://github.com/cho19/finanzie/commit/e9895ce38240441c0eb758ee1f59d2c7abefba92))
* **currency:** adds mutations (create, update and delete) ([5ff31ec](https://github.com/cho19/finanzie/commit/5ff31ec10ca34ee3006a5f29a061ac2d25d731d3))
* **currency:** adds validation on currency name ([244ae1d](https://github.com/cho19/finanzie/commit/244ae1d73a47771c81ca645e0df0ce88e6910308))
* **currency:** connects orm to database and graphql to orm ([806eee4](https://github.com/cho19/finanzie/commit/806eee4730aad08f61d851c377d5d2d3ac54de24))
* **expense:** adds expense ([2970a28](https://github.com/cho19/finanzie/commit/2970a288a3458e4eaf2aa0e8f53145427fffdf26))
* **income:** adds income ([7105eb2](https://github.com/cho19/finanzie/commit/7105eb2f90b5f412af706939505ee42356aefcef))
* **movement:** adds subscribers to validate balance on movements ([9befe18](https://github.com/cho19/finanzie/commit/9befe18a82ade184e4cfb9d03da5048cc790aa81))
* **place:** adds graphql resolvers and schema ([9636ae2](https://github.com/cho19/finanzie/commit/9636ae2b10cdc0a9cd39647b8816041e618f7e45))
* **subcategory:** adds resolvers and schemas + retrievable categoryId from model ([34e5353](https://github.com/cho19/finanzie/commit/34e53538ba2064ee5913fe32558d8e5bc6fd6d52))


### Bug Fixes

* **accounts:** fix an update condition bug ([0f4912e](https://github.com/cho19/finanzie/commit/0f4912ef1ad987744a77d9a5ccc8f46ca6f7fedf))
* **accounts:** removes DebitAccount and CreditAccount to make a single Account model + resolvers & schema ([94c0926](https://github.com/cho19/finanzie/commit/94c0926b8f6cc1b625159f5add65d745ef3b8ce0))
* **backend:** fix migration/model issue ([b71695f](https://github.com/cho19/finanzie/commit/b71695f7c130d84b02e10369c0ca8b60b372b264))
* **currency:** modifies database constraint, adds set null to cascade delete of currency ([113e868](https://github.com/cho19/finanzie/commit/113e8681ec5d62e8824bfc8d26971e09f70510a1))
* **expense:** fixes id checking when updating place ([b6a0bf0](https://github.com/cho19/finanzie/commit/b6a0bf02cf5d6bf060b1a04fb5f6c0b685d9aa46))
* **income:** changes validation on Income, must always be positive ([c8f9fa6](https://github.com/cho19/finanzie/commit/c8f9fa684489948d743a6c4b9070e5a857c2b296))
* **model:** fixes giant bug related to relationship between place/subcategory and expenses/incomes ([1a5b3c6](https://github.com/cho19/finanzie/commit/1a5b3c679bab96ad0daaefa29bc94b80c399ebea))
* **place:** removes account relations in placeById findOne search function ([26ef41d](https://github.com/cho19/finanzie/commit/26ef41de180bb74f7dff9a39e336d70372e39a99))
* **subcategory:** removes unnecesary class attribute ([a30a996](https://github.com/cho19/finanzie/commit/a30a99670fcbfa8578f1c4bf958b19e10513191e))
