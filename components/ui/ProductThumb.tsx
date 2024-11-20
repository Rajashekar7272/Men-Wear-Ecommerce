import { Product } from '@/sanity.types';
import Link from 'next/link';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl'; // Use the correct imported function

interface ProductThumbProps {
    product: Product; // Ensure this matches your Product type structure
}

function ProductThumb({ product }: ProductThumbProps) {
    const isOutOfStock = product.stock != null && product.stock <= 0;

    return (
        <Link
            href={`/product/${product.slug?.current}`}
            className={`group flex flex-col bg-white rounded-lg border-2 border-gray-300
                 shadow-sm hover:shadow-sm transition-all duration-200
                 overflow-hidden ${isOutOfStock ? 'opacity-50' : ''}`}
        >
            <div className="relative aspect-square w-full h-full overflow-hidden hover:scale-110 
            transition-all">
                {product.image && (
                    <Image
                        src={imageUrl(product.image).url()} // Call the imported function
                        alt={product.name || "product image"}
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
            <div className='p-4'>
                <h2 className='text-lg font-semibold text-gray-800 truncate'>
                    {product.name}
                </h2>

                <p className='mt-2 text-sm text-gray-600 line-clamp-2'>
                    {product.description
                    ?.map((block) => 
                    block._type === "block"
                    ? block.children?.map((child) => child.text).join("")
                : "")
                .join("") || "No description available"
                }
                </p>
                <p className='mt-2 text-lg font-bold text-green-600'>
                    Price: {product.price?.toFixed(2)}Rs
                </p>
            </div>
        </Link>
    );
}

export default ProductThumb;
