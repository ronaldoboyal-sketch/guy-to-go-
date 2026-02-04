import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { StorageService } from '../services/storageService';
import { Search, ShoppingBag } from 'lucide-react';

interface HomeProps {
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(StorageService.getProducts());
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Teaching Resources for <span className="text-green-600">Guyana</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-slate-500">
          Find Ministry-approved guides, worksheets, and study materials tailored for the Guyanese classroom.
        </p>
      </div>

      <div className="mb-8 relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Search guides, subjects, or grades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group relative bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-w-3 aspect-h-2 bg-slate-200 group-hover:opacity-75 h-48">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                 <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                    {product.category}
                 </p>
                <h3 className="text-sm font-medium text-slate-900 mt-1">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-3">
                  {product.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-medium text-slate-900">
                  GYD ${product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
          <div className="text-center py-12">
              <p className="text-slate-500">No resources found matching your search.</p>
          </div>
      )}
    </div>
  );
};

export default Home;