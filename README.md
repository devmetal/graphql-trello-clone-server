[![Build Status](https://travis-ci.org/devmetal/graphql-trello-clone-server.svg?branch=master)](https://travis-ci.org/devmetal/graphql-trello-clone-server)

[![codecov](https://codecov.io/gh/devmetal/graphql-trello-clone-server/branch/master/graph/badge.svg)](https://codecov.io/gh/devmetal/graphql-trello-clone-server)

# Trello Clone Server

## This is example for a graphql apollo server.

## Features that i have used:

  * Apollo Express Server
  * Apollo Subscriptions with websocket
  * Authentication with Passport JWT Strategy
  * Websocket authentication

## Installation

Very easy, clone and npm or yarn install. In configuration you can setup your mongodb.

## Usage

This server is created for demo and example purpose.
The authentication is just for example, the graphql api actually not require authentication and only used for the client side, also for demo purposes.

You can try this with /graphiql endpoint. You can create boards and tickets.

For complete example you can also try this project clinet side.

## Create first board

Unfourtunatly the client side of this project not holds (yet) any ui for board creation. So you have to make your own in /graphiql endpoint.

## json-server

Its not required for run this example, just some extra.

For demonstrate the graphql caps i added a fake json server to this project, with some basic fake datas. If you start this, you can query for team and okr-s types to. But first you have to create teamId for users in your database.
