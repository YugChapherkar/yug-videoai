import UploadSection from "@/components/dashboard/UploadSection";

export default function UploadSectionStoryboard() {
  return (
    <div className="bg-white p-6">
      <UploadSection
        onFileUpload={(files) => console.log("Files uploaded:", files)}
      />
    </div>
  );
}
