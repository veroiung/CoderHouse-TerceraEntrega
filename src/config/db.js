import mongoose from "mongoose";
/* import dotenv from "dotenv"; */
import envConfig from "./env.config.js";

/* dotenv.config() */

//conexion con patro singleton, la misma impide que se vuelva a abrir una nueva conexion a la base de datos por error

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
} 

    static getInstance() {
        if (this.#instance) {
            console.log("La conexión a la base de datos ya exite");
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {  
        try {
            await mongoose.connect(envConfig.mongoUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // Cambiar el nivel de escritura a 1 (menos seguro pero más rápido)
                w: 1,
            })
            console.log("Conectado con exito a MongoDB usando Mongoose.");
        } catch (error){
            console.error("No se pudo conectar a la BD usando Mongoose: " + error);
            process.exit();   
        }
    }
}

