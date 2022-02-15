const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUser = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        })
    }
    const regex = new RegExp(term, 'i');
    const users = await User.find({ 
        $or: [ {name: regex}, { email: regex } ],
        $and: [{ status: true }]
     })
    return res.json({
        results: users
    })
}

const searchCategory = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const categery = await Category.findById(term);
        return res.json({
            results: (categery) ? [categery] : []
        })
    }
    const regex = new RegExp(term, 'i');
    const categories = await Category.find({
        name: regex,
        status: true
    })
    return res.json({
        results: categories
    })
}

const searchProduct = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const product = await Product.findById(term).populate('category','name');
        return res.json({
            results: (product) ? [product] : []
        })
    }
    const regex = new RegExp(term, 'i');
    const products = await Product.find({
        name: regex,
        status: true
    })
    .populate('category','name');
    return res.json({
        results: products
    })
}

const search = async (req = request, res = response) => {
    
    const { collection, term } = req.params;
    console.log(collection);
    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            msg: 'Las colecciones permitidas son ' + allowedCollections
        })
    }

    switch (collection) {
        case 'users': 
            searchUser(term, res);
            break;
        case 'categories':
            searchCategory(term, res);
            break; 
        case 'products':
            searchProduct(term, res);
            break;
        default: 
        res.status(500).json({
            msg: 'Error'
        })
    }
}

module.exports = {
    search
}