import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Code, Cpu, Cloud, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContentSectionProps {
  className?: string;
}

const ContentSection = ({ className }: ContentSectionProps = {}) => {
  return (
    <section className={cn("py-24 bg-slate-50 dark:bg-slate-900", className)}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powered by Advanced Technology
            </h2>
            <p className="max-w-[900px] text-slate-500 dark:text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered video processing engine uses cutting-edge
              algorithms to deliver perfect results every time.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&q=80"
                alt="AI Video Processing Technology"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">How Our Technology Works</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Our platform leverages advanced machine learning algorithms and
              computer vision techniques to analyze your videos and
              automatically determine the optimal crop and format for each
              social media platform.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Cpu className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">AI-Powered Analysis</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Our AI identifies the most important elements in your video
                    to ensure they remain in frame after resizing.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Code className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">FFmpeg Integration</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We use industry-standard FFmpeg libraries for high-quality
                    video processing and format conversion.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Cloud className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Cloud Processing</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    All processing happens in the cloud, so you don't need
                    powerful hardware to create professional-quality videos.
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-10">
            User Scenarios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Creators</CardTitle>
                <CardDescription>
                  Perfect for YouTubers and social media influencers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  "I used to spend hours reformatting my videos for different
                  platforms. Now I just upload once and get perfectly optimized
                  versions for all my channels in minutes!"
                </p>
                <div className="flex items-center mt-4 space-x-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    alt="Alex, Content Creator"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <p className="text-xs text-slate-500">1.2M Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Marketing Teams</CardTitle>
                <CardDescription>
                  Streamline your social media workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  "Our team manages campaigns across 6 different platforms. This
                  tool has cut our video production time in half and improved
                  engagement rates by 35%."
                </p>
                <div className="flex items-center mt-4 space-x-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    alt="Sarah, Marketing Director"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">Sarah Chen</p>
                    <p className="text-xs text-slate-500">
                      Marketing Director, TechBrand
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprises</CardTitle>
                <CardDescription>
                  Scale your video content production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  "We process hundreds of product videos monthly. The batch
                  processing and cloud integration have revolutionized our
                  content pipeline."
                </p>
                <div className="flex items-center mt-4 space-x-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                    alt="Michael, Product Manager"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">Michael Rodriguez</p>
                    <p className="text-xs text-slate-500">
                      Product Manager, Enterprise Co.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Ready to transform your video workflow?
            </h2>
            <p className="max-w-[600px] text-slate-500 dark:text-slate-400">
              Join thousands of content creators and businesses who have
              simplified their video production process.
            </p>
          </div>
          <Button size="lg" className="mt-4 group">
            Try it for free
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContentSection;
