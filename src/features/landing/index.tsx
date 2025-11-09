import { motion } from "framer-motion";
import {
  Building,
  Users,
  Smartphone,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Fingerprint,
  GraduationCap,
  Briefcase,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductCard, { MainCategory, Product } from "./components/products-card";

// Card components inline
const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Hero components inline
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric() {
  // const fadeUpVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: (i: number) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 1,
  //       delay: 0.5 + i * 0.2,
  //       ease: [0.25, 0.4, 0.25, 1],
  //     },
  //   }),
  // };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030303] overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <img
              src="/logo.png"
              alt="Impressaa Logo"
              className="h-4 w-4 text-blue-500/80"
            />
            <span className="text-sm text-white/60 tracking-wide">
              impressaa
            </span>
          </motion.div>

          <motion.div
            custom={1}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                You imagine..
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                )}
              >
                We print !
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              From personalized gifts to professional prints - bringing your
              ideas to life with quality craftsmanship and attention to detail.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/40"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default function Landing() {
  // Ensure scrolling is enabled
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Sample products data (replace with API call later)
  // Categorized products data
  const categorizedProducts: MainCategory[] = [
    {
      id: "id-cards",
      name: "ID Cards",
      description: "Professional ID card solutions for institutions",
      icon: Building, // You can change this icon if needed
      subCategories: [
        {
          id: "schools",
          name: "Schools (K-12)",
          description: "Primary and secondary educational institutions",
          products: [
            {
              id: "school-basic",
              name: "School Starter",
              description: "Perfect for small schools and academies",
              price: "₹999",
              features: [
                "Up to 500 students",
                "Basic form builder",
                "Email support",
                "Student ID templates",
              ],
              category: "id-cards",
              subCategory: "schools",
            },
            {
              id: "school-pro",
              name: "School Professional",
              description: "Growing schools with advanced needs",
              price: "₹2,499",
              features: [
                "Up to 2,000 students",
                "Advanced forms",
                "CSV import",
                "Priority support",
              ],
              category: "id-cards",
              subCategory: "schools",
              isPopular: true,
            },
          ],
        },
        {
          id: "colleges",
          name: "Colleges & Universities",
          description: "Higher education institutions",
          products: [
            {
              id: "college-standard",
              name: "College Standard",
              description: "Perfect for colleges and universities",
              price: "₹4,999",
              features: [
                "Up to 10,000 students",
                "Multi-department support",
                "Bulk operations",
              ],
              category: "id-cards",
              subCategory: "colleges",
            },
          ],
        },
        {
          id: "corporate",
          name: "Corporate",
          description: "Employee ID cards for businesses",
          products: [
            {
              id: "corporate-basic",
              name: "Corporate Package",
              description: "Professional employee ID cards",
              price: "₹1,499",
              features: [
                "Up to 500 employees",
                "Department management",
                "Visitor badges",
              ],
              category: "id-cards",
              subCategory: "corporate",
            },
          ],
        },
      ],
    },
    {
      id: "personalised-gifts",
      name: "Personalised Gifts",
      description: "Custom personalized gifts for special occasions",
      icon: GraduationCap, // You might want to use a different icon like Heart
      subCategories: [
        {
          id: "photo-gifts",
          name: "Photo Gifts",
          description: "Personalized photo products",
          products: [
            {
              id: "photo-frames",
              name: "Custom Photo Frames",
              description: "Personalized frames with custom text",
              price: "₹299/piece",
              features: [
                "Multiple sizes",
                "Custom text",
                "High quality print",
                "Fast delivery",
              ],
              category: "personalised-gifts",
              subCategory: "photo-gifts",
            },
            {
              id: "photo-mugs",
              name: "Photo Mugs",
              description: "Custom printed mugs with photos",
              price: "₹199/piece",
              features: [
                "Dishwasher safe",
                "Vibrant colors",
                "Multiple designs",
                "Bulk discounts",
              ],
              category: "personalised-gifts",
              subCategory: "photo-gifts",
              isPopular: true,
            },
          ],
        },
        {
          id: "custom-items",
          name: "Custom Items",
          description: "Various personalized products",
          products: [
            {
              id: "keychains",
              name: "Custom Keychains",
              description: "Personalized keychains in various materials",
              price: "₹99/piece",
              features: [
                "Metal/Plastic options",
                "Laser engraving",
                "Bulk orders",
                "Quick turnaround",
              ],
              category: "personalised-gifts",
              subCategory: "custom-items",
            },
          ],
        },
      ],
    },
    {
      id: "mementos-trophies",
      name: "Mementos & Trophies",
      description: "Awards, trophies, and commemorative items",
      icon: Crown,
      subCategories: [
        {
          id: "trophies",
          name: "Trophies",
          description: "Awards and trophies for competitions",
          products: [
            {
              id: "sports-trophies",
              name: "Sports Trophies",
              description: "Professional sports awards and trophies",
              price: "₹599/piece",
              features: [
                "Multiple designs",
                "Custom engraving",
                "Quality materials",
                "Various sizes",
              ],
              category: "mementos-trophies",
              subCategory: "trophies",
            },
          ],
        },
        {
          id: "mementos",
          name: "Mementos",
          description: "Commemorative items and keepsakes",
          products: [
            {
              id: "crystal-awards",
              name: "Crystal Awards",
              description: "Premium crystal commemorative awards",
              price: "₹1,299/piece",
              features: [
                "Premium crystal",
                "Laser engraving",
                "Gift packaging",
                "Custom shapes",
              ],
              category: "mementos-trophies",
              subCategory: "mementos",
              isPopular: true,
            },
          ],
        },
      ],
    },
    {
      id: "office-stamps",
      name: "Office Stamps",
      description: "Professional stamps and seals for offices",
      icon: Briefcase,
      subCategories: [
        {
          id: "rubber-stamps",
          name: "Rubber Stamps",
          description: "Custom rubber stamps for offices",
          products: [
            {
              id: "basic-stamps",
              name: "Basic Rubber Stamps",
              description: "Standard office rubber stamps",
              price: "₹199/piece",
              features: [
                "Custom text",
                "Durable rubber",
                "Clear impressions",
                "Quick delivery",
              ],
              category: "office-stamps",
              subCategory: "rubber-stamps",
            },
          ],
        },
        {
          id: "self-inking",
          name: "Self-Inking Stamps",
          description: "Convenient self-inking stamp solutions",
          products: [
            {
              id: "self-ink-pro",
              name: "Professional Self-Inking",
              description: "High-quality self-inking stamps",
              price: "₹499/piece",
              features: [
                "No separate ink pad",
                "Thousands of impressions",
                "Custom design",
                "Professional quality",
              ],
              category: "office-stamps",
              subCategory: "self-inking",
              isPopular: true,
            },
          ],
        },
      ],
    },
  ];

  // Replace your state management with this cleaner version:
  const [activeMainCategory, setActiveMainCategory] =
    useState<string>("id-cards");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("schools");

  const currentMainCategory = categorizedProducts.find(
    (cat) => cat.id === activeMainCategory
  );
  const currentSubCategory = currentMainCategory?.subCategories.find(
    (sub) => sub.id === activeSubCategory
  );

  // Fix the useEffect to properly set subcategory
  useEffect(() => {
    if (currentMainCategory && currentMainCategory.subCategories.length > 0) {
      const firstSubCat = currentMainCategory.subCategories[0].id;
      setActiveSubCategory(firstSubCat);
    }
  }, [activeMainCategory]);

  return (
    <div className="w-full bg-[#030303] overflow-auto">
      {/* Hero Section */}
      <HeroGeometric />

      {/* Services Section */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-blue-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Our Services
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Complete digital solution for institutions to manage ID card
              creation efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Building className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">
                  Institution Management
                </CardTitle>
                <CardDescription className="text-white/60">
                  Manage multiple institutions with custom forms and
                  requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Bulk Data Import</CardTitle>
                <CardDescription className="text-white/60">
                  Import student/employee data via CSV and generate unique codes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Smartphone className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Mobile App</CardTitle>
                <CardDescription className="text-white/60">
                  User-friendly mobile app for form submission and photo upload
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section - Cleaner Version */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-rose-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Our Products
            </h2>
          </div>

          {/* Main Categories - Keep as is since they work well */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categorizedProducts.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeMainCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveMainCategory(category.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300",
                    "border backdrop-blur-sm",
                    isActive
                      ? "bg-blue-500/20 border-blue-400/50 text-white scale-105"
                      : "bg-white/[0.03] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sub Categories - Fixed highlighting */}
          {currentMainCategory &&
            currentMainCategory.subCategories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {currentMainCategory.subCategories.map((subCategory) => {
                  const isActive = activeSubCategory === subCategory.id;

                  return (
                    <button
                      key={subCategory.id}
                      onClick={() => {
                        console.log("Clicking subcategory:", subCategory.id); // Debug log
                        setActiveSubCategory(subCategory.id);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                        isActive
                          ? "bg-blue-500/30 text-white border border-blue-400/50"
                          : "bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] border border-transparent"
                      )}
                    >
                      {subCategory.name}
                    </button>
                  );
                })}
              </div>
            )}

          {/* Products Grid - Tighter spacing */}
          {currentSubCategory && (
            <motion.div
              key={`${activeMainCategory}-${activeSubCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center"
            >
              {currentSubCategory.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-blue-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Get In Touch
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Ready to transform your ID card process? Contact us today for a
                demo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-white/60">contact@impressa.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <p className="text-white/60">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Location</h3>
                    <p className="text-white/60">Thiruvananthapuram, Kerala</p>
                  </div>
                </div>
              </div>

              <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Start?
                  </h3>
                  <p className="text-white/60 mb-6">
                    Book a demo and see how Impressa can streamline your ID card
                    management
                  </p>
                  <Button
                    className="bg-blue-500 text-white border-0 hover:bg-blue-600 transition-all duration-300"
                    onClick={() =>
                      window.open("mailto:contact@impressa.com", "_blank")
                    }
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.08] bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02]" />
        <div className="container mx-auto px-4 py-12 md:px-6 relative z-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
                Impressaa
              </h3>
              <p className="mb-4 text-white/60">
                Streamlining ID card management for institutions worldwide.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Quick Links
              </h4>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Support
                </a>
              </nav>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Services
              </h4>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Institution Management
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Form Builder
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Data Import
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Mobile App
                </a>
              </nav>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
              <div className="space-y-2 text-sm text-white/60">
                <p>Thiruvananthapuram, Kerala</p>
                <p>India</p>
                <p>contact@impressaa.com</p>
                <p>+91 9876543210</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-center md:flex-row">
            <p className="text-sm text-white/60">
              © 2025 Impressaa. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm">
              <a
                href="#"
                className="text-white/60 transition-colors hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/60 transition-colors hover:text-white"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
