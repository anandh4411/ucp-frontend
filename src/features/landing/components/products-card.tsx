import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Package, Sparkles } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  category: string;
  image?: string;
}

export interface ProductExtended extends Product {
  subCategory: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  products: ProductExtended[];
}

export interface MainCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  subCategories: SubCategory[];
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      className={cn(
        "bg-white/[0.05] border-white/[0.1] backdrop-blur-sm relative overflow-hidden",
        "hover:border-blue-400/[0.4] transition-all duration-300",
        "hover:shadow-[0_8px_24px_0_rgba(59,130,246,0.15)]",
        "hover:translate-y-[-4px]",
        "rounded-3xl",
        "w-[280px]"
      )}
    >
      {/* Popular Badge */}
      {product.isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-white/[0.2] backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-normal">
            <Sparkles className="h-3 w-3" />
            Popular
          </div>
        </div>
      )}

      {/* Product Image with padding */}
      <div className="p-3 mt-2">
        <div className="relative h-44 bg-gradient-to-br from-blue-500/[0.1] to-purple-500/[0.05] rounded-2xl flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Package className="h-14 w-14 text-blue-400/30" />
          )}
        </div>
      </div>

      {/* Content - Compact */}
      <div className="px-4 pb-4">
        <h3 className="text-base font-semibold text-white mb-1 leading-tight">
          {product.name}
        </h3>

        <p className="text-white/50 text-xs mb-3 line-clamp-2 leading-relaxed font-light">
          {product.description}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">
            {product.price}
          </div>

          <button className="bg-white/[0.15] hover:bg-white/[0.25] text-white px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-200">
            <ArrowRight />
          </button>
        </div>
      </div>
    </Card>
  );
}
