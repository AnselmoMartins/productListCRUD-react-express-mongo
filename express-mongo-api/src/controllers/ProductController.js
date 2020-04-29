const mongoose = require('mongoose');
const Product = mongoose.model('Product');


module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query
    const products = await Product.paginate({}, {page, limit: 10});
    
    return res.json(products);
  },

  async show(req, res, next) {
    const { id }  = req.params;

    try{
      const product = await Product.findById(id)
      
      return res.json({product})
    }
    catch(err){
      return res.status(404).json({error: {message: err.message}});
    }
  },

  async store (req, res) {
    const { title, description, url } = req.body;

    const hasProduct = await Product.findOne({url});

    try{
      if(!hasProduct){
        const product = await Product.create({title, description, url});
  
        return res.json({product: product._id});
      }
  
      return res.json({error: 'This Product already exists'})
    }
    catch(err) {
      return res.json({error: {message: err.message}})
    }
   
  },

  async update (req, res) {
    const { id } = req.params;

    try{
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

      return res.json(product);
    }
    catch(err){
      return res.json({error: {message: err.message}})
    }
 
  },

  async destroy (req, res) {
    const { id } = req.params;

    try{
      const productDel = await Product.findByIdAndDelete(id);
    
      if(productDel) return res.send();
      
    }
    catch(err){
      return res.json({error: {message: err.message}})
    }
   
  }

};
