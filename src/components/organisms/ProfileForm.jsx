import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const ProfileForm = ({ profile, onSave, onCancel, saving = false }) => {
  const [formData, setFormData] = useState({
    name_c: profile?.name_c || '',
    avatar_url_c: profile?.avatar_url_c || '',
    website_c: profile?.website_c || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Name is required';
    }

    if (formData.website_c && !isValidUrl(formData.website_c)) {
      newErrors.website_c = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (formData.avatar_url_c && !isValidUrl(formData.avatar_url_c)) {
      newErrors.avatar_url_c = 'Please enter a valid URL (e.g., https://example.com/avatar.jpg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updateData = {
        ...formData,
        updated_at_c: new Date().toISOString()
      };
      onSave(updateData);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Edit" size={24} className="text-primary-600" />
          <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
        </div>

        {/* Avatar Preview */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {formData.avatar_url_c ? (
              <img 
                src={formData.avatar_url_c} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <ApperIcon 
              name="User" 
              size={24} 
              className="text-primary-600"
              style={{ display: formData.avatar_url_c ? 'none' : 'block' }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Avatar Preview</p>
            <p className="text-xs text-slate-500">
              {formData.avatar_url_c ? 'Image loaded from URL' : 'No image URL provided'}
            </p>
          </div>
        </div>

        <FormField
          label="Name *"
          error={errors.name_c}
          required
        >
          <Input
            type="text"
            value={formData.name_c}
            onChange={(e) => handleChange('name_c', e.target.value)}
            placeholder="Enter your name"
            className={errors.name_c ? 'border-red-300 focus:border-red-500' : ''}
          />
        </FormField>

        <FormField
          label="Avatar URL"
          error={errors.avatar_url_c}
        >
          <Input
            type="url"
            value={formData.avatar_url_c}
            onChange={(e) => handleChange('avatar_url_c', e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className={errors.avatar_url_c ? 'border-red-300 focus:border-red-500' : ''}
          />
          <p className="mt-1 text-xs text-slate-500">
            Enter a URL for your profile picture
          </p>
        </FormField>

        <FormField
          label="Website"
          error={errors.website_c}
        >
          <Input
            type="url"
            value={formData.website_c}
            onChange={(e) => handleChange('website_c', e.target.value)}
            placeholder="https://yourwebsite.com"
            className={errors.website_c ? 'border-red-300 focus:border-red-500' : ''}
          />
          <p className="mt-1 text-xs text-slate-500">
            Your personal or business website
          </p>
        </FormField>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="flex-1"
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;