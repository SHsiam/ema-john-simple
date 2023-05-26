import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link, useLoaderData } from 'react-router-dom';
import { key } from 'localforage';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    //pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const{totalProducts}=useLoaderData();
    const totalPages=Math.ceil(totalProducts/itemsPerPage);
    const pageNumbers=[...Array(totalPages).keys()];
    console.log(totalProducts);

    const options = [5, 10, 15, 20];
    function handleSelectChange(event) {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(0);
    }
    
    // useEffect(() => {
    //     fetch('https://ema-john-site-server.vercel.app/products')
    //         .then(res => res.json())
    //         .then(data => setProducts(data))
    // }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://ema-john-site-server.vercel.app/products?page=${currentPage}&limit=${itemsPerPage}`);

            const data = await response.json();
            setProducts(data);
        }
        fetchData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        
        const storeCard = getShoppingCart();
        const ids = Object.keys(storeCard);
        fetch(`https://ema-john-site-server.vercel.app/productsByIds`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(ids)
        })
            .then(res => res.json())
            .then(cartProducts => {
                const saveCart = [];
                //step1: get id
        for (const id in storeCard) {
            //step2: get the product by using id
            const addedProduct = cartProducts.find(product => product._id === id);
            if (addedProduct) {
                //step3: get quantity of the product
                const quantity = storeCard[id];
                addedProduct.quantity = quantity;
                //step4: add the added product to the save cart
                saveCart.push(addedProduct);
            }
        }
        //set5: set the cart
        setCart(saveCart);
    }, [])
            })
        
    const handleAddToCart = (product) => {
        // let newCart=[];
        const newCart = [...cart, product];
        //if product doesn't exist in the cart then set quantity= 1;
        //if exist update quantity by 1
        // const exists = cart.find(pd => pd.id === product.id);
        //     if(!exists){
        //         product.quantity = 1;
        //         newCart= [...cart, product]
        //     }
        //     else{
        //         exists.quantity = exists.quantity + 1;
        //         const remaining = cart.filter(pd => pd.id !== product.id);
        //         newCart = [...remaining, exists];
        //     }
        setCart(newCart);
        addToDb(product._id);
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
    return (
        <>
        <div className='shop-container'>
            <div className="products-containers">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}

                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>
        {/* Pagination */}
        <div className="pagination">
                <p>current Page: {currentPage} and items per page: {itemsPerPage}</p>
                {
                    pageNumbers.map(number => <button
                        key={number}
                        className={currentPage === number ? 'selected' : ''}
                        onClick={() => setCurrentPage(number)}
                    >{number + 1}</button>)
                }
                <select value={itemsPerPage} onChange={handleSelectChange}>
                    {options.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default Shop;