# MODULO

## Overview

This is my (Dave Wong) submission for the CVWO Winter Assignment 23/24.
The app is a web forum intended to be used by NUS students. There are various communities (NUS modules) which users can subscribe to to customise their experience.
It is hosted on AWS at http://modulo.ddns.net
Alternative address (if ddns does not work): http://54.255.234.127/

## Setting Up the Repository

### Clone the repo

```bash
git clone "https://github.com/dwsc37/cvwo-assignment"
```

### Frontend

1. Change directory to the client folder.

```bash
cd cvwo-assignment/client
```

2. Install dependencies.

```bash
npm install
```

3. Start the frontend.

```bash
npm start
```

### Backend

1. Change directory to the server folder.

```bash
cd cvwo-assignment/server
```

2. Install dependencies.

```bash
go install
```

3. Start the backend.

```bash
go run main.go
```

## Features

### Authentication Pages

-   /login
-   /register

Authentication is done using JWTs. JWT is issued by backend to frontend upon succesful login via a HTTP-only cookie.
This cookie is required to access all other pages in app.
It is also required to send requests to the backend (except login and register).

### RTK Query

All communication between frontend and backend is done using RTK queries, allowing for caching of queries after the first retrieval.

### Feed Pages

-   /home: view posts from modules you are subscribed to
-   /all: view posts from all modules
-   /profile: view posts from a particular user
-   /module: view posts from a particular module

All feed pages have a search bar, a tag filter, and the option to sort by new or top.
Module feed pages allow for creating a post in that module, and subscribing to that module.
Home and all feed pages allow user to select a module and create a post in that module.

### Post Cards

Each post card displayed in a feed allows the following:

-   Liking/unliking the post
-   Viewing the module feed for post's module (if not already in module feed)
-   Viewing the profile of the post's creator
-   Editing/deleting your own posts

Clicking on a post card opens a dialog which additionally allows:

-   Commeting on the post
-   Viewing all comments
-   Liking/unliking comments
-   Editing/deleting your own comments

### Other Pages/Components

-   /modules: view all modules
-   navbar(top bar):
    -   modulo button: navigate back to home
    -   user button: allows viewing of user profile and logging out
    -   displays current user
-   sidebar: quick access to feeds, subscribed modules and /modules

## Deployment Process

Individual docker images built for client and server (dockerfiles can be viewed in respective folders)
Docker images saved as tar files and uploaded via scp to an AWS EC2 instance.
Images ran on EC2 instance, app accessible via link above.
