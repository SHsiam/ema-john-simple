import React, { useContext } from 'react';
import './Header.css'
import logo from '../../images/Logo.svg'
import { Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
const Header = () => {
    const{user,logOut}=useContext(AuthContext);

    const handleSignOut=()=>{
        logOut()
        .then(result=>{})
        .catch(error=>{console.log(error)})
    }

    return (
        <nav className='header'>
            <img src={logo} alt="logo"/>
           <div>
                <Link to="/">Shop</Link>
                <Link to="/orders">Order</Link>
                <Link to="/inventory">Inventory</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">SignUp</Link>
                {user && <span className='text-white'> {user.email} <button onClick={handleSignOut}>Sign Out</button></span>}
           </div>
        </nav>
    );
};

export default Header;