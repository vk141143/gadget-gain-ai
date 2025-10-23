import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, IndianRupee, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DeviceDetails, DiagnosisReport, ExternalCondition } from "@/pages/Index";

type PriceEstimationProps = {
  deviceDetails: DeviceDetails;
  diagnosisReport: DiagnosisReport;
  externalCondition: ExternalCondition;
  photos: string[];
};

type PriceResult = {
  quoted_price: string;
  comments: string;
};

export const PriceEstimation = ({
  deviceDetails,
  diagnosisReport,
  externalCondition,
  photos,
}: PriceEstimationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);

  const estimatePrice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/estimate-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            deviceDetails,
            diagnosisReport,
            externalCondition,
            photos,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get price estimate");
      }

      const data = await response.json();
      setPriceResult(data);

      toast({
        title: "Price Estimated!",
        description: `Your device is valued at ₹${data.quoted_price}`,
      });
    } catch (error) {
      console.error("Price estimation error:", error);
      toast({
        title: "Error",
        description: "Failed to estimate price. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Get Your Quote</h2>
        <p className="text-muted-foreground">
          AI-powered price estimation based on your device details
        </p>
      </div>

      {!priceResult ? (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <IndianRupee className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Get Your Quote?</h3>
            <p className="text-muted-foreground mb-6">
              Our AI will analyze all the information you've provided to give you an
              accurate buyback price for your device.
            </p>
            <Button
              onClick={estimatePrice}
              disabled={isLoading}
              size="lg"
              className="bg-primary hover:bg-primary-hover w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Device...
                </>
              ) : (
                <>
                  <IndianRupee className="mr-2 h-5 w-5" />
                  Get Price Estimate
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-8 bg-gradient-subtle border-2 border-success/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Device Value</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <IndianRupee className="h-8 w-8 text-success" />
                <span className="text-5xl font-bold text-success">
                  {priceResult.quoted_price}
                </span>
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground">{priceResult.comments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device:</span>
                <span className="font-medium">
                  {deviceDetails.brand} {deviceDetails.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variant:</span>
                <span className="font-medium">
                  {deviceDetails.ram} / {deviceDetails.storage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screen Condition:</span>
                <span className="font-medium capitalize">
                  {externalCondition.screenCondition.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Battery:</span>
                <span className="font-medium capitalize">
                  {externalCondition.battery}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Photos:</span>
                <span className="font-medium">{photos.length} uploaded</span>
              </div>
            </div>
          </Card>

          <Button
            onClick={estimatePrice}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recalculate Price
          </Button>
        </>
      )}
    </div>
  );
};
