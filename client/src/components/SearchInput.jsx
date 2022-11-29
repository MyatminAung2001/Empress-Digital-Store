import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

const SearchInput = () => {

    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const searchInputHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/shop/?query=${query}` : '/shop')
    };

    return (
        <form onSubmit={searchInputHandler}>
            <div className="flex items-center border px-2 py-1 rounded-md">
                    <button type="submit"> 
                        <MdSearch 
                            size={22} 
                            className="cursor-pointer" 
                        />
                    </button>
                    <input 
                        type="text" 
                        placeholder="Search Product"
                        onChange={(e) => setQuery(e.target.value)}
                        className="px-2 py-1 placeholder:text-sm focus:outline-none w-[100%]"
                    />   
            </div>
        </form>
    )
};

export default SearchInput