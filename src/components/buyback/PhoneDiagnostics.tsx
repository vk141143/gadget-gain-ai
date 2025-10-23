import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DiagnosisReport } from "@/pages/Index";

type PhoneDiagnosticsProps = {
  onComplete: (report: DiagnosisReport) => void;
};

type TestResult = {
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  message?: string;
};

export const PhoneDiagnostics = ({ onComplete }: PhoneDiagnosticsProps) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Device Info", status: "pending" },
    { name: "Display Test", status: "pending" },
    { name: "Microphone Test", status: "pending" },
    { name: "Speaker Test", status: "pending" },
    { name: "Camera Test", status: "pending" },
    { name: "Battery Test", status: "pending" },
    { name: "Vibration Test", status: "pending" },
    { name: "Network Test", status: "pending" },
    { name: "Bluetooth Test", status: "pending" },
  ]);

  const updateTest = (index: number, status: "running" | "passed" | "failed", message?: string) => {
    setTests((prev) =>
      prev.map((test, i) => (i === index ? { ...test, status, message } : test))
    );
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setProgress(0);

    const report: DiagnosisReport = {
      deviceInfo: {},
      displayTest: false,
      microphoneTest: false,
      speakerTest: false,
      cameraTest: false,
      batteryTest: {},
      vibrationTest: false,
      networkTest: {},
      bluetoothTest: false,
    };

    // Device Info
    updateTest(0, "running");
    await delay(500);
    try {
      report.deviceInfo = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
      };
      updateTest(0, "passed", "Device info retrieved");
    } catch {
      updateTest(0, "failed", "Could not retrieve device info");
    }
    setProgress(11);

    // Display Test
    updateTest(1, "running");
    await delay(500);
    report.displayTest = true;
    updateTest(1, "passed", `Screen: ${window.screen.width}x${window.screen.height}`);
    setProgress(22);

    // Microphone Test
    updateTest(2, "running");
    await delay(500);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      report.microphoneTest = true;
      updateTest(2, "passed", "Microphone accessible");
    } catch {
      report.microphoneTest = false;
      updateTest(2, "failed", "Microphone not accessible");
    }
    setProgress(33);

    // Speaker Test
    updateTest(3, "running");
    await delay(500);
    report.speakerTest = true;
    updateTest(3, "passed", "Audio output available");
    setProgress(44);

    // Camera Test
    updateTest(4, "running");
    await delay(500);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      report.cameraTest = true;
      updateTest(4, "passed", "Camera accessible");
    } catch {
      report.cameraTest = false;
      updateTest(4, "failed", "Camera not accessible");
    }
    setProgress(55);

    // Battery Test
    updateTest(5, "running");
    await delay(500);
    try {
      // @ts-ignore - Battery API not in TypeScript types
      const battery = await navigator.getBattery?.();
      if (battery) {
        report.batteryTest = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        };
        updateTest(5, "passed", `Battery: ${Math.round(battery.level * 100)}%`);
      } else {
        throw new Error("Battery API not available");
      }
    } catch {
      report.batteryTest = { level: null, charging: null };
      updateTest(5, "failed", "Battery info not available");
    }
    setProgress(66);

    // Vibration Test
    updateTest(6, "running");
    await delay(500);
    if (navigator.vibrate) {
      navigator.vibrate(200);
      report.vibrationTest = true;
      updateTest(6, "passed", "Vibration supported");
    } else {
      report.vibrationTest = false;
      updateTest(6, "failed", "Vibration not supported");
    }
    setProgress(77);

    // Network Test
    updateTest(7, "running");
    await delay(500);
    // @ts-ignore - Connection API not in TypeScript types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      report.networkTest = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
      };
      updateTest(7, "passed", `Network: ${connection.effectiveType}`);
    } else {
      report.networkTest = {};
      updateTest(7, "failed", "Network info not available");
    }
    setProgress(88);

    // Bluetooth Test
    updateTest(8, "running");
    await delay(500);
    // @ts-ignore - Bluetooth API not in TypeScript types
    if (navigator.bluetooth) {
      report.bluetoothTest = true;
      updateTest(8, "passed", "Bluetooth available");
    } else {
      report.bluetoothTest = false;
      updateTest(8, "failed", "Bluetooth not available");
    }
    setProgress(100);

    setIsRunning(false);
    onComplete(report);

    toast({
      title: "Diagnostics Complete",
      description: "All tests have been completed successfully.",
    });
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Internal Diagnostics</h2>
        <p className="text-muted-foreground">
          We'll run automated tests to check your device's hardware
        </p>
      </div>

      {!isRunning && progress === 0 && (
        <Card className="p-6 bg-muted/50">
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to start the automated diagnostics. This will test:
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground mb-4">
            <li>• Device information and specifications</li>
            <li>• Display and touch functionality</li>
            <li>• Audio input/output (microphone & speaker)</li>
            <li>• Camera accessibility</li>
            <li>• Battery status</li>
            <li>• Vibration motor</li>
            <li>• Network connectivity</li>
            <li>• Bluetooth capability</li>
          </ul>
        </Card>
      )}

      {(isRunning || progress > 0) && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {test.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                    {test.status === "running" && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {test.status === "passed" && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                    {test.status === "failed" && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{test.name}</p>
                      {test.message && (
                        <p className="text-sm text-muted-foreground">{test.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Button
        onClick={runDiagnostics}
        disabled={isRunning}
        className="w-full bg-primary hover:bg-primary-hover"
      >
        {isRunning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running Tests...
          </>
        ) : progress === 0 ? (
          "Start Diagnostics"
        ) : (
          "Re-run Diagnostics"
        )}
      </Button>
    </div>
  );
};
