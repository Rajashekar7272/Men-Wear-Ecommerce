import ProductsView from "@/components/ui/ProductsView";
import Welcome from "@/components/ui/Welcome";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-static";
export const revalidate = 60;

// Ensure that the Home component is exported as an async function
export default async function Home() {
  // Fetch products and categories from the respective functions
  const products = await getAllProducts();
  const categories = await getAllCategories();
  
  return (
    <div>
      <Welcome />
      <div className="flex flex-col items-center justify-top min-h-screen bg-white p-4">
        {/* Pass products and categories to the ProductsView component */}
        <ProductsView products={products} categories={categories}/>
      </div>
    </div>
  );
}
