import envConfig from "../config/env.config.js"
import MongoSingleton from "../config/db.js"

let userService
let productService
let cartService
let ticketService


async function initializeMongoService() {
    console.log("Iniciando DAO servicio para MongoDB");
    try {
        await MongoSingleton.getInstance()

        //Inicializo distinitos servicios
        const { default: UserDaoMongo } = await import("./dao/mongo/user.services.js")
        userService = new UserDaoMongo()

        const { default: ProductDaoMongo } = await import("./dao/mongo/product.services.js")
        productService = new ProductDaoMongo()

        const { default: CartDaoMongo } = await import("./dao/mongo/cart.services.js")
        cartService = new CartDaoMongo()

        const { default: TicketDaoMongo } = await import("./dao/mongo/ticket.services.js")
        ticketService = new TicketDaoMongo()

    } catch (error) {
        console.error("Error al inicializar el servicio de MongoDB", error);
        process.exit(1)
    }
};

switch (envConfig.persistence) {
    case "mongo":
        initializeMongoService()
        break;
    
    default:
        console.error("Persistencia no valida en la configuracion: " + envConfig.persistence);
        break;

}


export { userService, productService, cartService, ticketService }