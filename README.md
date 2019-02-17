

# TinyAPP Project

**TinyApp** is a full stack web-app build with Node and Express that allows users to shorten long URLs.  (Similar to bit.ly & goo.gl.)

Passwords are secured by hashing with 'bcrypt' and cookies encrypted with 'cookkie-session' to prevent security intrusions or breaches.

Once securely looged in; users can create new **TinyURLs**.  Then view and edit them as neccesary.

The user can checked their **TinyURLs** by browsing to /u/'TinyURL' or by clicking on the TinyURL links on their index page.

At end of session all cookies are deleted.  At **TinyApp** we respect our users privacy!


## Final Project

Get started by registering or logging in on the appropriate page.

!["Register page"](https://github.com/isaacsmitty/TinyApp/blob/master/Screenshot%202019-02-16%20at%2011.03.42%20PM.png)

Once logged in; you can view your URLs on the main index page.

!["Main URLs page"](https://github.com/isaacsmitty/TinyApp/blob/master/Screenshot%202019-02-16%20at%2011.02.01%20PM.png)

Create new TinyURLs and edit as you please.

!["Create TinyURL page"](https://github.com/isaacsmitty/TinyApp/blob/master/Screenshot%202019-02-16%20at%2011.04.33%20PM.png)


## Dependancies

* Node.js
* Express
* EJS
* bcrypt
* body-parser
* cookie-session

## Getting Started

* Install all dependancies using the *'npm install'* command.
* Run the dev web server using the *'node express_server.js'* command.









