var express = require('express')
const User = require('../models/user')
const Address = require('../models/address')
const Municipality = require('../models/municipality')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const multer = require('../multer-config')
const nodemailer = require('nodemailer')

var router = express.Router()

/*MailSender*/
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "gbhy1919@gmail.com",
    pass: "hellsinghakuda147"
  }
})
const options = {
  from: "gbhy1919@gmail.com",
  to: "ghazi.benhadjyahia@esprit.tn",
  subject: "Sending This from Backend Baladeyti",
  text: "Tanséch bech tna9ess mel dokhan"
}


/* Login */

router.post('/login', getUserByMail, async (req, res, next) => {
  if (res.user == null) {
    return res.status(400).send('Incorrect user')
  }
  try {
    if (await bcrypt.compare(req.body.password, res.user.password)) {
      const token = jwt.sign({ emailAddress: res.user.emailAddress }, "SECRET")
      if (token) {
        transporter.sendMail(options, function (err, info) {
          if (err) {
            console.log(err)
            return;
          }
          console.log("Sent " + info.response)
        })
        res.json({
          token: token,
          user: res.user,
          message: "Succes"
        })
      }
    } else {
      res.json({ message: "not allowed" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})



/* Getting ALL */
router.get('/',authentificateToken, async (req, res, next) => {
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
  if (req.body.password != null) {
    const hashed = Bcrypt.hash(req.body.password)
    res.user.password = hashed
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
router.post("/", multer, async (req, res, next) => {
  const municipality = new Municipality({

  })
  const address = new Address({
    street: req.body.street,
    city: req.body.street,
    state: req.body.street,
    postalCode: req.body.street,
    country: req.body.street,
  })
  /* this is the salt */
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    civilStatus: req.body.civilStatus,
    cin: req.body.cin,
    password: hashedPassword,
    photoProfil: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`,
    address: address
  })
  console.log("Posted Successfuly" + user)
  console.log("this is the fkn salt " + salt)
  console.log("this is the hashedPassword " + hashedPassword)

  try {
    const newUser = await user.save();
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


/*MiddleWares*/
/* Token auth
*/
async function authentificateToken(req, res, next) {
  const autHeader = req.headers['authorization']
  const token = autHeader && autHeader.split(' ')[1]

  if (token == null) return res.status(401).json({ reponse: "no token" })

  jwt.verify(token, "SECRET", (err, user) => {
    if (err) return res.status(403).json({ reponse: "token invalide" })
    req.user = user
    next()
  })

}

/*User by email
*/
async function getUserByMail(req, res, next) {
  let user
  try {
    user = await User.findOne({ emailAddress: req.body.emailAddress })
    if (user == null) {
      return res.status(404).json({ reponse: "mail non trouve" })
    }

  } catch (error) {
    return res.status(500).json({ reponse: error.message })
  }
  res.user = user
  next()
}



/*User by ID 
*/
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


/*  find by Email and remove

const {email} = req.body
const user = await User.findOne({
  email
})
user.skills = user.skills.filter((el) => {
  return el.label != "JS"

})
await user.save() */


/* find , save , remove */