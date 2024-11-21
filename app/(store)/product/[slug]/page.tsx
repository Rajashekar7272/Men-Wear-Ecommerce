import { imageUrl } from "@/lib/imageUrl";
import Image from 'next/image';
import { getAllProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import AddToBasketButton from "@/components/ui/AddToBasketButton";

export const dynamic = "force-static";
export const revalidate = 60;

async function ProductPage({
    params,
}: {
    params: Promise<{
    slug: string;
}>;
}) {
    
    const {slug} = await params;
    const product = await getAllProductBySlug(slug);

    if(!product){
        return notFound();
    }

    const isOutOfStock = product.stock != null && product.stock <= 0;


  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
            className={`relative aspect-square overflow-hidden rounded-lg mt-4
                shadow-lg border-2 border-gray-400 shadow-gray-500 ml-4 
                 ${isOutOfStock ? "opacity-50" : ""}`}
            >
                {product.image && (
                    <Image
                        src={imageUrl(product.image).url()} // Call the imported function
                        alt={product.name ?? "product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" // Ensure the image covers the container
                    />
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-white font-bold text-lg">Out of stock</span>
                    </div>
                )}  
            </div>
            <div className="felx flex-col justify-between mt-4">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <div className="text-xl font-semibold mb-4 text-green-600">
                        Price: {product.price?.toFixed(2)}Rs
                    </div>
                    <div className="prose max-w-none mb-6">
                        {Array.isArray(product.description) && (
                            <PortableText value={product.description}/>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <AddToBasketButton product={product} disabled={isOutOfStock} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductPage