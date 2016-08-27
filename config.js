
//The app name that will be shown everywhere
exports.name = "Taskrift";

//What will be show in the menubar
exports.menubar = "Taskrift";

//Port that the server will run on
//null means it will attempt the get the port from the port environment variable
//and if there isn't one set, it will default to 3000
//Usful if deploying on Heroku, where you need to read the Enviro port
//to find the correct port to bind to
exports.port = null;

//The domain the app is hosted on. If it's installed on the root of the domain you 
//can leave this as-is. However if it is on a sumdomain make sure to change it 
//to '/subdomain/' or else routes and resouce resolution will not work!
exports.domain_root = '/';

//If false, user plugins will not be loaded
exports.load_plugins = true;

//Vaild interface themes are default and dark
exports.theme = 'dark';

exports.session_secret = '17a2f2bf-c6bb-40d1-80e4-94c62b1f765a';

//Vaild databases:
//sqlite
//mysql
exports.database_type = 'sqlite';

//The name of the sqlite database file
exports.sqlite_database = 'db.sqlite';

//MYSql database connection into
exports.mysql_server = 'localhost';
exports.mysql_port = '3306';
exports.mysql_username = 'root';
exports.mysql_password = 'password'
exports.mysql_database = 'proj_mgnt';

//The admin account credentials to use when first running the server
exports.default_admin_username = 'admin';
exports.default_admin_password = 'password';
exports.default_admin_group = 2; // Corresponds to the user_groups array. For the defaults group 2 is admins

//The user groups to create when first running the server
exports.user_groups = [
    'users', //For holding all users, since it's first in the array the id will be the default of 1
    'admin', //For holding all the users that can manage the whole systems
    'managers', //For holding users that manage projects
    'programmers', //For users that only have access to code and sepecific tools
    'designers', //For users that only have access to the design and collaboration tools
    'writers' // For users writing documentation and such, only gives them access to the documentation tool
];

//The table names to use when creating the database tables
exports.tables = {
    projects: 'projects', //Table for holding the projects
    accounts: 'accounts', //Table for holding user accounts
    groups: 'groups', //Table for holding user groups
    memberships: 'memberships', // Table for holding what groups users are assigned to
};

exports.logging_prefixes = {
    server: 'Server',
    database: 'Database',
    projects: 'Projects',
    accounts: 'Accounts',
    groups: 'Groups',
    apps: 'Apps'
}
exports.logging_levels = {
    database: 0,
    apps: 1,
    server: 2,
}