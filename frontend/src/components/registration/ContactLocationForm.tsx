import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PatientRegistrationFormData, FormErrors } from '../../types/registration';
import { TranslationDictionary } from '../../utils/translations';
import { MAHARASHTRA_DISTRICTS } from '../../utils/maharashtraData';
import { FormField } from './FormField';
import { PhoneInput } from './PhoneInput';
import { SelectField } from './SelectField';

interface ContactLocationFormProps {
  formData: PatientRegistrationFormData;
  errors: FormErrors;
  onChange: (field: keyof PatientRegistrationFormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  t: TranslationDictionary;
}

export const ContactLocationForm: React.FC<ContactLocationFormProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
  t,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(
    formData.locationCoordinates
      ? `${formData.locationCoordinates.latitude.toFixed(4)}° N, ${formData.locationCoordinates.longitude.toFixed(4)}° E`
      : null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // Find talukas for the currently selected district
  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(
    (d) => d.name.toLowerCase() === formData.district.toLowerCase()
  );

  const districtOptions = MAHARASHTRA_DISTRICTS.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const talukaOptions = currentDistrictObj
    ? currentDistrictObj.talukas.map((tk) => ({ value: tk, label: tk }))
    : [{ value: 'Shirpur', label: 'Shirpur' }];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    onChange('district', selectedDistrict);

    // Auto-select first taluka or clear
    const dist = MAHARASHTRA_DISTRICTS.find((d) => d.name === selectedDistrict);
    if (dist && dist.talukas.length > 0) {
      onChange('taluka', dist.talukas[0]);
    } else {
      onChange('taluka', '');
    }
  };

  // Optional "Use Current Location" handler
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t.locationError);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        onChange('locationCoordinates', { latitude, longitude, accuracy });
        setLocationStatus(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError(t.locationError);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-2xs">
      {/* Step Header */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.contactLocationHeading}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.contactLocationDesc}
        </p>
      </div>

      <div className="space-y-5">
        {/* Mobile Number & Alternate Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInput
            id="mobileNumber"
            label={t.mobileLabel}
            required
            value={formData.mobileNumber}
            onChange={(val) => onChange('mobileNumber', val)}
            placeholder={t.mobilePlaceholder}
            error={errors.mobileNumber}
            helpText={t.mobileHelp}
          />

          <PhoneInput
            id="alternateContact"
            label={t.alternateContactLabel}
            value={formData.alternateContact}
            onChange={(val) => onChange('alternateContact', val)}
            placeholder={t.alternateContactPlaceholder}
            error={errors.alternateContact}
          />
        </div>

        {/* Location Section Heading & Optional GPS Locator */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Rural Address Details
            </span>

            {/* Optional Geolocation button */}
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={isLocating}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 hover:text-teal-800 transition-colors cursor-pointer w-fit"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.locatingText}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.useLocationBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Location feedback status badge if captured */}
          {locationStatus && (
            <div className="mb-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.locationSuccess}: {locationStatus}</span>
            </div>
          )}

          {locationError && (
            <div className="mb-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{locationError}</span>
            </div>
          )}

          {/* District & Taluka */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SelectField
              id="district"
              label={t.districtLabel}
              required
              value={formData.district}
              onChange={handleDistrictChange}
              options={districtOptions}
              error={errors.district}
            />

            <SelectField
              id="taluka"
              label={t.talukaLabel}
              required
              value={formData.taluka}
              onChange={(e) => onChange('taluka', e.target.value)}
              options={talukaOptions}
              error={errors.taluka}
            />
          </div>

          {/* Village & PIN Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <FormField
                id="village"
                label={t.villageLabel}
                required
                type="text"
                value={formData.village}
                onChange={(e) => onChange('village', e.target.value)}
                placeholder={t.villagePlaceholder}
                error={errors.village}
              />
            </div>

            <FormField
              id="pinCode"
              label={t.pinCodeLabel}
              required
              type="text"
              inputMode="numeric"
              max={6}
              value={formData.pinCode}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                onChange('pinCode', clean);
              }}
              placeholder={t.pinCodePlaceholder}
              error={errors.pinCode}
            />
          </div>
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-sm font-medium rounded-lg transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
