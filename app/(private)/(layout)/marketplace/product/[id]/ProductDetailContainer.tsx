'use client'

import React, { useEffect, useState } from "react";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "@/types/marketplace";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, MessageCircle, Package, Tag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProductDetailContainer = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { fetchProductById, loading } = useMarketplaceProducts();
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;

    (async () => {
      try {
        const res = await fetchProductById(productId);
        if (mounted) setProduct(res);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load product");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId, fetchProductById]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-destructive text-lg font-medium mb-4">{error}</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Marketplace
      </button>

      {loading || !product ? (
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <Skeleton className="w-full aspect-square md:aspect-[4/3] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Image Gallery Column */}
          <motion.div variants={fadeIn} className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative rounded-2xl border bg-card p-4 md:p-8 flex items-center justify-center aspect-square md:aspect-[4/3] overflow-hidden shadow-sm">
              {product.imageurl?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.imageurl.url}
                  alt={product.productName}
                  className="max-h-full w-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-muted/30 flex flex-col items-center justify-center text-muted-foreground rounded-xl">
                  <Package className="h-16 w-16 mb-4 opacity-50" />
                  <p className="font-medium">No image available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details Column */}
          <motion.div variants={fadeIn} className="flex flex-col h-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {product.category ?? "Uncategorized"}
              </Badge>
              <Badge 
                variant={product.stock && product.stock > 0 ? "default" : "destructive"} 
                className="px-3 py-1 text-sm font-medium"
              >
                {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              {product.productName}
            </h1>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-sm font-semibold text-muted-foreground">PKR</span>
              <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {Number(product.price).toLocaleString()}
              </span>
            </div>

            <Separator className="my-6" />

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description ?? "No description provided for this product."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-muted/50 border-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Package className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Available Stock</span>
                  <span className="text-lg font-bold">{product.stock ?? 0} units</span>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50 border-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <User className="h-6 w-6 text-emerald-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Seller ID</span>
                  <span className="text-sm font-bold truncate w-full" title={product.ownerUid}>
                    {product.ownerUid.substring(0, 8)}...
                  </span>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
              <Button size="lg" className="flex-1 text-lg h-14 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 group">
                <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="flex-1 text-lg h-14 group">
                <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Contact Seller
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetailContainer;
