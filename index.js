require("dotenv").config();
const express = require("express");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const path = require('path');
const moment = require('moment');

const port = process.env.PORT;

const app = express();

database.connect();

//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

// Flash
app.use(cookieParser("abcxyz"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
