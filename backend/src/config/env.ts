import dotenv from "dotenv"

dotenv.config();

export const CONFIG ={
 API_KEY: process.env.API_KEY,
 API_HOST: process.env.API_HOST,
 BASE_URL: process.env.BASE_URL,
 PORT: process.env.PORT

}

export default CONFIG
