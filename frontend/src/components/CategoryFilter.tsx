import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  loading = false
}) => {
  const handleSelectAll = () => {
    if (selectedCategories.length === 0) {
      // Select all categories
      categories.forEach(category => {
        onCategoryChange(category.id, true);
      });
    } else {
      // Deselect all categories
      selectedCategories.forEach(categoryId => {
        onCategoryChange(categoryId, false);
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="all-categories"
            checked={selectedCategories.length === categories.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="all-categories" className="ml-2 text-sm font-medium text-gray-900">
            All Categories
          </label>
        </div>
        
        <hr className="border-gray-200" />
        
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => onCategoryChange(category.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-2 text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && !loading && (
        <p className="text-gray-500 text-sm">No categories available</p>
      )}
    </div>
  );
};

export default CategoryFilter;
