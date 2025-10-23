import { useState } from "react";
import { DeviceDetailsForm } from "@/components/buyback/DeviceDetailsForm";
import { PhoneDiagnostics } from "@/components/buyback/PhoneDiagnostics";
import { ExternalConditionSurvey } from "@/components/buyback/ExternalConditionSurvey";
import { PhotoUpload } from "@/components/buyback/PhotoUpload";
import { PriceEstimation } from "@/components/buyback/PriceEstimation";
import { StepIndicator } from "@/components/buyback/StepIndicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DeviceDetails = {
  brand: string;
  model: string;
  ram: string;
  storage: string;
  color: string;
  year: string;
  os: string;
  warranty: string;
  hasBox: boolean;
  hasCharger: boolean;
  hasEarphones: boolean;
  purchaseDate?: string;
  imei?: string;
};

export type DiagnosisReport = {
  deviceInfo: any;
  displayTest: boolean;
  microphoneTest: boolean;
  speakerTest: boolean;
  cameraTest: boolean;
  batteryTest: any;
  vibrationTest: boolean;
  networkTest: any;
  bluetoothTest: boolean;
};

export type ExternalCondition = {
  screenCondition: string;
  backPanel: string;
  buttonsAndPorts: string;
  cameraCondition: string;
  frontCamera: string;
  speaker: string;
  microphone: string;
  battery: string;
  wifi: string;
  bluetooth: string;
  mobileNetwork: string;
  simSlot: string;
  fingerprint: string;
  faceUnlock: string;
  gyroscope: string;
  nfc: string;
  vibration: string;
  hasOriginalCharger: boolean;
  hasEarphones: boolean;
  hasBox: boolean;
};

const STEPS = [
  { id: 1, title: "Device Details", description: "Tell us about your phone" },
  { id: 2, title: "Diagnostics", description: "Run internal tests" },
  { id: 3, title: "Condition", description: "External inspection" },
  { id: 4, title: "Photos", description: "Upload images" },
  { id: 5, title: "Price", description: "Get your quote" },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  const [diagnosisReport, setDiagnosisReport] = useState<DiagnosisReport | null>(null);
  const [externalCondition, setExternalCondition] = useState<ExternalCondition | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return deviceDetails !== null;
      case 2:
        return diagnosisReport !== null;
      case 3:
        return externalCondition !== null;
      case 4:
        return photos.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Cash4Device</h1>
          <p className="text-white/90">Get instant cash for your smartphone</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 pb-12">
        <Card className="p-6 shadow-lg">
          {currentStep === 1 && (
            <DeviceDetailsForm
              initialData={deviceDetails}
              onSubmit={(data) => {
                setDeviceDetails(data);
                handleNext();
              }}
            />
          )}

          {currentStep === 2 && (
            <PhoneDiagnostics
              onComplete={(report) => {
                setDiagnosisReport(report);
              }}
            />
          )}

          {currentStep === 3 && (
            <ExternalConditionSurvey
              initialData={externalCondition}
              onSubmit={(data) => {
                setExternalCondition(data);
              }}
            />
          )}

          {currentStep === 4 && (
            <PhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
            />
          )}

          {currentStep === 5 && (
            <PriceEstimation
              deviceDetails={deviceDetails!}
              diagnosisReport={diagnosisReport!}
              externalCondition={externalCondition!}
              photos={photos}
            />
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex gap-4 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                {currentStep === 4 ? "Get Price Estimate" : "Continue"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
