import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
const savedUser = localStorage.getItem("user");
const store = configureStore({ reducer:{user:userSlice,cart:cartSlice}, preloadedState:{user:{user:savedUser?JSON.parse(savedUser):null}} });
store.subscribe(()=>{const s=store.getState(); if(s.user.user)localStorage.setItem("user",JSON.stringify(s.user.user)); else localStorage.removeItem("user"); localStorage.setItem("cart",JSON.stringify(s.cart.items));});
export default store;
