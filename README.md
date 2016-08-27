# Taskrift

This is the start of my project management system! Currently it only has basic features.

Features:

* Themes
* Plugins (called "Apps")
* Projects
* Basic accounts
 

A demo can be seen here: http://taskrift-example.herokuapp.com/ (the github intergration plugin/app is not completed/working yet)
* username: admin 
* password: password

TODO:

* Account and permissions control system
* Image badges that are server rendered for showing project infomation on other websites
* Notifications and notification emails
* More apps for the system

# Apps

All the default apps are in the "apps" folder. Take a look at the dashboard to see an example for a basic app structure. 

When creating an app keep this in mind:

* The icon is the name of a font awesome icon without the `fa-`
* The slug needs to be unique,
* The name can be anything

# Themes

Look in the sass folder to see all the possable themes. Default are `default`, `material`, and `dark`. 

You can enable these by putting in the folder name to the theme variable in the config.js

