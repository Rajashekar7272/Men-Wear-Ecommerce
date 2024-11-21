import ProductsGrid from "@/components/ui/ProductsGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";


async function SearchPage({
    searchParams,
} : {
    searchParams: Promise<{
        query: string
    }>;
}) {
    const { query } = await searchParams;
    const products = await searchProductsByName(query);

    if(!products.data){
        return (
            <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4
            ">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        No Products Found: {query}
                    </h1>
                    <p className="text-gray-600 text-center">
                        Try something searching different
                    </p>
                </div>
            </div>
        );
    }

    return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Search Results for {query}
            </h1>
            <ProductsGrid products={products.data} />
        </div>
    </div>
    );
}

export default SearchPage