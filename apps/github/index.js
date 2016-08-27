/* ===== GITHUB PLUGIN ===== */

var path = require('path')
var ejs = require('ejs');
var fs = require('fs');

var GitHubApi = require("github");

var app = require('../../app/apps');

var github = new GitHubApi({
    debug: true
});

github.authenticate({
    type: "basic",
    username: 'ldd2000@live.ca',
    password: '7SoNhfHyK9wG'
});

exports.name = "Github";
exports.slug = "github";

exports.icon = "github";

exports.load = 'second';
exports.load_before = null;
exports.load_after = 'dashboard';

exports.display = '';

function repos(callback){
    var allRepos = [];
    github.repos.getAll({
        "affiliation": "owner,organization_member"
    }, function(err, res) {
        if(err)
            console.log(err);
            //console.log(err, res);
        res.forEach(function(el){
            var o = {
                id: el.id,
                name: el.name,
                full_name: el.full_name,
                desc: el.description,
                url: el.url,
                clone_url: el.clone_url,
                branch: el.default_branch,
                updated: el.updated_at,
                permissions: el.permissions
            };
            allRepos.push(o);
        });
        console.log(allRepos);
        if(callback != null)
            callback(allRepos);
    });
}
exports.repos = repos;

exports.run = function(callback){
    app.get('/github/:pid/:repo', function(req, res){
        var pid = req.params.pid;
        var rep = req.params.repo;
    });
    repos(function(allRepos){
        exports.allRepos = allRepos;
        callback();
    });
}

exports.render = function(mobile, user){
    var templateString = fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8');
    var renderedejs = ejs.render(templateString, {
        mobile: mobile,
        display: exports.display,
        repos: exports.allRepos
    });
    return renderedejs;
}

/* ===== GITHUB PLUGIN ===== */
