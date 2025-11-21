import axios from "axios";
// import type { User } from "../types/api.js";
import { type User } from "grammy/types";

export default async function regUser(user: User) {
    const { data } = await axios.post('http://localhost:7060/api/user/create', { 
        ...user,
        data: [],
        products: []
    });
    
    console.log(data);
}