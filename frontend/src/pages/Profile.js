import React from 'react';

const Profile = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="text-xl font-semibold">Juan Dela Cruz</p>
            <p className="text-gray-500">Productivity Member</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">juan@example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">Productivity Member</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Joined</p>
            <p className="font-medium">January 1, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
