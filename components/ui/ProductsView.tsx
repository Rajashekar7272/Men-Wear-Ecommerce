import { Category, Product } from "@/sanity.types";
import ProductsGrid from "./ProductsGrid";

interface ProductsViewProps {
    products: Product[];
    categories: Category[];
}

const ProductsView = ({ products }: ProductsViewProps) => {
    return (
        <div className="flex flex-col">
             {/* Categories */}
            <div className="w-full sm:w-[200px]">

            </div>

            <div className="flex-1">

                <div>

                    <ProductsGrid products={products} />

                    <hr className="w-1/2 sm:w-3/4" />
                
                </div>
            </div>
        </div>
    );
};

export default ProductsView;
