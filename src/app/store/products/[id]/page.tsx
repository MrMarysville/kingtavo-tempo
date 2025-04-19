import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock product data - in a real app, this would come from your database
  const product = {
    id: params.id,
    name: "Premium Hoodie",
    description:
      "Heavy-weight cotton blend hoodie with front pocket and adjustable drawstring hood. Perfect for screen printing or embroidery.",
    price: 49.99,
    image_url:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80",
    ],
    colors: ["Black", "Navy", "Gray", "Red"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    features: [
      "80% cotton, 20% polyester",
      "Double-lined hood with matching drawstring",
      "Front pouch pocket",
      "Ribbed cuffs and waistband",
      "Available for screen printing and embroidery",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/store/products"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.gallery.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg border cursor-pointer hover:border-blue-500"
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-2xl font-bold mt-4">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className="rounded-md px-3 py-1 text-sm"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className="rounded-md px-3 py-1 text-sm"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">
                    -
                  </button>
                  <span className="px-4 py-2">1</span>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">
                    +
                  </button>
                </div>
                <Button className="flex-1 gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <h3>Product Description</h3>
              <p>
                Our Premium Hoodie is designed for comfort and durability. Made
                from a heavy-weight cotton blend, it's perfect for screen
                printing or embroidery for your team, event, or business.
              </p>
              <p>
                The double-lined hood provides extra warmth, while the front
                pouch pocket offers convenient storage. The ribbed cuffs and
                waistband ensure a comfortable fit that retains its shape over
                time.
              </p>
              <p>
                Available in multiple colors and sizes, this hoodie is a
                versatile addition to any wardrobe and an excellent canvas for
                your custom designs.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="prose max-w-none">
              <h3>Product Specifications</h3>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Material</td>
                    <td className="py-2">80% cotton, 20% polyester</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Weight</td>
                    <td className="py-2">320 gsm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Fit</td>
                    <td className="py-2">Regular fit</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Care</td>
                    <td className="py-2">Machine wash cold, tumble dry low</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Decoration Areas</td>
                    <td className="py-2">Front, back, sleeves</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>

              <div className="space-y-4">
                {/* Sample reviews */}
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Great quality hoodie</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                  <p className="mt-2 text-sm">
                    The quality of this hoodie is excellent. The material is
                    thick and warm, perfect for colder weather. Our team logo
                    was printed beautifully on it.
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    John D. - Verified Buyer
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Perfect for our team</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 month ago</span>
                  </div>
                  <p className="mt-2 text-sm">
                    We ordered these hoodies for our entire department and
                    everyone loves them. The embroidery came out great and the
                    sizing was accurate.
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    Sarah M. - Verified Buyer
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
