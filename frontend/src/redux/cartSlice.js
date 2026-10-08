import { createSlice } from "@reduxjs/toolkit";
const saved = JSON.parse(localStorage.getItem("cart") || "[]");
const cartSlice = createSlice({ name: "cart", initialState: { items: saved }, reducers: {
  addToCart: (state, action) => { const p=action.payload; const found=state.items.find(i=>i._id===p._id); if(found) found.quantity += 1; else state.items.push({...p,quantity:1}); localStorage.setItem("cart",JSON.stringify(state.items)); },
  removeFromCart: (state, action) => { state.items=state.items.filter(i=>i._id!==action.payload); localStorage.setItem("cart",JSON.stringify(state.items)); },
  updateQty: (state, action) => { const f=state.items.find(i=>i._id===action.payload.id); if(f) f.quantity=Math.max(1,action.payload.quantity); localStorage.setItem("cart",JSON.stringify(state.items)); },
  clearCart: state => { state.items=[]; localStorage.removeItem("cart"); }
}});
export const {addToCart,removeFromCart,updateQty,clearCart}=cartSlice.actions;
export default cartSlice.reducer;
