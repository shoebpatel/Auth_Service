module.exports = async (req, res) => {
	console.log('Incoming Request::');
	console.log('req.body: ', req.body);

	const {
		Joi,
		bcrypt,
		sequelize,
		safePromise,
		_
	} = require('../helper/require-helper');

	const User = require('../model/user');
	const UserData = require('../model/userdata');

	const {
		firstName,
		lastName,
		organizationName,
		email,
		plainTextPassword,
		userTypeID
	} = req.body;

	const data = {
		firstName: firstName,
		lastName: lastName,
		organizationName: organizationName,
		email: email,
		plainTextPassword: plainTextPassword,
		userTypeID: userTypeID
	}

	const schema = Joi.object({
		firstName: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		lastName: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		organizationName: Joi.string()
			.min(3)
			.max(30)
			.required(),
		email: Joi.string().email().required(),
		plainTextPassword: Joi.string()
			.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
		userTypeID: Joi.number().min(1).max(3).required()
	});

	const {
		error
	} = schema.validate(data, {
		stripUnknown: true
	})

	if (error) {
		console.log('error101: ', JSON.stringify(error));

		const err = error && error.details && error.details[0] && error.details[0].message ? error.details[0].message : 'Something went wrong';

		return res.json({
			status: 'error',
			message: err
		}).status(500)
	}


	// * 2nd param is saltRounds
	const password = await bcrypt.hash(plainTextPassword, 10);
	const t = await sequelize.transaction();

	try {
		const [findUserErr, findUserRes] = await safePromise(User.findOne({
			where: {
				email: email
			}
		}, {
			transaction: t
		}));

		if (findUserErr) {
			console.log('findUserErr: ', findUserErr);
			return res.json({
				status: 'error',
				message: 'Something went wrong'
			}).status(500)
		}

		console.log('findUserRes: ', findUserRes);
		
		if (!_.isEmpty(findUserRes)) {
			return res.json({
				status: 'error',
				message: 'User already exists'
			})
		}

		const [createUserErr, createUserRes] = await safePromise(User.create({
			email,
			password,
			userTypeID: userTypeID,
			CreateDate: new Date(),
			UpdateDate: new Date(),
			Active: true
		}, {
			transaction: t
		}))

		if (createUserErr) {
			console.log('createUserErr: ', createUserErr);
			return res.json({
				status: 'error',
				message: 'Something went wrong'
			}).status(500)
		}

		let user = JSON.parse(JSON.stringify(createUserRes))

		const [registerUserDataErr, registerUserDataRes] = await safePromise(UserData.create({
			firstName,
			lastName,
			organizationName,
			userId: user.userId,
			CreateDate: new Date(),
			UpdateDate: new Date(),
			Active: true
		}, {
			transaction: t
		}));

		if (registerUserDataErr) {
			console.log('registerUserDataErr: ', registerUserDataErr);
			return res.json({
				status: 'error',
				message: 'Something went wrong'
			}).status(500)
		}

		console.log('registerUserData: ', registerUserDataRes);

		await t.commit();

		res.json({
			status: 'success',
			message: 'User created successfully.'
		}).status(200)
	} catch (error) {
		console.log('error102: ', error);

		await t.rollback();

		return res.json({
			status: 'error',
			message: 'Something went wrong'
		}).status(500)
	}
}