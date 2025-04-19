import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FileUp, Palette, Shirt, Upload } from "lucide-react";

export default function CustomOrderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Custom Order Request</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell us about your custom apparel needs and we'll provide you with a
            quote. Our team specializes in screen printing, embroidery, and DTG
            printing for teams, events, and businesses.
          </p>
        </div>

        <Tabs defaultValue="screen-printing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="screen-printing"
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Screen Printing
            </TabsTrigger>
            <TabsTrigger value="embroidery" className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Embroidery
            </TabsTrigger>
            <TabsTrigger value="dtg" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              DTG Printing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screen-printing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Screen Printing Quote Request</CardTitle>
                <CardDescription>
                  Perfect for larger quantities and vibrant, durable designs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(123) 456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input id="company" placeholder="Your Company" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-type">Product Type</Label>
                    <select
                      id="product-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a product type</option>
                      <option value="t-shirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="hats">Hats</option>
                      <option value="polos">Polo Shirts</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colors">Number of Colors</Label>
                      <Input
                        id="colors"
                        type="number"
                        min="1"
                        max="8"
                        placeholder="2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="print-locations">Print Locations</Label>
                      <select
                        id="print-locations"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="front">Front Only</option>
                        <option value="back">Back Only</option>
                        <option value="front-back">Front & Back</option>
                        <option value="front-back-sleeve">
                          Front, Back & Sleeve
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artwork">Artwork Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop your artwork files here, or click to
                        browse
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: AI, EPS, PDF, PSD, JPG, PNG (high
                        resolution)
                      </p>
                      <Button variant="outline" className="mt-4">
                        Select Files
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea
                      id="details"
                      placeholder="Please provide any additional information about your order, including specific colors, sizes, or special requirements."
                      rows={4}
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Quote Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embroidery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Embroidery Quote Request</CardTitle>
                <CardDescription>
                  Professional and durable decoration for polos, hats, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Similar form fields as screen printing, with embroidery-specific options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-emb">Your Name</Label>
                      <Input id="name-emb" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-emb">Email Address</Label>
                      <Input
                        id="email-emb"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-type-emb">Product Type</Label>
                    <select
                      id="product-type-emb"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a product type</option>
                      <option value="polos">Polo Shirts</option>
                      <option value="hats">Hats</option>
                      <option value="jackets">Jackets</option>
                      <option value="bags">Bags</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Quote Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dtg" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>DTG Printing Quote Request</CardTitle>
                <CardDescription>
                  Direct-to-garment printing for full-color designs and small
                  quantities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Similar form fields as screen printing, with DTG-specific options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-dtg">Your Name</Label>
                      <Input id="name-dtg" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-dtg">Email Address</Label>
                      <Input
                        id="email-dtg"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-type-dtg">Product Type</Label>
                    <select
                      id="product-type-dtg"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a product type</option>
                      <option value="t-shirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Quote Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
