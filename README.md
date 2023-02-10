## About

Ultira is a dashboard tool designed to work with Jira (cloud and server) and with GitHub, Bitbucket and server-stash as well
The layout is simple and easy to navigate with all the information you would need at a quick glance

With the help of electron and shellJs it gets the ability to scrape your directories for folders containing a .git folder and store them in Ultira.
You can check the current branch of each project and open go to a Jira issue if a matching ticket number is within the branch name.
When there is a Jira issue open, then you can switch a project to it with on press of a button, this will also shelve uncommited changes (it will show that beforehand)

## How to start?

~~Development:
```npm run electron:start```~~ TODO

Package it up:
```npm run electron:dist```
