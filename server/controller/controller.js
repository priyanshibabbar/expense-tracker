const model = require('../models/model');

// post: http://localhost:8080/api/categories
async function create_Categories(req, res) {
    const Create = new model.Categories({
        type: "Investment",
        color: "#fcbe44", // dark
    });

    try {
        await Create.save();
        return res.json(Create);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: `Error while creating categories ${err}` });
    }
}

//  get: http://localhost:8080/api/categories
async function  get_Categories(req, res){
    let data = await model.Categories.find({})

    let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color}));
    return res.json(filter);
    // return res.json(data)
}


// post: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    if (!req.body) return res.status(400).json("Post HTTP data not provided");
    let { name, type, amount } = req.body;

    const create = new model.Transaction({
        name,
        type,
        amount,
        date: new Date(),
    });

    try {
        await create.save();
        return res.json(create);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: `Error while creating transaction ${err}` });
    }
}


// get: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
    let data = await model.Transaction.find({})
    return res.json(data)
}


// delete: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Request Body not found" });

    try {
        await model.Transaction.deleteOne(req.body);
        return res.json("Record deleted!");
    } catch (err) {
        console.log(err);
        return res.json("Error while deleting transaction record!");
    }
}


// get: http://localhost:8080/api/labels
async function get_Labels(req, res) {
    model.Transaction.aggregate([
        {
            $lookup : {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind :"$categories_info"
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, {_id:v._id, name:v.name, type:v.type, amount: v.amount, color: v.categories_info['color']}));
        res.json(data)
    }).catch(error => {
        res.status(400).json("Lookup Collection Error")
    })
}



module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};