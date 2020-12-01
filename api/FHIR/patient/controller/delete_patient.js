const mongodb = require('models/mongodb');
const {getDeleteMessage , handleError} = require('../../../../models/FHIR/httpMessage');

const errorMessage = {
    "message" : "" , 
    "code" : ""
}

module.exports  = async function(req ,res) {
    let resFunc = {
        "true" : (doc) => {
            if (!doc) {
                let errorMessage = `not found Patient/${req.params.id}`;
                return res.status(404).json(handleError["not-found"](errorMessage));
            }
            return res.status(200).json(getDeleteMessage("Patient" , req.params.id));
        } , 
        "false" : (doc) => {
            return res.status(errorMessage.code).send(errorMessage);
        }
    }
    let [status , doc] = await deletePatient(req);
    return resFunc[status.toString()](doc);
}

async function deletePatient (req) {
    return new Promise((resolve)=> {
        const id = req.params.id;
        mongodb.patients.findOneAndDelete({id : id} , (err , doc)=> {
            if (err) {
                console.log(err);
                errorMessage.code = 500;
                errorMessage.message = err;
                return resolve([false , err]);
            } 
            return resolve([true, doc]);
        })
    });
}