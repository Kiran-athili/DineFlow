export interface MenuCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface MenuCategoryRequest {
  categoryName: string;
  description?: string;
  imageUrl?: string;
}

export interface MenuItem {
  itemId: number;
  itemName: string;
  description: string;
  price: number;
  imageUrl: string;
  videoUrl: string;
  isAvailable: boolean;
  category: MenuCategory;
}

export interface MenuItemRequest {
  itemName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  videoUrl?: string;
  categoryId: number;
}