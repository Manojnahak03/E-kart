import { Product } from "./models/productModel.js";
import { User } from "./models/userModel.js";
import bcrypt from "bcryptjs";

const products = [
{name:"iPhone 16 Pro",description:"Pro camera system, titanium design and powerful performance.",price:109999,originalPrice:119999,category:"Smartphones",image:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80",stock:20,featured:true},
{name:"Samsung Galaxy S25",description:"Flagship Android experience with a stunning display.",price:74999,originalPrice:79999,category:"Smartphones",image:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",stock:18,featured:true},
{name:"OnePlus 13",description:"Fast flagship performance with a premium AMOLED display.",price:64999,originalPrice:69999,category:"Smartphones",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",stock:24,featured:false},
{name:"MacBook Air M3",description:"Light, fast and made for work, study and creativity.",price:89999,originalPrice:99999,category:"Laptops",image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",stock:12,featured:true},
{name:"Dell XPS 13",description:"Compact premium laptop for productivity and coding.",price:104999,originalPrice:114999,category:"Laptops",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",stock:10,featured:false},
{name:"Sony WH-1000XM5",description:"Premium noise cancelling wireless headphones.",price:24999,originalPrice:29999,category:"Audio",image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",stock:35,featured:true},
{name:"JBL Flip 6",description:"Portable waterproof Bluetooth speaker with powerful sound.",price:9999,originalPrice:12999,category:"Audio",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",stock:30,featured:false},
{name:"Apple Watch Series 10",description:"Health, fitness and smart features on your wrist.",price:42999,originalPrice:46999,category:"Wearables",image:"https://images.unsplash.com/photo-1546868871-7041f2a55e5c?auto=format&fit=crop&w=700&q=80",stock:22,featured:false},
{name:"iPad Air",description:"Powerful tablet for notes, entertainment and creativity.",price:59999,originalPrice:64999,category:"Tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80",stock:15,featured:false},
{name:"Samsung Galaxy Tab S9",description:"Premium Android tablet for study and entertainment.",price:52999,originalPrice:57999,category:"Tablets",image:"https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=80",stock:14,featured:false},
{name:"Logitech MX Master 3S",description:"Ergonomic wireless mouse for work and coding.",price:7999,originalPrice:8999,category:"Accessories",image:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",stock:40,featured:false},
{name:"Anker 65W Charger",description:"Compact multi-device fast charger with USB-C power delivery.",price:3999,originalPrice:4999,category:"Accessories",image:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80",stock:50,featured:false}
];

export async function seedProducts(){
  for(const item of products){ await Product.updateOne({name:item.name},{$setOnInsert:item},{upsert:true}); }
  const email=(process.env.ADMIN_EMAIL||"").trim().toLowerCase(); const password=process.env.ADMIN_PASSWORD||"";
  if(email && password){ const hash=await bcrypt.hash(password,10); await User.updateOne({email},{$set:{firstName:process.env.ADMIN_FIRST_NAME||"Manoj",lastName:process.env.ADMIN_LAST_NAME||"Admin",password:hash,role:"admin",isVerified:true}},{upsert:true}); }
  console.log("Products/admin seed checked");
}
