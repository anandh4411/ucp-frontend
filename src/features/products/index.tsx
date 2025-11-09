// src/features/products/index.tsx
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree, Package as PackageIcon, Loader2 } from "lucide-react";
import { ProductCard } from "./components/product-card";
import { SubCategoryCard } from "./components/subcategory-card";
import { ProductFormModal } from "./components/product-form-modal";
import { SubCategoryFormModal } from "./components/subcategory-form-modal";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { ProductViewModal } from "./components/product-view-modal";
import { mainCategories, Product, SubCategory } from "./data/schema";
import { useProducts } from "@/api/hooks/products";
import { ProductData } from "@/types/dto/product.dto";

export default function Products() {
  // Dialog states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [activeMainCategory, setActiveMainCategory] = useState<string>(mainCategories[0].id);

  // Fetch products
  const queryParams = useMemo(() => ({
    mainCategoryId: activeMainCategory,
  }), [activeMainCategory]);

  const { data, isLoading, error } = useProducts(queryParams);
  const responseData = data?.data as { products: ProductData[]; subCategories?: SubCategory[] } | undefined;
  const products = responseData?.products || [];
  const subCategories = responseData?.subCategories || [];

  // Filter data
  const activeSubCategories = subCategories.filter(
    (sc) => sc.mainCategoryId === activeMainCategory
  );

  const activeProducts = products.filter(
    (p) => p.mainCategoryId === activeMainCategory
  );

  const productsBySubCategory = activeProducts.reduce((acc, product) => {
    if (!acc[product.subCategoryId!]) {
      acc[product.subCategoryId!] = [];
    }
    acc[product.subCategoryId!].push(product);
    return acc;
  }, {} as Record<string, ProductData[]>);

  // Action handlers
  const handleProductEdit = (product: ProductData) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleProductDelete = (product: ProductData) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleProductView = (product: ProductData) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleSubCategoryEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSubCategoryModalOpen(true);
  };

  const handleSubCategoryDelete = (subCategory: SubCategory) => {
    // TODO: API call
    if (confirm("Delete this sub category and all its products?")) {
      console.log("Deleting subcategory:", subCategory.id);
    }
  };

  const handleProductSubmit = (_data: any) => {
    // TODO: API call
    console.log("Product submit:", _data);
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubCategorySubmit = (_data: any) => {
    // TODO: API call
    console.log("SubCategory submit:", _data);
    setSubCategoryModalOpen(false);
    setSelectedSubCategory(null);
  };

  const handleDeleteConfirm = () => {
    // TODO: API call
    console.log("Deleting product:", selectedProduct?.id);
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[500] tracking-tight text-foreground">
          Products Management
        </h1>
        <p className="text-muted-foreground">
          Manage categories and products across all sections
        </p>
      </div>

      {/* Main Category Tabs */}
      <Tabs value={activeMainCategory} onValueChange={setActiveMainCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {mainCategories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="text-sm cursor-pointer"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {mainCategories.map((mainCat) => (
          <TabsContent
            key={mainCat.id}
            value={mainCat.id}
            className="space-y-8 mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">Failed to load products</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Sub Categories Section */}
                <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Sub Categories
                </h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedSubCategory(null);
                    setSubCategoryModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub Category
                </Button>
              </div>

              {activeSubCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSubCategories.map((subCat) => (
                    <SubCategoryCard
                      key={subCat.id}
                      subCategory={subCat}
                      productCount={productsBySubCategory[subCat.id]?.length || 0}
                      onEdit={handleSubCategoryEdit}
                      onDelete={handleSubCategoryDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <FolderTree className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No sub categories yet
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      setSelectedSubCategory(null);
                      setSubCategoryModalOpen(true);
                    }}
                  >
                    Create First Sub Category
                  </Button>
                </div>
              )}
            </div>

            {/* Products by Sub Category */}
            {activeSubCategories.map((subCat) => {
              const subCatProducts = productsBySubCategory[subCat.id] || [];

              return (
                <div key={subCat.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <PackageIcon className="h-4 w-4" />
                        {subCat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {subCat.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  {subCatProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {subCatProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onEdit={handleProductEdit}
                          onDelete={handleProductDelete}
                          onView={handleProductView}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        No products in this category yet
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty state if no sub categories */}
            {activeSubCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Create sub categories first to organize your products
                </p>
              </div>
            )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modals */}
      <SubCategoryFormModal
        open={subCategoryModalOpen}
        onOpenChange={setSubCategoryModalOpen}
        subCategory={selectedSubCategory || undefined}
        mainCategoryId={activeMainCategory}
        onSubmit={handleSubCategorySubmit}
      />

      <ProductFormModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={selectedProduct || undefined}
        subCategories={activeSubCategories}
        mainCategoryId={activeMainCategory}
      />

      {selectedProduct && (
        <>
          <ProductDeleteDialog
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            product={selectedProduct}
          />

          <ProductViewModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
