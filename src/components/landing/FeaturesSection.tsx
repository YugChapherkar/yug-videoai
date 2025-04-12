import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Crop, FileVideo, Layers, Zap, Cloud, Eye } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col items-center p-6 rounded-xl bg-white",
        "border border-gray-100 shadow-sm hover:shadow-md transition-all",
        "text-center h-full",
      )}
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Crop size={24} />,
      title: "Automatic Resizing",
      description:
        "AI-powered smart cropping that keeps the important content in frame, no matter the aspect ratio.",
    },
    {
      icon: <FileVideo size={24} />,
      title: "Format Conversion",
      description:
        "Convert between any video format with optimized compression to maintain quality while reducing file size.",
    },
    {
      icon: <Layers size={24} />,
      title: "Platform Templates",
      description:
        "Pre-configured settings for all major platforms including YouTube, Instagram, TikTok, and more.",
    },
    {
      icon: <Eye size={24} />,
      title: "Real-time Preview",
      description:
        "See exactly how your video will look on each platform before finalizing the conversion.",
    },
    {
      icon: <Zap size={24} />,
      title: "Batch Processing",
      description:
        "Process multiple videos simultaneously to save time and streamline your workflow.",
    },
    {
      icon: <Cloud size={24} />,
      title: "Cloud Integration",
      description:
        "Seamlessly save and share your processed videos to popular cloud storage services.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered video processing tool offers everything you need to
            optimize your content for any platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
