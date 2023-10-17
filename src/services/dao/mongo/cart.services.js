import { CartModel } from "./models/cartModel.js";
import { ProductModel } from "./models/productModel.js";


export default class CartServices {
    
    //services create cart
    createCart = async (data)=> {
        let cart = CartModel.create(data);
        return cart;     
    };

    //services get cart by id
    getCartById = async (id)=> {
        const cart = await CartModel.findOne(id).populate('products.product');
        if (cart) {
            return cart; 
        } else {
            return null;
            }
    };

    //services add product to cart
    prodInCart= async (cid, pid)=> {
        const cart = await CartModel.findOne(cid);
        const product = await ProductModel.findOne(pid); 
        if (cart && product) {
            const existingProduct = cart.products.find(p => p.product._id.toString() === product._id.toString());
            if (existingProduct) {
                existingProduct.quantity +=1;
            } else {
                cart.products.push({ "product": product._id, "quantity": 1});}// Si el producto no existe en el carrito, lo agregamos
            await cart.save();// Guardamos los cambios en el carrito
            return cart;
        } else {
            return null;
        }
    };

    //services delete product in cart
    deleteProdInCart = async (cid, pid)=> {
        const cart = await CartModel.findOne(cid );
        const product = await ProductModel.findOne(pid); 
        
        if (cart && product) {
            const existingProduct = cart.products.find(p => p.product._id.toString() === product._id.toString());
            if (existingProduct) {
                cart.products.splice(cart.products.indexOf(existingProduct), 1);
            }
            await cart.save();
            return cart;
        } else {
            return null;
        }
};

    //services reduce product in cart
    reduceProdQuantity = async (cid, pid)=> {
        const cart = await CartModel.findOne(cid );
        const product = await ProductModel.findOne(pid); 
        
        if (cart && product) {
            const existingProduct = cart.products.find(p => p.product._id.toString() === product._id.toString());
            if (existingProduct) {
                existingProduct.quantity > 1 ?
                existingProduct.quantity -=1 :
                cart.products.splice(cart.products.indexOf(existingProduct), 1);
            }
            await cart.save();
            return cart;
        } else {
            return null;
        }
    };

    //services delete all products in cart
    deleteAll = async (cid)=> {
        const cart = await CartModel.findOne(cid);     
        if (cart) {
            cart.products.splice (0, cart.products.length);
            await cart.save();
            return cart;
        } else {
            return null;
        }
    };

    cartRender = async (cid, page) => {
        const cartProducts= await CartModel.paginate({_id : cid},{page, lean: true, populate: {path : 'products.product'}  })

        if (!cartProducts) {
            return res.status(404).send('Carrito no encontrado');
        }else {
            return cartProducts;
        }
    };

}
