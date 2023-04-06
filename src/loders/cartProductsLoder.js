import { getShoppingCart } from "../utilities/fakedb";

 const cartProductsLoder = async() =>{
    const loderProducts=await fetch('products.json');
    const products = await loderProducts.json();

    const storedCard= getShoppingCart();
    const saveCarts=[];
    for(const id in storedCard){
        const addedProducts =products.find(pd => pd.id === id);
        if(addedProducts){
            const quantity =storedCard[id];
            addedProducts.quantity =quantity;
            saveCarts.push(addedProducts);
        }
    }

    // if you need return two thing use like this
    // return[products, saveCarts];
    // another things 
    // return { products, cart: saveCarts}
    
    return saveCarts;
    
 }
 export default cartProductsLoder;