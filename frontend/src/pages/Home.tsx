import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchQuery = searchParams.get('search') || '';
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategories, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Golang E-Commerce</h1>
          <p className="text-lg md:text-xl mb-4">Find your favorite products with the best price and fast delivery!</p>
          <div className="flex gap-2">
            <a href="#products" className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-100 transition">Shop Now</a>
          </div>
        </div>
        <img src="/hero-shopping.svg" alt="Shop" className="w-40 md:w-64 mt-6 md:mt-0 drop-shadow-xl" />
      </section>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-900">
              Search results for "{searchQuery}"
            </h2>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:w-1/4">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            loading={false}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Products Grid */}
          {productsLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div id="products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {searchQuery || selectedCategories.length > 0
                  ? 'No products found matching your criteria'
                  : 'No products available'}
              </div>
              <img src="/empty-state.svg" alt="No products" className="mx-auto w-48 opacity-60" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Products Grid */}
          {productsLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {searchQuery || selectedCategories.length > 0
                  ? 'No products found matching your criteria'
                  : 'No products available'}
              </div>
              {(searchQuery || selectedCategories.length > 0) && (
                <button
                  onClick={() => {
                    clearSearch();
                    setSelectedCategories([]);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
