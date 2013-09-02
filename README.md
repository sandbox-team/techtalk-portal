techtalk-portal
===============

Tech talk portal web application

## Dependencies

* GIT (get [official package](http://git-scm.com/downloads) or use [github client](http://windows.github.com/))
* Node.js + NPM (get it from [official website](http://nodejs.org))
* bower (run `npm install bower -g` to install it)
* grunt (run `npm install grunt -g` to install it)

## Install


Clone the Repo:
```
git clone git@github.com:sandbox-team/techtalk-portal.git
```
Or if you are having problems with SSH keys on EPAM machine, such as I do, just use regular https clone url:
```
git clone https://github.com/sandbox-team/techtalk-portal.git
```

In console navigate to the folder you've cloned:
```
  D:
  cd \Websites\techtalk-portal
```

Run this command in your CLI:
```

npm install
bower install
```

## Build

Run this command in your CLI from techtalk-portal dir:

```
grunt
```

## Using

Run this command in your CLI from techtalk-portal dir:

```
node server.js
```

And open [http://localhost:3000](http://localhost:3000) in your browser

Enjoy!
