import { getShoppingCart } from "../utilities/fakedb";

 const cartProductsLoder = async() =>{
    
    const storedCard= getShoppingCart();
    const ids = Object.keys(storedCard);
    

    
    const loadedProducts = await fetch(`http://localhost:5000/productsByIds`, {
        method: 'POST', 
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(ids)
    });
    const products = await loadedProducts.json();

    const saveCarts=[];
    for(const id in storedCard){
        const addedProducts =products.find(pd => pd._id === id);
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