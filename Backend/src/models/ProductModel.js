const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        title:{type: String,required: true,unique: true,index: true},
        images:{type: String,required: true},
        type:{type: String},
        author:{type: String},
        cost:{type: Number,required: true},//cost
        rate:{type: Number,required: true},
        inventory:{type: Number,required: true},//số lượng còn lại -countinStock
        description:{type: String},
        discount: {type: Number},
        sold: {type: Number}    //số lượng đã bán
    },
    {
        timestamps: true
    }
);
/* productSchema.index({  title: 1 }, { unique: true}); */

const Product = mongoose.model('Product',productSchema);

module.exports = Product;