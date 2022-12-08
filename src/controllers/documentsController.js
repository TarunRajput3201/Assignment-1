const documentsModel = require("../models/documentsModel.js");
const userModel = require("../models/userModel.js");
const {uploadFile}=require("./awsController")
const mongoose = require("mongoose");

const {
  validateString,
  validateRequest,
  validateObjectId,

} = require("../validator/validation");


const createdocument = async function (req, res) {
  try {
    res.setHeader("access-control-allow-origin","*")
    let { title,userId, document } = req.body;
    let documentObject = {};
    if (!validateRequest(req.body) || !document) {
      return res
        .status(400)
        .send({ status: false, message: "Please input valid request" });
    }
    let doc = req.files;
    if (doc && doc.length > 0) {
      let uploadedFileURL = await uploadFile(doc[0]);
      
      documentObject.document=uploadedFileURL
    } else {
     return  res.status(400).send({status:false, message: "please provide document cover" });
    }
    if (title) {
      if (!validateString(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid title" });
      } else {
        documentObject.title = title;
      }
    } else {
      return res.status(400).send({ status: false, message: "Title is required" });
    }

    if (title) {
      if (!validateString(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid title" });
      }
      const isDuplicate = await documentsModel.find({ title: title });
      if (isDuplicate.length == 0) {
        documentObject.title = title;
      } else {
        return res.status(400).send({
          status: false,
          message: "This title is already present in documents collection",
        });
      }
    } else {
      return res.status(400).send({ status: false, message: "Title is required" });
    }

    

    if (!validateString(userId)) { return res.status(400).send({ status: false, message: "please provide userId" }) }
    if (!validateObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid userId" })
    }
    document.userId = userId
    let createdDocument = await documentsModel.create(document);
    res.status(201).send({ status: true, data: createdDocument });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =========================GET document QUERY PARAM =========================

const getdocuments = async function (req, res) {
  try {

    res.setHeader("access-control-allow-origin","*")
    const queryData = req.query
    let { userId, title } = queryData

    getFilter = Object.keys(queryData)
    if (getFilter.length) {
      for (let value of getFilter) {
        if (['title', 'userId'].indexOf(value) == -1)
          return res.status(400).send({ status: false, message: `You can't filter Using '${value}' ` })
      }
    }


    let obj = {
      isDeleted: false
    }

    if (Object.keys(queryData).length !== 0) {
       if (userId) {
        if (!validateObjectId(userId)) {
          return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        obj.userId = userId
      }
      if (title && validateString(title)) {
        obj.title = title
      }
     

    }


    let find = await documentsModel.find(obj)

    if (find.length == 0) {
      return res.status(404).send({
        status: false,
        message: "No such document found"
      })
    }
    res.status(200).send({
      status: true,
      message: "Documents List",
      data: find
    })
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message
    })
  }
}


// =========================GET document BY document ID =========================

const getDocumentById = async function (req, res) {
  try {
    res.setHeader("access-control-allow-origin","*")
    const documentId = req.params.documentId
    if (!validateObjectId(documentId)) {
      return res.status(400).send({
        status: false,
        message: "documentId invalid"
      })
    }
    const data = await documentsModel.find({ _id: documentId })


    if (!data) {
      return res.status(404).send({
        status: false,
        message: "Document does not exist"
      })
    }
  }
   catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message
    })

  }
}



// =========================UPDATE document BY documentID =========================

const updateDocument = async function (req, res) {

  try {
    res.setHeader("access-control-allow-origin","*")
    let id = req.params.documentId;
    let data = req.body;

    if (!validateObjectId(id)) { return res.status(400).send({ status: false, message: "please provide a valid documentId" }) }
    if (!validateRequest(data)) { return res.status(400).send({ status: false, message: "please provide body data" }) }
    let document = await documentsModel.findOne({ _id: id, isDeleted: false })

    if (!document) {
      return res.status(404).send({ status: true, message: 'No such document found' });
    }
    ;
    if (!validateString(data.title)) { return res.status(400).send({ status: false, message: "please provide valid title" }) }
    let duplicateTitle = await documentsModel.find({ title: data.title })



    if (duplicateTitle.length != 0) { return res.status(400).send({ status: false, message: "this title is already present" }) }
    else { document.title = data.title; }
    
    let updateData = await documentsModel.findOneAndUpdate({ _id: id }, { $set: document }, {
      new: true,
    });
    res.status(200).send({ status: true, message: " Data is Updated ", data: updateData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// =========================DELETE document BY document ID =========================

const deletedocument = async function (req, res) {
  try {
    res.setHeader("access-control-allow-origin","*")
    let documentId = req.params.documentId;

    if (!validateObjectId(documentId)) { return res.status(400).send({ status: false, msg: "Please enter a valid documentId" }) }
    let document = await documentsModel.findById(documentId);
    if (!document)
      return res.status(404).send({ status: false, msg: "document NOT FOUND" });
    if (document.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "This documentdata is already deleted" });
    }
    let newData = await documentsModel.findOneAndUpdate(
      { _id: documentId },
      {
        $set: {
          isDeleted: true, deletedAt:new Date
        }
      },
      { new: true }
    );
    res.status(200).send({ status: true, message: "Success" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createdocument, getdocuments, updateDocument, deletedocument, getDocumentById }
