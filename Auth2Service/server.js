const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const privateRoutes = require('./api/privateRoutes/privateRoutes');
const {
	BASE_URL_V1
} = require('./helper/constants.json')

if (!process.env.NODE_ENV) require('dotenv').config({
	path: __dirname + '/.env'
});

require('./helper/require-helper');

app.use(express.json());

app.use(BASE_URL_V1, privateRoutes);

// * REST Api for login
app.post('/api/login', require('./api/login'));

// * REST Api for signup
app.post('/api/signup', require('./api/signup'));

// * REST Api for signup
app.post('/api/requestResetPassword', require('./api/requestResetPassword'));

app.post('/api/passwordReset', require('./api/passwordReset'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(PORT, () => {
	console.log(`Server up at ${PORT}`);
})