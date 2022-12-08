let express = require("express")
let router = express.Router()
let { createUser, userLogin } = require("../controllers/userController")
let { createdocument, getdocuments, updateDocument, deletedocument, getDocumentById }= require("../controllers/documentsController")
let { authenticate, authorise, authorisePutAndDelete } = require("../middleware/auth")


router.post("/register", createUser)
router.post("/login", userLogin)

router.post("/documents", authenticate, authorise, createdocument)
router.get("/documents", authenticate, getdocuments)
router.get("/documents/:documentId", authenticate, getDocumentById)
router.put("/documents/:documentId", authenticate, authorisePutAndDelete, updateDocument)
router.delete("/documents/:documentId", authenticate, authorisePutAndDelete, deletedocument)

module.exports = router;