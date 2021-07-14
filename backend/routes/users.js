const router = require('express').Router();
let User = require('../models/user.model.js');

router.route('/').get((req, res) => {
  User.find({"status.admitted": true })
	.then(users => res.json(users))
	.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
