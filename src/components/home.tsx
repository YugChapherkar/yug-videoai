import React from "react";
import { Helmet } from "react-helmet";
import Header from "./landing/Header";
import HeroSection from "./landing/HeroSection";
import FeaturesSection from "./landing/FeaturesSection";
import ContentSection from "./landing/ContentSection";
import Footer from "./landing/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>VideoAI - AI-Powered Video Resizer & Format Converter</title>
        <meta
          name="description"
          content="Automatically resize and optimize your videos for every social media platform with our AI-powered tool."
        />
      </Helmet>

      {/* Navigation Header */}
      <Header
        logo="VideoAI"
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ]}
        ctaText="Get Started"
        ctaHref="/dashboard"
      />

      {/* Hero Section */}
      <HeroSection
        title="Resize and Optimize Your Videos for Every Platform in One Click"
        subtitle="Our AI-powered tool automatically adjusts your videos for YouTube, Instagram, TikTok, and more - saving you hours of manual editing work."
        ctaText="Start Now"
        watchDemoText="Watch Demo"
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Content Section with Technology, User Scenarios, and CTA */}
      <ContentSection />

      {/* Pricing Section - Could be added here */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Choose the plan that works best for your video content needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 mb-4">Perfect for getting started</p>
              <div className="text-4xl font-bold mb-6">
                $0
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 5 video
                  conversions per month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Basic platform
                  templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 720p max
                  resolution
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Standard
                  processing speed
                </li>
              </ul>
              <button className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-xl p-8 shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-500 mb-4">For content creators</p>
              <div className="text-4xl font-bold mb-6">
                $19
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 50 video
                  conversions per month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> All platform
                  templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 4K resolution
                  support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Faster
                  processing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Batch
                  processing
                </li>
              </ul>
              <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe Now
              </button>
            </div>

            {/* Business Plan */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-gray-500 mb-4">For teams and agencies</p>
              <div className="text-4xl font-bold mb-6">
                $49
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Unlimited video
                  conversions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Custom
                  templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 8K resolution
                  support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Priority
                  processing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Advanced batch
                  processing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> API access
                </li>
              </ul>
              <button className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                How does the AI video resizing work?
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your video content to identify the most
                important elements and subjects. It then intelligently crops and
                resizes your video to fit different aspect ratios while keeping
                the key content in frame. The AI is trained on thousands of
                videos to understand visual composition and subject tracking.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                What video formats are supported?
              </h3>
              <p className="text-gray-600">
                We support all major video formats including MP4, MOV, AVI, WMV,
                FLV, and more. Our system can convert between these formats
                while optimizing for quality and file size based on your target
                platform.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                How long does processing take?
              </h3>
              <p className="text-gray-600">
                Processing time depends on your video length, resolution, and
                our current server load. Most videos under 5 minutes are
                processed within 2-5 minutes. Longer videos or 4K+ content may
                take longer. Pro and Business plans receive priority processing.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                Can I customize how my video is cropped?
              </h3>
              <p className="text-gray-600">
                Yes! While our AI automatically suggests the best crop, you can
                always preview and adjust the framing before finalizing. The
                dashboard includes an interactive editor where you can fine-tune
                the positioning for each platform.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                Is there a limit to file size or video length?
              </h3>
              <p className="text-gray-600">
                Free accounts can upload videos up to 500MB and 10 minutes in
                length. Pro accounts extend this to 2GB and 30 minutes, while
                Business accounts can process videos up to 10GB and 2 hours in
                length.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
