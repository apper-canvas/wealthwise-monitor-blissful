import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Card } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ProfileForm from '@/components/organisms/ProfileForm';
import { profileService } from '@/services/api/profileService';
import { updateProfile } from '@/store/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      loadProfile();
    }
  }, [isAuthenticated, user?.userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Error loading profile:', err?.response?.data?.message || err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const updatedProfile = await profileService.updateProfile(formData);
      setProfile(updatedProfile);
      dispatch(updateProfile(updatedProfile));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err?.response?.data?.message || err);
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <Error message="Please log in to view your profile" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} />
        <Button 
          onClick={loadProfile} 
          className="mt-4"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ApperIcon name="User" size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <ApperIcon name="Edit" size={16} className="mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url_c ? (
                  <img 
                    src={profile.avatar_url_c} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ApperIcon name="User" size={32} className="text-primary-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {profile?.name_c || user?.firstName || 'No Name'}
                </h2>
                <p className="text-slate-600">
                  {user?.emailAddress || 'No email'}
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-800">
                    {profile?.name_c || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Website
                </label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  {profile?.website_c ? (
                    <a 
                      href={profile.website_c} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      {profile.website_c}
                    </a>
                  ) : (
                    <p className="text-slate-600">Not specified</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Avatar URL
                </label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-800 break-all">
                    {profile?.avatar_url_c || 'Not specified'}
                  </p>
                </div>
              </div>

              {profile?.updated_at_c && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Updated
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">
                      {new Date(profile.updated_at_c).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;