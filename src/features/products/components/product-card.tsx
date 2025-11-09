// src/features/products/components/product-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PenIcon,
  TrashIcon,
  EyeIcon,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductData } from "@/types/dto/product.dto";

interface ProductCardProps {
  product: ProductData;
  onEdit: (product: ProductData) => void;
  onDelete: (product: ProductData) => void;
  onView: (product: ProductData) => void;
}

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onView,
}: ProductCardProps) => {
  return (
    <Card className="group hover:border-primary/20 transition-all w-[280px]">
      {/* Image Section */}
      <div className="p-3">
        <div className="relative h-40 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground/30" />
          )}

          {/* Actions overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(product)}>
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <PenIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(product)}
                  className="text-red-600"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="px-4 pb-4 pt-0">
        <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="text-lg font-semibold text-foreground">
          {product.price}
        </div>
      </CardContent>
    </Card>
  );
};
