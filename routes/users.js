var express = require('express')
const User = require('../models/user')
var router = express.Router()

/* Getting ALL */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/* Getting One by Id*/
router.get("/:id", getUser, (req, res) => {
  try {
    res.json(res.user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})


/* Updating One */
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.cin != null) {
    res.user.cin = req.body.cin
  }
  if (req.body.firstname != null) {
    res.user.firstname = req.body.firstname
  }
  if (req.body.lastname != null) {
    res.user.lastname = req.body.lastname
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })

  }
})

/* Deleting One */
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted User' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/* Creating One */
router.post("/", async (req, res, next) => {
  const user = new User({
    idCitizen: req.body.idCitizen,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    civilStatus: req.body.civilStatus,
    cin: req.body.cin,
    password: req.body.password,
    address: req.body.address
  })
  console.log("Posted Successfuly" + user)

  try {
    const newUser = await user.save();
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  res.user = user
  next()
}

module.exports = router;
