import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { ExternalCondition } from "@/pages/Index";

type ExternalConditionSurveyProps = {
  initialData: ExternalCondition | null;
  onSubmit: (data: ExternalCondition) => void;
};

export const ExternalConditionSurvey = ({
  initialData,
  onSubmit,
}: ExternalConditionSurveyProps) => {
  const [formData, setFormData] = useState<ExternalCondition>(
    initialData || {
      screenCondition: "",
      backPanel: "",
      buttonsAndPorts: "",
      cameraCondition: "",
      frontCamera: "",
      speaker: "",
      microphone: "",
      battery: "",
      wifi: "",
      bluetooth: "",
      mobileNetwork: "",
      simSlot: "",
      fingerprint: "",
      faceUnlock: "",
      gyroscope: "",
      nfc: "",
      vibration: "",
      hasOriginalCharger: false,
      hasEarphones: false,
      hasBox: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const ConditionRadioGroup = ({
    name,
    label,
    options,
  }: {
    name: keyof ExternalCondition;
    label: string;
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      <RadioGroup
        value={formData[name] as string}
        onValueChange={(value) => setFormData({ ...formData, [name]: value })}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label htmlFor={`${name}-${option.value}`} className="font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const isValid = formData.screenCondition && formData.backPanel && formData.battery;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">External Condition</h2>
        <p className="text-muted-foreground">
          Help us assess your device's physical and functional condition
        </p>
      </div>

      <div className="space-y-6">
        <ConditionRadioGroup
          name="screenCondition"
          label="Screen Condition"
          options={[
            { value: "perfect", label: "Perfect — No scratches or marks" },
            { value: "minor", label: "Minor Scratches — Light scratches, no display impact" },
            { value: "cracked", label: "Cracked — Broken glass or large cracks" },
            { value: "dead-pixels", label: "Dead Pixels — Small black/white spots" },
            { value: "touch-issues", label: "Touch Issues — Sticky/unresponsive touch" },
          ]}
        />

        <ConditionRadioGroup
          name="backPanel"
          label="Back Panel / Body"
          options={[
            { value: "perfect", label: "Perfect — No scratches/dents" },
            { value: "scratched", label: "Scratched — Visible scratches/scuff marks" },
            { value: "damaged", label: "Damaged — Dents, cracks, major damage" },
            { value: "worn", label: "Paint/Coating Worn — Faded or peeled" },
          ]}
        />

        <ConditionRadioGroup
          name="buttonsAndPorts"
          label="Buttons & Ports"
          options={[
            { value: "working", label: "All Working — Perfect" },
            { value: "minor", label: "Minor Issues — Some stick/loose" },
            { value: "non-functional", label: "Non-functional — Some not working" },
            { value: "charging-issues", label: "Charging Port Issues — Loose or inconsistent" },
          ]}
        />

        <ConditionRadioGroup
          name="cameraCondition"
          label="Rear Camera"
          options={[
            { value: "functional", label: "Fully Functional" },
            { value: "minor", label: "Minor Issues — Slight blur/focus/flash issues" },
            { value: "damaged", label: "Damaged — Broken lens or not working" },
          ]}
        />

        <ConditionRadioGroup
          name="frontCamera"
          label="Front Camera"
          options={[
            { value: "functional", label: "Fully Functional" },
            { value: "minor", label: "Minor Issues" },
            { value: "damaged", label: "Damaged / Not working" },
          ]}
        />

        <ConditionRadioGroup
          name="speaker"
          label="Speaker & Audio"
          options={[
            { value: "perfect", label: "Perfect" },
            { value: "minor", label: "Minor Issues" },
            { value: "damaged", label: "Damaged / Not working" },
          ]}
        />

        <ConditionRadioGroup
          name="microphone"
          label="Microphone"
          options={[
            { value: "functional", label: "Fully Functional" },
            { value: "minor", label: "Minor Issues" },
            { value: "damaged", label: "Damaged" },
          ]}
        />

        <ConditionRadioGroup
          name="battery"
          label="Battery & Charging"
          options={[
            { value: "excellent", label: "Excellent — Charges fast, holds well" },
            { value: "average", label: "Average — Some drain/heating" },
            { value: "poor", label: "Poor — Quick drain, heating" },
            { value: "non-functional", label: "Non-functional" },
          ]}
        />

        <ConditionRadioGroup
          name="wifi"
          label="Wi-Fi"
          options={[
            { value: "working", label: "Works perfectly" },
            { value: "issues", label: "Issues" },
            { value: "not-working", label: "Not Working" },
          ]}
        />

        <ConditionRadioGroup
          name="bluetooth"
          label="Bluetooth"
          options={[
            { value: "working", label: "Works perfectly" },
            { value: "issues", label: "Issues" },
            { value: "not-working", label: "Not Working" },
          ]}
        />

        <ConditionRadioGroup
          name="mobileNetwork"
          label="Mobile Network"
          options={[
            { value: "working", label: "4G/5G working" },
            { value: "partial", label: "Partial" },
            { value: "not-working", label: "Not working" },
          ]}
        />

        <ConditionRadioGroup
          name="simSlot"
          label="SIM Slot"
          options={[
            { value: "both", label: "Both working" },
            { value: "one", label: "Only one" },
            { value: "not-working", label: "Not working" },
          ]}
        />

        <ConditionRadioGroup
          name="fingerprint"
          label="Fingerprint Sensor"
          options={[
            { value: "working", label: "Working" },
            { value: "minor", label: "Minor Issues" },
            { value: "not-working", label: "Not working" },
            { value: "na", label: "Not Available" },
          ]}
        />

        <ConditionRadioGroup
          name="faceUnlock"
          label="Face Unlock"
          options={[
            { value: "working", label: "Working" },
            { value: "minor", label: "Minor Issues" },
            { value: "not-working", label: "Not working" },
            { value: "na", label: "Not Available" },
          ]}
        />

        <ConditionRadioGroup
          name="gyroscope"
          label="Gyroscope / Accelerometer"
          options={[
            { value: "working", label: "Working" },
            { value: "minor", label: "Minor Issues" },
            { value: "not-working", label: "Not working" },
          ]}
        />

        <ConditionRadioGroup
          name="nfc"
          label="NFC"
          options={[
            { value: "working", label: "Working" },
            { value: "minor", label: "Minor Issues" },
            { value: "not-working", label: "Not working" },
            { value: "na", label: "Not Available" },
          ]}
        />

        <ConditionRadioGroup
          name="vibration"
          label="Vibration / Haptics"
          options={[
            { value: "working", label: "Working" },
            { value: "minor", label: "Minor Issues" },
            { value: "not-working", label: "Not working" },
          ]}
        />

        <div className="space-y-3">
          <Label className="text-base font-semibold">Accessories</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOriginalCharger"
                checked={formData.hasOriginalCharger}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasOriginalCharger: checked as boolean })
                }
              />
              <Label htmlFor="hasOriginalCharger" className="font-normal cursor-pointer">
                Original Charger — Present
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEarphones"
                checked={formData.hasEarphones}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasEarphones: checked as boolean })
                }
              />
              <Label htmlFor="hasEarphones" className="font-normal cursor-pointer">
                Earphones — Present
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBox"
                checked={formData.hasBox}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasBox: checked as boolean })
                }
              />
              <Label htmlFor="hasBox" className="font-normal cursor-pointer">
                Box — Present
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full bg-primary hover:bg-primary-hover">
        Continue to Photos
      </Button>
    </form>
  );
};
