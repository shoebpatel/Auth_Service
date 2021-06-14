const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const privateRoutes = require('./api/privateRoutes/privateRoutes');
const {
	BASE_URL_V1
} = require('./helper/constants.json')
const validateAuthToken = require('./middleware/authToken');

if (!process.env.NODE_ENV) require('dotenv').config({
	path: __dirname + '/.env'
});
require('./helper/require-helper');

app.use(express.json());

app.use(BASE_URL_V1, privateRoutes);

// * REST Api for registration
app.post('/api/signup', validateAuthToken, require('./api/signup'));

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


app.listen(port, () => {
	console.log(`Server up at ${port}`);
})