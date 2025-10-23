import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { DeviceDetails } from "@/pages/Index";

type DeviceDetailsFormProps = {
  initialData: DeviceDetails | null;
  onSubmit: (data: DeviceDetails) => void;
};

const BRANDS = [
  "Samsung", "Xiaomi", "Realme", "Oppo", "Vivo", "Apple", 
  "OnePlus", "Motorola", "Nokia", "Google", "Other"
];

const RAM_OPTIONS = ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"];
const STORAGE_OPTIONS = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];

export const DeviceDetailsForm = ({ initialData, onSubmit }: DeviceDetailsFormProps) => {
  const [formData, setFormData] = useState<DeviceDetails>(
    initialData || {
      brand: "",
      model: "",
      ram: "",
      storage: "",
      color: "",
      year: "",
      os: "",
      warranty: "",
      hasBox: false,
      hasCharger: false,
      hasEarphones: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.brand && formData.model && formData.ram && formData.storage;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Device Details</h2>
        <p className="text-muted-foreground">Tell us about your smartphone</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand / Manufacturer *</Label>
          <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
            <SelectTrigger id="brand">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model Name / Number *</Label>
          <Input
            id="model"
            placeholder="e.g., Galaxy S23, iPhone 14"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ram">RAM *</Label>
          <Select value={formData.ram} onValueChange={(value) => setFormData({ ...formData, ram: value })}>
            <SelectTrigger id="ram">
              <SelectValue placeholder="Select RAM" />
            </SelectTrigger>
            <SelectContent>
              {RAM_OPTIONS.map((ram) => (
                <SelectItem key={ram} value={ram}>{ram}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage">Storage *</Label>
          <Select value={formData.storage} onValueChange={(value) => setFormData({ ...formData, storage: value })}>
            <SelectTrigger id="storage">
              <SelectValue placeholder="Select storage" />
            </SelectTrigger>
            <SelectContent>
              {STORAGE_OPTIONS.map((storage) => (
                <SelectItem key={storage} value={storage}>{storage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="e.g., Midnight Black"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year of Release</Label>
          <Input
            id="year"
            type="number"
            placeholder="e.g., 2023"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="os">Operating System & Version</Label>
          <Input
            id="os"
            placeholder="e.g., Android 13, iOS 17"
            value={formData.os}
            onChange={(e) => setFormData({ ...formData, os: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty Status</Label>
          <Select value={formData.warranty} onValueChange={(value) => setFormData({ ...formData, warranty: value })}>
            <SelectTrigger id="warranty">
              <SelectValue placeholder="Select warranty status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-warranty">In Warranty</SelectItem>
              <SelectItem value="out-warranty">Out of Warranty</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date (Optional)</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imei">IMEI Number (Optional)</Label>
          <Input
            id="imei"
            placeholder="15 digits"
            value={formData.imei}
            onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Box & Accessories</Label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBox"
              checked={formData.hasBox}
              onCheckedChange={(checked) => setFormData({ ...formData, hasBox: checked as boolean })}
            />
            <Label htmlFor="hasBox" className="font-normal cursor-pointer">
              Original Box
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCharger"
              checked={formData.hasCharger}
              onCheckedChange={(checked) => setFormData({ ...formData, hasCharger: checked as boolean })}
            />
            <Label htmlFor="hasCharger" className="font-normal cursor-pointer">
              Charger
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasEarphones"
              checked={formData.hasEarphones}
              onCheckedChange={(checked) => setFormData({ ...formData, hasEarphones: checked as boolean })}
            />
            <Label htmlFor="hasEarphones" className="font-normal cursor-pointer">
              Earphones
            </Label>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full bg-primary hover:bg-primary-hover">
        Continue to Diagnostics
      </Button>
    </form>
  );
};
