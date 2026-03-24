import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function CreateInvoice() {

const navigate = useNavigate();

const [customers,setCustomers] = useState([]);
const [variants,setVariants] = useState([]);

const [customer,setCustomer] = useState("");
const [address,setAddress] = useState("");
const [phone,setPhone] = useState("");

const [gstPercent,setGstPercent] = useState(18);
const [discount,setDiscount] = useState(0);
const [paidAmount,setPaidAmount] = useState(0);
const [note,setNote] = useState("");

const [items,setItems] = useState([
{ variant:"", price:0, sheets:1, length:0, width:0, unit:"" }
]);

useEffect(()=>{
fetchData();
},[]);

const fetchData = async ()=>{
try{
const cust = await API.get("customers/");
const varr = await API.get("variants/");
setCustomers(cust.data);
setVariants(varr.data);
}catch(err){
console.error(err);
}
};

const extractSize=(name)=>{
if(!name) return {length:0,width:0};

const match = name.match(/(\d+(\.\d+)?)x(\d+(\.\d+)?)/);

if(match){
return {
length: parseFloat(match[1]),
width: parseFloat(match[3])
};
}
return {length:0,width:0};
};

const handleCustomerChange=(id)=>{
setCustomer(id);

const selected = customers.find(c=>c.id == id);

if(selected){
setAddress(selected.address || "");
setPhone(selected.phone || "");
}
};

const handleVariantChange = (index, variantId) => {

const selected = variants.find(v => v.id == variantId);

const updated = [...items];

updated[index].variant = variantId;

if (selected) {

updated[index].price = parseFloat(selected.price) || 0;
updated[index].unit = selected.price_type || "SHEET";

const size = extractSize(selected.display_name);

updated[index].length = size.length;
updated[index].width = size.width;

}

setItems(updated);
};

const updateSheets=(index,value)=>{
const updated=[...items];
updated[index].sheets = parseFloat(value) || 1;
setItems(updated);
};

const addItem=()=>{
setItems([...items,{
variant:"",
price:0,
sheets:1,
length:0,
width:0,
unit:""
}]);
};

const removeItem=(index)=>{
setItems(items.filter((_,i)=>i!==index));
};

// ✅ SQFT logic
const getSqft = (item) => {
if(item.unit === "SHEET") return 0;
return (item.length || 0) * (item.width || 0);
};

// ✅ TOTAL logic SAME AS BACKEND
const getItemTotal = (item) => {

const price = parseFloat(item.price) || 0;
const qty = parseFloat(item.sheets) || 0;

if (item.unit === "SHEET") {
return price * qty;
}

if (item.unit === "SQFT") {
const sqft = (item.length || 0) * (item.width || 0);
return price * sqft * qty;
}

return 0;
};

const subtotal = items.reduce(
(sum,item)=> sum + getItemTotal(item),
0
);

const discountAmount = parseFloat(discount) || 0;

const taxableAmount = subtotal - discountAmount;

const cgst = (taxableAmount * gstPercent)/2/100;
const sgst = (taxableAmount * gstPercent)/2/100;

const totalGST = cgst + sgst;

const grandTotal = taxableAmount + totalGST;

const balance = grandTotal - paidAmount;

const handleSubmit = async ()=>{

try{

const payload={

customer,
address, // ✅ FIXED (NO shipping_address confusion)
phone,
gst_percent:gstPercent,
discount,
paid_amount:paidAmount,
note,

items:items.map(item=>({
product_variant:item.variant,
quantity:item.sheets
}))

};

const res = await API.post("invoices/",payload);

navigate(`/invoice/${res.data.id}`);

}catch(err){
console.error(err.response?.data);
alert("Error creating invoice");
}
};

return(

<div className="p-8 max-w-7xl mx-auto">

<h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>

<div className="grid md:grid-cols-3 gap-8">

<div className="md:col-span-2 space-y-6">

{/* CUSTOMER */}
<div className="bg-white p-6 rounded-xl shadow space-y-4">

<div>
<label className="block mb-1 font-medium">Customer</label>
<select
className="w-full border p-2 rounded"
value={customer}
onChange={(e)=>handleCustomerChange(e.target.value)}
>
<option value="">Select Customer</option>
{customers.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}
</select>
</div>

<div>
<label>Address</label>
<textarea
className="w-full border p-2 rounded"
rows="2"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>
</div>

<div>
<label>Phone</label>
<input
className="w-full border p-2 rounded"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>
</div>

</div>

{/* ITEMS */}
<div className="bg-white rounded-xl shadow">

<div className="bg-teal-600 text-white px-4 py-3 rounded-t-xl">
Invoice Items
</div>

<div className="p-4">

<div className="grid grid-cols-12 font-semibold border-b pb-2 mb-3">
<div className="col-span-5">PRODUCT</div>
<div className="col-span-2 text-right">RATE</div>
<div className="col-span-2 text-center">QTY</div>
<div className="col-span-1 text-center">SQFT</div>
<div className="col-span-2 text-right">AMOUNT</div>
</div>

{items.map((item,index)=>{

const sqft = getSqft(item);
const amount = getItemTotal(item);

return(

<div key={index} className="grid grid-cols-12 gap-3 mb-3 items-center">

<div className="col-span-5">
<select
className="w-full border p-2 rounded"
value={item.variant}
onChange={(e)=>handleVariantChange(index,e.target.value)}
>
<option value="">Select Product</option>
{variants.map(v=>(
<option key={v.id} value={v.id}>
{v.display_name}
</option>
))}
</select>
</div>

<div className="col-span-2 text-right">
₹ {item.price}
</div>

<div className="col-span-2">
<input
type="number"
value={item.sheets}
onChange={(e)=>updateSheets(index,e.target.value)}
className="w-full border p-2 text-center"
/>
</div>

<div className="col-span-1 text-center">
{item.unit === "SHEET" ? "-" : sqft}
</div>

<div className="col-span-2 text-right font-medium">
₹ {amount.toFixed(2)}
</div>

</div>

);

})}

<button onClick={addItem} className="text-green-600 mt-4">
+ Add Item
</button>

</div>
</div>

<button
onClick={handleSubmit}
className="bg-green-600 text-white px-6 py-2 rounded"
>
Save Invoice
</button>

</div>

{/* SUMMARY */}
<div className="bg-white p-6 rounded-xl shadow space-y-3">

<h2 className="font-semibold text-lg mb-4">Summary</h2>

<div className="flex justify-between">
<span>Subtotal</span>
<span>₹ {subtotal.toFixed(2)}</span>
</div>


<div className="flex justify-between">
<span>CGST</span>
<span>₹ {cgst.toFixed(2)}</span>
</div>

<div className="flex justify-between">
<span>SGST</span>
<span>₹ {sgst.toFixed(2)}</span>
</div>

<div className="flex justify-between font-semibold text-lg border-t pt-2">
<span>Grand Total</span>
<span>₹ {grandTotal.toFixed(2)}</span>
</div>

<div className="flex justify-between text-blue-600">
<span>Paid</span>
<span>₹ {paidAmount}</span>
</div>

<div className="flex justify-between text-red-600 font-semibold">
<span>Balance</span>
<span>₹ {balance.toFixed(2)}</span>
</div>

<div>
<label>Paid Amount</label>
<input
type="number"
value={paidAmount}
onChange={(e)=>setPaidAmount(parseFloat(e.target.value)||0)}
className="w-full border p-2 rounded"
/>
</div>

<div>
<label>Note</label>
<textarea
rows="3"
value={note}
onChange={(e)=>setNote(e.target.value)}
className="w-full border p-2 rounded"
/>
</div>

</div>

</div>

</div>

);

}